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
import { boundingBoxFromGate, boundingBoxFromTerminal } from "../../utils/boundingBoxUtil";
import { BoundingBox } from "../../utils/boundingBox";
import { FaPlus } from "react-icons/fa";

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
  const addTerminal = useDiagramStore((state: DiagramState) => state.addTerminal);
  const setSelectedGate = useDiagramStore((state: DiagramState) => state.setSelectedGate);

  const handleGateDraggingMove = () => {
    const gate = { ...gates[selectedGateId] };
    gate.pos = {
      x: Math.abs(mouseDragOffset.x - gateOrigin.x),
      y: Math.abs(mouseDragOffset.y - gateOrigin.y),
    };
    gate.boundingBox = boundingBoxFromGate(gate);

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
    gate.boundingBox = boundingBoxFromGate(gate);

    addGate(gate);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const createConnectionDefaultBoundingBox = (pinId: string): BoundingBox | undefined => {
    return isTerminalId(pinId)
      ? boundingBoxFromTerminal(pinId, computeGatePinPos(ref, gates, terminals, pinId))
      : undefined;
  };

  return (
    <div
      className="relative border-slate-700 border-4 rounded-lg grow h-[700px]"
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
      <div className="absolute flex items-center h-full">
        <div
          className="absolute h-8 w-8 rounded-full border-4 bg-stone-950 border-slate-500 flex justify-center items-center hover:cursor-pointer hover:border-green-400 left-[-60px]"
          onClick={() => addTerminal(true)}
        >
          <FaPlus color="#94a3b8" />
        </div>
      </div>
      <div className="absolute flex items-center h-full left-full">
        <div
          className="absolute h-8 w-8 rounded-full border-4 bg-stone-950 border-slate-500 flex justify-center items-center hover:cursor-pointer hover:border-green-400 right-[-60px]"
          onClick={() => addTerminal(false)}
        >
          <FaPlus color="#94a3b8" />
        </div>
      </div>
      <svg className="w-full h-full" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
        <defs>
          <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
            <path
              d="M 25 0 L 0 0 0 25¨"
              fill="none"
              stroke="#64748b"
              strokeWidth="0.5"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {isConnectingPin && selectedPinId && connectingPinEnd && (
          <Connection
            id={-1}
            pos0={computeGatePinPos(ref, gates, terminals, selectedPinId)}
            pos1={connectingPinEnd}
            active={false}
            pos0BB={createConnectionDefaultBoundingBox(selectedPinId)}
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
            pos0BB={createConnectionDefaultBoundingBox(connection.pin0Id)}
            pos1BB={createConnectionDefaultBoundingBox(connection.pin1Id)}
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
