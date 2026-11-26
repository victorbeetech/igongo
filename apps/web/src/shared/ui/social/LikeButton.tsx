"use client";
// The heart button with a count, for posts, faults and checkups.

import { Heart } from "lucide-react";
import { Button } from "@/shared/ui/button/Button";

/** Like or unlike; disabled without the like permission. */
export function LikeButton({ likes, liked, disabled, onClick }: { likes: number; liked?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <Button variant="text" icon={<Heart size={16} aria-hidden fill={liked ? "currentColor" : "none"} />} onClick={onClick} disabled={disabled}>
      {`${likes} like${likes === 1 ? "" : "s"}`}
    </Button>
  );
}
