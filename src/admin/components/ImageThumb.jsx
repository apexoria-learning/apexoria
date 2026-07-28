import React from "react";
import { ImageIcon } from "lucide-react";

/**
 * ImageThumb — square/rect image preview with graceful fallback.
 *
 * Props:
 *   src        Image URL. Empty/null renders the placeholder.
 *   alt        Alt text.
 *   aspect     Tailwind aspect-* class (e.g. "aspect-square", "aspect-[3/2]").
 *   width      Tailwind width class (default "w-24").
 *   className  Extra classes.
 */
export default function ImageThumb({
  src,
  alt = "",
  aspect = "aspect-square",
  width = "w-24",
  className = "",
}) {
  return (
    <div
      className={`${width} ${aspect} shrink-0 rounded-lg overflow-hidden bg-slate-100 ring-1 ring-slate-200 flex items-center justify-center ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <ImageIcon className="w-6 h-6 text-slate-300" aria-hidden="true" />
      )}
    </div>
  );
}
