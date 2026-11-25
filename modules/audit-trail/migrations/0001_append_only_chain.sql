-- Makes audit.events append-only and hash-chained (hand-written migration).
--
-- 1. A sequence gives each row its place in the chain. It is taken inside
--    the insert trigger while holding a lock, so rows are chained in the
--    exact order they are committed.
-- 2. audit.entry_text(row) is the one canonical text that is hashed. The
--    verify route uses the same function, so the two can never disagree.
-- 3. Triggers refuse UPDATE, DELETE and TRUNCATE for every database user.
-- 4. A generated full-text column makes "who did X years ago" searches fast.
CREATE SEQUENCE "audit"."events_seq";
--> statement-breakpoint
CREATE FUNCTION "audit"."entry_text"(e "audit"."events") RETURNS text
LANGUAGE sql IMMUTABLE AS $$
  SELECT concat_ws('|',
    e.prev_hash, e.seq::text, e.id,
    to_char(e.occurred_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'),
    coalesce(e.actor_id, ''), coalesce(e.actor_name, ''), coalesce(e.actor_role, ''),
    e.action, e.module, coalesce(e.record_type, ''), coalesce(e.record_id, ''),
    e.summary, coalesce(e.changes::text, ''), coalesce(e.context::text, ''))
$$;
--> statement-breakpoint
CREATE FUNCTION "audit"."chain_entry"() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE last_hash text;
BEGIN
  -- One writer at a time, held until commit, so the chain never forks.
  PERFORM pg_advisory_xact_lock(hashtext('audit.events'));
  SELECT hash INTO last_hash FROM "audit"."events" ORDER BY seq DESC LIMIT 1;
  NEW.seq := nextval('"audit"."events_seq"');
  NEW.prev_hash := coalesce(last_hash, repeat('0', 64));
  NEW.hash := encode(sha256(convert_to("audit"."entry_text"(NEW), 'UTF8')), 'hex');
  RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER "events_chain" BEFORE INSERT ON "audit"."events"
  FOR EACH ROW EXECUTE FUNCTION "audit"."chain_entry"();
--> statement-breakpoint
CREATE FUNCTION "audit"."refuse_change"() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit.events is append-only: % is not allowed', TG_OP;
END $$;
--> statement-breakpoint
CREATE TRIGGER "events_no_update_delete" BEFORE UPDATE OR DELETE ON "audit"."events"
  FOR EACH ROW EXECUTE FUNCTION "audit"."refuse_change"();
--> statement-breakpoint
CREATE TRIGGER "events_no_truncate" BEFORE TRUNCATE ON "audit"."events"
  FOR EACH STATEMENT EXECUTE FUNCTION "audit"."refuse_change"();
--> statement-breakpoint
ALTER TABLE "audit"."events" ADD COLUMN "search" tsvector
  GENERATED ALWAYS AS (to_tsvector('simple', coalesce(summary, '') || ' ' || coalesce(actor_name, '') || ' ' || action)) STORED;
--> statement-breakpoint
CREATE INDEX "events_search_idx" ON "audit"."events" USING gin ("search");
