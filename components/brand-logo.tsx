"use client";

import { useId } from "react";

/** Recolor the supplied mark at render time; never redraw its lettering. */
export function BrandLogo({ className = "" }: { className?: string }) {
  const filterId = `brand-${useId().replace(/:/g, "")}`;
  return <svg className={className} viewBox="-5 173 460 135" role="img" aria-label="Van Gogh">
    <defs>
      <filter id={filterId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        {/* White becomes opaque; the source red (#b42a2a) becomes transparent. */}
        <feColorMatrix type="matrix" values="0 0 0 0 .705882  0 0 0 0 .164706  0 0 0 0 .164706  0 1.197183 0 0 -.197183" />
      </filter>
    </defs>
    <g transform="rotate(12 223.5 225)">
      <image href="/van-gogh-original.png" width="447" height="447" filter={`url(#${filterId})`} />
    </g>
  </svg>;
}
