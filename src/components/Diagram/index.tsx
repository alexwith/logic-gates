import { DragEvent, Fragment, useEffect, useRef, useState } from "react";
import { PortMeta, Pos } from "../../common/types";
import Port from "../Port";
import Pin from "../Pin";
import Connection from "../Connection";
import { treversePins } from "../../libs/circuit";
import { inputPinId, isGlobalPinId, outputPinId } from "../../utils/idUtil";
import { computeGlobalEntryPos, computeGlobalPinYPos, computePortPinPos } from "../../libs/pin";
import useMouse from "../../hooks/useMouse";
import GlobalPin from "../GlobalPin";
import { DiagramState, useDiagramStore } from "../../store";

export default function Diagram() {
  const ref = useRef<HTMLDivElement>(null);
  const { mouseDragOffset } = useMouse();

  const [portOrigin, setPortOrigin] = useState<Pos>({ x: 0, y: 0 });
  const [isDraggingPort, setIsDraggingPort] = useState<boolean>(false);
  const [isConnectingPin, setIsConnectingPin] = useState<boolean>(false);
  const [connectingPinEnd, setConnectingPinEnd] = useState<Pos | null>(null);
  const [lastPin, setLastPin] = useState<string | null>("");
  const [activePins, setActivePins] = useState<string[]>([]);

  const globalPins = useDiagramStore((state: DiagramState) => state.globalPins);
  const ports = useDiagramStore((state: DiagramState) => state.ports);
  const connections = useDiagramStore((state: DiagramState) => state.connections);
  const selectedPortId = useDiagramStore((state: DiagramState) => state.selectedPortId);
  const selectedPinId = useDiagramStore((state: DiagramState) => state.selectedPinId);
  const addingPortType = useDiagramStore((state: DiagramState) => state.addingPortType);
  const activeGlobalPinIds = useDiagramStore((state: DiagramState) => state.activeGlobalPinIds);

  const updateSelectedPort = useDiagramStore((state: DiagramState) => state.updateSelectedPort);
  const addConnection = useDiagramStore((state: DiagramState) => state.addConnection);
  const updateCurrentTruthTable = useDiagramStore(
    (state: DiagramState) => state.updateCurrentTruthTable
  );
  const addPort = useDiagramStore((state: DiagramState) => state.addPort);
  const setSelectedPort = useDiagramStore((state: DiagramState) => state.setSelectedPort);

  const updateActivity = () => {
    const activePins: string[] = [...activeGlobalPinIds];
    globalPins.forEach((globalPin) => {
      treversePins(globalPin.id, connections, ports, activePins);
    });
    setActivePins(activePins);
  };

  useEffect(() => {
    updateActivity();
  }, [activeGlobalPinIds, connections]);

  const handlePortDraggingMove = () => {
    const port = { ...ports[selectedPortId] };
    port.pos = {
      x: Math.abs(mouseDragOffset.x - portOrigin.x),
      y: Math.abs(mouseDragOffset.y - portOrigin.y),
    };
    updateSelectedPort(port);
  };

  const handlePinConnectingMove = () => {
    const { x, y } = computePortPinPos(ref, ports, globalPins, selectedPinId);
    setConnectingPinEnd({
      x: Math.abs(mouseDragOffset.x - x),
      y: Math.abs(mouseDragOffset.y - y),
    });
  };

  const handlePinConnectingEnd = () => {
    setIsConnectingPin(false);
    if (
      !lastPin ||
      selectedPinId === lastPin ||
      (isGlobalPinId(selectedPinId) && isGlobalPinId(lastPin))
    ) {
      return;
    }

    addConnection({
      pin0Id: selectedPinId,
      pin1Id: lastPin,
    });
    updateCurrentTruthTable();
  };

  const handleMouseMove = () => {
    if (isDraggingPort) {
      handlePortDraggingMove();
    }
    if (isConnectingPin) {
      handlePinConnectingMove();
    }
  };

  const handleMouseUp = () => {
    if (isDraggingPort) {
      setIsDraggingPort(false);
    }
    if (isConnectingPin) {
      handlePinConnectingEnd();
    }
  };

  const handleDrop = (event: DragEvent) => {
    if (!addingPortType || !ref.current) {
      return;
    }

    const diagramRect: DOMRect = ref.current.getBoundingClientRect();
    const port: PortMeta = {
      id: ports.length,
      name: addingPortType.name,
      pos: {
        x: event.clientX - diagramRect.left - addingPortType.width / 2,
        y: event.clientY - diagramRect.top - addingPortType.height / 2,
      },
      height: addingPortType.height,
      width: addingPortType.width,
      inputs: addingPortType.inputs,
      outputs: addingPortType.outputs,
      truthTable: addingPortType.truthTable,
    };

    addPort(port);
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
      {globalPins.map((pin, i) => {
        return (
          <GlobalPin
            key={i}
            id={pin.id}
            yPos={computeGlobalPinYPos(ref, globalPins, pin.id)}
            input={pin.input}
            name={pin.name}
          />
        );
      })}
      <svg className="w-full h-full" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
        {isConnectingPin && selectedPinId && connectingPinEnd && (
          <Connection
            id={-1}
            pos0={computePortPinPos(ref, ports, globalPins, selectedPinId)}
            pos1={connectingPinEnd}
            active={false}
          />
        )}
        {connections.map((connection, i) => (
          <Connection
            key={i}
            id={i}
            pos0={computePortPinPos(ref, ports, globalPins, connection.pin0Id)}
            pos1={computePortPinPos(ref, ports, globalPins, connection.pin1Id)}
            active={
              activePins.includes(connection.pin0Id) || activePins.includes(connection.pin1Id)
            }
          />
        ))}
        {ports.map((port, i) => (
          <Fragment key={i}>
            <Port
              key={i}
              id={port.id}
              name={port.name}
              pos={port.pos}
              height={port.height}
              width={port.width}
              inputs={port.inputs}
              outputs={port.outputs}
              setIsDraggingPort={setIsDraggingPort}
              setSelectedPort={(id) => {
                setSelectedPort(id);
                setPortOrigin(port.pos);
              }}
            />
            {[...Array(port.inputs)].map((_, j) => {
              const id = inputPinId(port.id, j);

              return (
                <Pin
                  key={`in-${j}`}
                  id={id}
                  pos={computePortPinPos(ref, ports, globalPins, id)}
                  setIsConnectingPin={setIsConnectingPin}
                  setLastPin={setLastPin}
                />
              );
            })}
            {[...Array(port.outputs)].map((_, j) => {
              const id = outputPinId(port.id, j);

              return (
                <Pin
                  key={`out-${j}`}
                  id={id}
                  pos={computePortPinPos(ref, ports, globalPins, id)}
                  setIsConnectingPin={setIsConnectingPin}
                  setLastPin={setLastPin}
                />
              );
            })}
          </Fragment>
        ))}
        {globalPins.map((pin, i) => {
          return (
            <Pin
              key={i}
              id={pin.id}
              pos={computeGlobalEntryPos(ref, globalPins, pin.id)}
              setIsConnectingPin={setIsConnectingPin}
              setLastPin={setLastPin}
            />
          );
        })}
      </svg>
    </div>
  );
}
