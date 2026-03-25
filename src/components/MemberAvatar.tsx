// src/components/MemberAvatar.tsx
//
// Drop-in replacement for Avatar + AvatarImage + AvatarFallback pattern.
// Shows a skeleton shimmer while the photo loads, fades in smoothly,
// and falls back to initials if the image fails or has no src.
//
// Usage:
//   <MemberAvatar
//     src={getFullPhotoUrl(member.photo)}
//     firstName={member.firstName}
//     lastName={member.lastName}
//     size="md"
//   />

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MemberAvatarProps {
  src?: string;
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_MAP = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-20 w-20 text-2xl",
};

type LoadState = "idle" | "loading" | "loaded" | "error";

const MemberAvatar = ({
  src,
  firstName,
  lastName,
  size = "md",
  className,
}: MemberAvatarProps) => {
  const [loadState, setLoadState] = useState<LoadState>(src ? "loading" : "idle");
  const imgRef = useRef<HTMLImageElement | null>(null);

  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  const sizeClass = SIZE_MAP[size];

  // Reset state when src changes
  useEffect(() => {
    if (!src) {
      setLoadState("idle");
      return;
    }

    setLoadState("loading");

    // Use a standalone Image to preload — avoids flicker
    const img = new Image();
    img.src = src;
    imgRef.current = img;

    img.onload = () => setLoadState("loaded");
    img.onerror = () => setLoadState("error");

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden shrink-0",
        sizeClass,
        className
      )}
    >
      {/* Skeleton shimmer — visible while loading */}
      {loadState === "loading" && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Actual image — fades in */}
      {loadState === "loaded" && src && (
        <img
          src={src}
          alt={`${firstName} ${lastName}`}
          className="absolute inset-0 h-full w-full object-cover rounded-full animate-fade-in"
        />
      )}

      {/* Initials fallback — shown when idle or errored */}
      {(loadState === "idle" || loadState === "error") && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary text-secondary-foreground font-semibold rounded-full">
          {initials || "?"}
        </div>
      )}
    </div>
  );
};

export default MemberAvatar;