import { MouseEvent } from "react";
import GateEntity from "../../../entities/GateEntity";
import useContextMenu from "../../../hooks/useContextMenu";
import { svgGates } from "../../../libs/svgGates";
import { SimulatorActions, SimulatorState, useSimulatorStore } from "../../../store/simulatorStore";
import ElementContextMenu from "../DeleteContextMenu";

interface Props {
  gate: GateEntity;
  onClick?: (event: MouseEvent, gate: GateEntity) => void;
  editable?: boolean;
}

export default function Gate({ gate, onClick, editable }: Props) {
  const { handleContextMenu, showContextMenu } = useContextMenu(editable);

  const wires = useSimulatorStore((state: SimulatorState) => state.wires);

  const removeGate = useSimulatorStore((actions: SimulatorActions) => actions.removeGate);
  const removeWire = useSimulatorStore((actions: SimulatorActions) => actions.removeWire);

  const handleMouseDown = (event: MouseEvent) => {
    onClick?.(event, gate);
  };

  const handleDeleteClick = () => {
    wires.forEach((wire) => {
      if (wire.startPin.attached === gate || wire.endPin.attached === gate) {
        removeWire(wire);
      }
    });

    removeGate(gate);
  };

  const svgGate = svgGates.get(gate.type.name);
  return (
    <>
      <g onMouseDown={handleMouseDown} onContextMenu={handleContextMenu}>
        {svgGate ? (
          <g
            transform={`translate(${gate.pos.x + gate.width / 2 - svgGate.width / 2}, ${gate.pos.y + gate.height / 2 - svgGate.height / 2})`}
          >
            {svgGate.svg}
          </g>
        ) : (
          <rect
            className="fill-violet-500"
            x={gate.pos.x}
            y={gate.pos.y}
            width={gate.width}
            height={gate.height}
            rx={5}
            ry={5}
          />
        )}
        <text
          className="fill-indigo-950 select-none"
          x={
            gate.pos.x +
            gate.width / 2 +
            (svgGate ? (svgGate?.textOffset ? svgGate.textOffset : 0) : 0)
          }
          y={gate.pos.y + gate.height / 2 + 2}
          dominantBaseline="middle"
          textAnchor="middle"
          fontWeight={"bold"}
          fontSize={18}
          fontFamily={"Inter"}
        >
          {gate.type.name}
        </text>
        <foreignObject
          x={gate.pos.x + gate.width}
          y={gate.pos.y + gate.height}
          width={1}
          height={1}
          className="overflow-visible"
        >
          <ElementContextMenu
            name={gate.type.name}
            show={showContextMenu}
            handleDeleteClick={handleDeleteClick}
          />
        </foreignObject>
      </g>
    </>
  );
}
