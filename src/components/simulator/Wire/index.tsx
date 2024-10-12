import { roundCommands } from "svg-round-corners";
import { Pos } from "../../../common/types";
import { useEffect, useState } from "react";
import useContextMenu from "../../../hooks/useContextMenu";
import { SimulatorActions, useSimulatorStore } from "../../../store/simulatorStore";
import WireEntity from "../../../entities/WireEntity";
import DeleteContextMenu from "../DeleteContextMenu";

interface Props {
  wire?: WireEntity; // wire won't be present while wiring, only the points
  points: Pos[];
  active: boolean;
  editable?: boolean;
}

const CORNER_RADIUS = 7;

export default function Wire({ wire, points, active, editable }: Props) {
  const { handleContextMenu, showContextMenu } = useContextMenu(editable);

  const [path, setPath] = useState<string>("");
  const [pathStyle, setPathStyle] = useState<string>("");
  const [hovering, setHovering] = useState<boolean>(false);

  const removeWire = useSimulatorStore((actions: SimulatorActions) => actions.removeWire);

  const handleDeleteClick = () => {
    if (!wire) {
      return;
    }

    removeWire(wire);
  };

  useEffect(() => {
    setPathStyle(
      `stroke-[4px] ${active ? "stroke-red-500" : "stroke-zinc-700"} ${wire && "hover:stroke-violet-500"}`,
    );
  }, [active, wire]);

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

  return (
    <g>
      <path
        className={pathStyle}
        fill="none"
        d={path}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      />
      {wire &&
        hovering &&
        points.map((pos) => {
          return <circle cx={pos.x} cy={pos.y} r={7} fill="#0ea5e9" />;
        })}
      <foreignObject
        x={(points[0].x + points[points.length - 1].x) / 2}
        y={(points[0].y + points[points.length - 1].y) / 2}
        width={1}
        height={1}
        className="overflow-visible"
      >
        <DeleteContextMenu
          name="Wire"
          show={showContextMenu}
          handleDeleteClick={handleDeleteClick}
        />
      </foreignObject>
    </g>
  );
}
