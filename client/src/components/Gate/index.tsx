import { Pos } from "../../common/types";
import { getGateDimensions } from "../../libs/gate";

interface Props {
  id: number;
  name: string;
  pos: Pos;  
  inputs: number;
  outputs: number;
  setIsDraggingGate: (isDragging: boolean) => void;
  setSelectedGate: (id: number) => void;
}

export default function Gate({
  id,
  name,
  pos,  
  inputs,
  outputs,
  setIsDraggingGate,
  setSelectedGate,
}: Props) {
  const handleMouseDown = () => {
    setIsDraggingGate(true);
    setSelectedGate(id);
  };

  const dimensions = getGateDimensions(name, inputs, outputs);  

  return (
    <>
      <rect
        className="fill-violet-500"
        x={pos.x}
        y={pos.y}
        width={dimensions.width}
        height={dimensions.height}
        rx={5}
        ry={5}
        onMouseDown={handleMouseDown}
      />
      <text
        className="fill-indigo-950 select-none"
        x={pos.x + dimensions.width / 2}
        y={pos.y + dimensions.height / 2 + 2}
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
