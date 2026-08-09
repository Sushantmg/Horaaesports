export default function NepalFlag({ size = 18 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 34"
      width={size}
      height={Math.round(size * 1.42)}
      aria-hidden="true"
      className="nepal-flag"
    >
      <path d="M4 0 L21 17.5 L13.5 17.5 L21 34 L4 34 Z" fill="#003893" />
      <path d="M6.4 1.8 L18.6 15.9 L12.4 15.9 L17.8 32.2 L6.4 32.2 Z" fill="#c8102e" />
      <circle cx="12.6" cy="9.4" r="2.5" fill="#fff" />
      <circle cx="14.6" cy="25.2" r="3.2" fill="#fff" />
      <circle cx="13.1" cy="23.7" r="2.7" fill="#c8102e" />
    </svg>
  );
}
