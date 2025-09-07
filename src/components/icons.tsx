import type { SVGProps } from "react";

export function PrarambhIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 3v18h2.5c4.14 0 7.5-3.36 7.5-7.5S14.64 3 10.5 3H8z" />
    </svg>
  );
}
