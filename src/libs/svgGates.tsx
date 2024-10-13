import { ReactNode } from "react";

interface SVGGate {
  width: number;
  height: number;
  svg: ReactNode;
}

export const svgGates = new Map<string, SVGGate>();
svgGates.set("AND", {
  width: 100,
  height: 60,
  svg: (
    <>
      <path
        className="stroke-violet-500 stroke-[5]"
        d="M 80 30 L 100 30 M 0 15 L 20 15 M 0 45 L 20 45"
        strokeWidth={5}
      />
      <path
        className="fill-violet-500"
        d="M 20 0 L 50 0 C 66 0 80 13 80 30 C 80 46 66 60 50 60 L 20 60 Z"
      />
    </>
  ),
});
