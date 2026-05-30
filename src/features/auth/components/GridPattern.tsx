import React from "react";

interface GridPatternProps {
  /** Size of each grid cell in pixels. Default: 40 */
  cellSize?: number;
  /** Stroke color of grid lines. Default: "#58a6ff" */
  lineColor?: string;
  /** Opacity of the grid (0–1). Default: 0.15 */
  opacity?: number;
  /** Stroke width of grid lines. Default: 1 */
  strokeWidth?: number;
  /** Fade the grid toward the edges with a radial mask. Default: true */
  fade?: boolean;
  /** Render subtle dots at line intersections. Default: false */
  showDots?: boolean;
  /** Additional classes on the wrapper svg */
  className?: string;
}

const GridPattern: React.FC<GridPatternProps> = ({
  cellSize = 40,
  lineColor = "#58a6ff",
  opacity = 0.15,
  strokeWidth = 1,
  fade = true,
  showDots = false,
  className = "",
}) => {
  const patternId = React.useId();
  const maskId = React.useId();

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity }}
    >
      <defs>
        <pattern
          id={patternId}
          width={cellSize}
          height={cellSize}
          patternUnits="userSpaceOnUse"
          x="-1"
          y="-1"
        >
          <path
            d={`M.5 ${cellSize}V.5H${cellSize}`}
            fill="none"
            stroke={lineColor}
            strokeWidth={strokeWidth}
          />
          {showDots && (
            <circle cx="0.5" cy="0.5" r="1" fill={lineColor} opacity="0.6" />
          )}
        </pattern>

        {fade && (
          <radialGradient id={maskId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="70%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        )}

        {fade && (
          <mask id={`${maskId}-mask`}>
            <rect width="100%" height="100%" fill={`url(#${maskId})`} />
          </mask>
        )}
      </defs>

      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId})`}
        mask={fade ? `url(#${maskId}-mask)` : undefined}
      />
    </svg>
  );
};

export default GridPattern;