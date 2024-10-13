import { ReactNode } from "react";

interface SVGGate {
  width: number;
  height: number;
  textOffset: number;
  svg: ReactNode;
}

export const svgGates = new Map<string, SVGGate>();
svgGates.set("AND", {
  width: 100,
  height: 60,
  textOffset: 0,
  svg: (
    <>
      <path
        className="stroke-violet-500 stroke-[5] fill-none"
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
svgGates.set("NAND", {
  width: 100,
  height: 60,
  textOffset: 0,
  svg: (
    <>
      <path
        className="stroke-violet-500 stroke-[5] fill-none"
        d="M 80 30 L 100 30 M 0 15 L 20 15 M 0 45 L 20 45"
      />
      <path
        className="fill-violet-500"
        d="M 20 0 L 50 0 C 66.57 0 80 13.43 80 30 C 80 46.57 66.57 60 50 60 L 20 60 Z"
      />
      <ellipse className="fill-violet-500" cx="83.75" cy="30" rx="5" ry="5" />
    </>
  ),
});
svgGates.set("OR", {
  width: 100,
  height: 60,
  textOffset: -5,
  svg: (
    <>
      <path
        className="stroke-violet-500 stroke-[5] fill-none"
        d="M 80 30 L 100 30 M 0 15 L 23 15 M 0 45 L 23 45"
      />
      <path
        className="fill-violet-500"
        d="M 40 0 C 57.47 0.56 73.06 12.25 80 30 C 73.06 47.75 57.47 59.44 40 60 L 15 60 C 25.72 41.44 25.72 18.56 15 0 Z"
      />
    </>
  ),
});
svgGates.set("NOR", {
  width: 100,
  height: 60,
  textOffset: -2,
  svg: (
    <>
      <path
        className="stroke-violet-500 stroke-[5] fill-none"
        d="M 80 30 L 100 30 M 0 15 L 23 15 M 0 45 L 23 45"
      />
      <path
        className="fill-violet-500"
        d="M 40 0 C 57.47 0.56 73.06 12.25 80 30 C 73.06 47.75 57.47 59.44 40 60 L 15 60 C 25.72 41.44 25.72 18.56 15 0 Z"
      />
      <ellipse className="fill-violet-500" cx="83.75" cy="30" rx="5" ry="5" />
    </>
  ),
});
svgGates.set("XOR", {
  width: 100,
  height: 60,
  textOffset: -2,
  svg: (
    <>
      <path
        className="stroke-violet-500 stroke-[5] fill-none"
        d="M 80 30 L 100 30 M 0 15 L 23 15 M 0 45 L 23 45"
      />
      <path
        className="stroke-violet-500 stroke-[5] fill-none"
        d="M 10 0 C 20.72 18.56 20.72 41.44 10 60"
      />
      <path
        className="fill-violet-500"
        d="M 40 0 C 57.47 0.56 73.06 12.25 80 30 C 73.06 47.75 57.47 59.44 40 60 L 15 60 C 25.72 41.44 25.72 18.56 15 0 Z"
      />
    </>
  ),
});
svgGates.set("NOT", {
  width: 100,
  height: 60,
  textOffset: -6,
  svg: (
    <>
      <path
        className="stroke-violet-500 stroke-[5] fill-none"
        d="M 80 30 L 100 30 M 0 30 L 23 30"
      />
      <path className="fill-violet-500" d="M 20 0 L 80 30 L 20 60 Z" />
      <ellipse className="fill-violet-500" cx="83.75" cy="30" rx="5" ry="5" />
    </>
  ),
});
