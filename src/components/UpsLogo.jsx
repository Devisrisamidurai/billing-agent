/**
 * UPS shield logo (SVG approximation using the UPS brown + gold palette).
 * Sized via the `size` prop; defaults to 64px tall.
 */
function UpsLogo({ size = 64 }) {
  const width = (size * 116) / 140

  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 116 140"
      role="img"
      aria-label="UPS"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield body */}
      <path
        d="M58 4C40 12 22 15 6 15c0 0 0 46 0 62 0 34 24 51 52 59 28-8 52-25 52-59 0-16 0-62 0-62-16 0-34-3-52-11Z"
        fill="#341B14"
      />
      {/* Golden bow / package knot on top */}
      <path
        d="M58 22c8 6 20 8 30 8-6 6-16 10-30 15-14-5-24-9-30-15 10 0 22-2 30-8Z"
        fill="#FFB500"
      />
      {/* "ups" wordmark */}
      <text
        x="58"
        y="112"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontStyle="italic"
        fontSize="46"
        fill="#FFB500"
      >
        ups
      </text>
    </svg>
  )
}

export default UpsLogo
