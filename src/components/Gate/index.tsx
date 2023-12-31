import { Pos } from "../../common/types";

interface Props {
  id: number;
  name: string;
  pos: Pos;
  height: number;
  width: number;
  inputs: number;
  outputs: number;
  setIsDraggingGate: (isDragging: boolean) => void;
  setSelectedGate: (id: number) => void;
}

export default function Gate({
  id,
  name,
  pos,
  height,
  width,
  setIsDraggingGate,
  setSelectedGate,
}: Props) {
  const handleMouseDown = () => {
    setIsDraggingGate(true);
    setSelectedGate(id);
  };

  return (
    <>
      <rect
        className="fill-violet-500"
        x={pos.x}
        y={pos.y}
        width={width}
        height={height}
        rx={5}
        ry={5}
        onMouseDown={handleMouseDown}
      />
      <text
        className="fill-indigo-950 select-none"
        x={pos.x + width / 2}
        y={pos.y + height / 2}
        dominantBaseline="middle"
        textAnchor="middle"
        fontWeight={"bold"}
        fontSize={20}
        fontFamily={"Inter"}
        onMouseDown={handleMouseDown}
      >
        {name}
      </text>
    </>
  );
}
