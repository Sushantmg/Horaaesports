const UPPER_RAYS = [11.25, 33.75, 56.25, 78.75, 101.25, 123.75, 191.25, 213.75, 236.25, 258.75, 281.25, 303.75];
const LOWER_RAYS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

export default function NepalFlag({ size = 18 }: { size?: number }) {
  return (
    <svg
      viewBox="-17.582 -4.664 71.571 87.246"
      width={size}
      height={Math.round(size * 1.219)}
      aria-hidden="true"
      className="nepal-flag"
    >
      <path d="M -15,37.5735931288 h 60 L -15,0 v 80 h 60 L -15,20 z" fill="#DC143C" />
      <path d="M -15,37.5735931288 h 60 L -15,0 v 80 h 60 L -15,20 z" fill="#DC143C" stroke="#003893" strokeWidth="5.165" />
      <g fill="#fff">
        <path d="M -11.9502769431,23.4834957055 A 12.8400974233,12.8400974233 0 0,0 11.9502769431,23.4834957055 A 11.9502769431 11.9502769431 0 0,1 -11.9502769431,23.4834957055" />
        <g transform="translate(0 29.045) scale(5.56106)">
          <circle r="1" />
          {UPPER_RAYS.map((r) => (
            <path
              key={r}
              transform={`rotate(${r})`}
              d="M 0.195090322016,-0.980785280403 L 0,-1.388784109750 L -0.195090322016,-0.980785280403"
            />
          ))}
        </g>
        <g transform="matrix(8.1434 0 0 8.1434 0 58.787)">
          <circle r="1" />
          {LOWER_RAYS.map((r) => (
            <path
              key={r}
              transform={`rotate(${r})`}
              d="M 0.258819045103,0.965925826289 L 0,1.576749285537 L -0.258819045103,0.965925826289"
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
