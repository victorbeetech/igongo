/** The result of checking the hash chain for tampering. */

export interface ChainCheck {
  /** True when every checked row's hash and link are correct. */
  intact: boolean;
  /** How many rows were checked. */
  checked: number;
  /** The first row that does not match, when one exists. */
  brokenAtSeq: number | null;
}
