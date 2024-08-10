import { MouseEvent } from "react";
import GateEntity from "../../../entities/GateEntity";

interface Props {
  gate: GateEntity;
  onClick?: (event: MouseEvent, gate: GateEntity) => void;
}

export default function Gate({ gate, onClick }: Props) {
  return (
    <>
      <rect
        className="fill-violet-500"
        x={gate.pos.x}
        y={gate.pos.y}
        width={gate.width}
        height={gate.height}
        rx={5}
        ry={5}
        onMouseDown={(event) => onClick?.(event, gate)}
      />
      <text
        className="fill-indigo-950 select-none"
        x={gate.pos.x + gate.width / 2}
        y={gate.pos.y + gate.height / 2 + 2}
        dominantBaseline="middle"
        textAnchor="middle"
        fontWeight={"bold"}
        fontSize={20}
        fontFamily={"Inter"}
        onMouseDown={(event) => onClick?.(event, gate)}
      >
        {gate.type.name}
      </text>
    </>
  );
}
