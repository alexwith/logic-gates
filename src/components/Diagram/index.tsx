import { DragEvent, Fragment, useRef, useState } from "react";
import { GateMeta, Pos } from "../../common/types";
import Gate from "../Gate";
import Pin from "../Pin";
import Connection from "../Connection";
import { inputPinId, isTerminalId, outputPinId } from "../../utils/idUtil";
import { computeTerminalPos, computeTerminalYPos, computeGatePinPos } from "../../libs/pin";
import useMouse from "../../hooks/useMouse";
import Terminal from "../Terminal";
import { DiagramState, useDiagramStore } from "../../store";

export default function Diagram() {
  const ref = useRef<HTMLDivElement>(null);
  const { mouseDragOffset } = useMouse();

  const [gateOrigin, setGateOrigin] = useState<Pos>({ x: 0, y: 0 });
  const [isDraggingGate, setIsDraggingGate] = useState<boolean>(false);
  const [isConnectingPin, setIsConnectingPin] = useState<boolean>(false);
  const [connectingPinEnd, setConnectingPinEnd] = useState<Pos | null>(null);
  const [lastPin, setLastPin] = useState<string | null>("");

  const terminals = useDiagramStore((state: DiagramState) => state.terminals);
  const gates = useDiagramStore((state: DiagramState) => state.gates);
  const connections = useDiagramStore((state: DiagramState) => state.connections);
  const selectedGateId = useDiagramStore((state: DiagramState) => state.selectedGateId);
  const selectedPinId = useDiagramStore((state: DiagramState) => state.selectedPinId);
  const addingGateType = useDiagramStore((state: DiagramState) => state.addingGateType);
  const activePinIds = useDiagramStore((state: DiagramState) => state.activePinIds);

  const updateSelectedGate = useDiagramStore((state: DiagramState) => state.updateSelectedGate);
  const addConnection = useDiagramStore((state: DiagramState) => state.addConnection);
  const updateActivity = useDiagramStore((state: DiagramState) => state.updateActivity);
  const updateCurrentTruthTable = useDiagramStore(
    (state: DiagramState) => state.updateCurrentTruthTable
  );
  const addGate = useDiagramStore((state: DiagramState) => state.addGate);
  const setSelectedGate = useDiagramStore((state: DiagramState) => state.setSelectedGate);

  const handleGateDraggingMove = () => {
    const gate = { ...gates[selectedGateId] };
    gate.pos = {
      x: Math.abs(mouseDragOffset.x - gateOrigin.x),
      y: Math.abs(mouseDragOffset.y - gateOrigin.y),
    };
    updateSelectedGate(gate);
  };

  const handlePinConnectingMove = () => {
    const { x, y } = computeGatePinPos(ref, gates, terminals, selectedPinId);
    setConnectingPinEnd({
      x: Math.abs(mouseDragOffset.x - x),
      y: Math.abs(mouseDragOffset.y - y),
    });
  };

  const handlePinConnectingEnd = () => {
    setIsConnectingPin(false);
    setConnectingPinEnd(null);

    if (
      !lastPin ||
      selectedPinId === lastPin ||
      (isTerminalId(selectedPinId) && isTerminalId(lastPin))
    ) {
      return;
    }

    addConnection({
      pin0Id: selectedPinId,
      pin1Id: lastPin,
    });
    updateCurrentTruthTable();
    updateActivity();
  };

  const handleMouseMove = () => {
    if (isDraggingGate) {
      handleGateDraggingMove();
    }
    if (isConnectingPin) {
      handlePinConnectingMove();
    }
  };

  const handleMouseUp = () => {
    if (isDraggingGate) {
      setIsDraggingGate(false);
    }
    if (isConnectingPin) {
      handlePinConnectingEnd();
    }
  };

  const handleDrop = (event: DragEvent) => {
    if (!addingGateType || !ref.current) {
      return;
    }

    const diagramRect: DOMRect = ref.current.getBoundingClientRect();
    const gate: GateMeta = {
      id: gates.length,
      name: addingGateType.name,
      pos: {
        x: event.clientX - diagramRect.left - addingGateType.width / 2,
        y: event.clientY - diagramRect.top - addingGateType.height / 2,
      },
      height: addingGateType.height,
      width: addingGateType.width,
      inputs: addingGateType.inputs,
      outputs: addingGateType.outputs,
      truthTable: addingGateType.truthTable,
    };

    addGate(gate);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  return (
    <div
      className="relative border-slate-500 border-4 rounded-lg grow h-[700px]"
      ref={ref}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {terminals.map((pin, i) => {
        return (
          <Terminal
            key={i}
            id={pin.id}
            yPos={computeTerminalYPos(ref, terminals, pin.id)}
            input={pin.input}
            name={pin.name}
          />
        );
      })}
      <svg className="w-full h-full" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
        {isConnectingPin && selectedPinId && connectingPinEnd && (
          <Connection
            id={-1}
            pos0={computeGatePinPos(ref, gates, terminals, selectedPinId)}
            pos1={connectingPinEnd}
            active={false}
          />
        )}
        {connections.map((connection, i) => (
          <Connection
            key={i}
            id={i}
            pos0={computeGatePinPos(ref, gates, terminals, connection.pin0Id)}
            pos1={computeGatePinPos(ref, gates, terminals, connection.pin1Id)}
            active={
              activePinIds.includes(connection.pin0Id) || activePinIds.includes(connection.pin1Id)
            }
          />
        ))}
        {gates.map((gate, i) => (
          <Fragment key={i}>
            <Gate
              key={i}
              id={gate.id}
              name={gate.name}
              pos={gate.pos}
              height={gate.height}
              width={gate.width}
              inputs={gate.inputs}
              outputs={gate.outputs}
              setIsDraggingGate={setIsDraggingGate}
              setSelectedGate={(id) => {
                setSelectedGate(id);
                setGateOrigin(gate.pos);
              }}
            />
            {[...Array(gate.inputs)].map((_, j) => {
              const id = inputPinId(gate.id, j);

              return (
                <Pin
                  key={`in-${j}`}
                  id={id}
                  pos={computeGatePinPos(ref, gates, terminals, id)}
                  setIsConnectingPin={setIsConnectingPin}
                  setLastPin={setLastPin}
                />
              );
            })}
            {[...Array(gate.outputs)].map((_, j) => {
              const id = outputPinId(gate.id, j);

              return (
                <Pin
                  key={`out-${j}`}
                  id={id}
                  pos={computeGatePinPos(ref, gates, terminals, id)}
                  setIsConnectingPin={setIsConnectingPin}
                  setLastPin={setLastPin}
                />
              );
            })}
          </Fragment>
        ))}
        {terminals.map((terminal, i) => {
          return (
            <Pin
              key={i}
              id={terminal.id}
              pos={computeTerminalPos(ref, terminals, terminal.id)}
              setIsConnectingPin={setIsConnectingPin}
              setLastPin={setLastPin}
            />
          );
        })}
      </svg>
    </div>
  );
}
