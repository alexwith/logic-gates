import { roundCommands } from "svg-round-corners";
import { Pos } from "../../common/types";
import { useEffect, useState } from "react";

interface Props {
  points: Pos[];
  active: boolean;
}

const CORNER_RADIUS = 7;

export default function Wire({ points, active }: Props) {
  const [path, setPath] = useState<string>("");
  const [pathStyle, setPathStyle] = useState<string>("");

  useEffect(() => {
    setPathStyle(`stroke-[4px] ${active ? "stroke-red-500" : "stroke-slate-700"}`);
  }, [active]);

  useEffect(() => {
    const pathCommands: any = [];
    points.forEach((point, i) => {
      if (i === 0) {
        pathCommands.push({ marker: "M", values: point });
        return;
      }

      pathCommands.push({ marker: "L", values: point });
    });

    setPath(roundCommands(pathCommands, CORNER_RADIUS).path);
  }, [points]);

  return <path className={pathStyle} fill="none" d={path} />;
}
