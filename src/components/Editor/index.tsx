import {
  DragEvent,
  Fragment,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { GateMeta, Pos } from "../../common/types";
import Gate from "../Gate";
import Pin from "../Pin";
import Wire from "../Wire";
import { inputPinId, isTerminalId, outputPinId } from "../../utils/idUtil";
import { computeTerminalPos, computeGatePinPos } from "../../libs/pin";
import useMouse from "../../hooks/useMouse";
import Terminal from "../Terminal";
import { EditorState, useEditorStore } from "../../store";
import { FaPlus } from "react-icons/fa";
import EditorSettings from "../EditorSettings";

export default function Editor() {
  const ref = useRef<HTMLDivElement>(null);
  const { mouseDragOffset } = useMouse();
  const { mouseDragOffset: wiringMouseOffset, updateOrigin: wiringUpdateOrigin } = useMouse(true);

  const [gateOrigin, setGateOrigin] = useState<Pos>({ x: 0, y: 0 });
  const [isDraggingGate, setIsDraggingGate] = useState<boolean>(false);
  const [isWiring, setIsWiring] = useState<boolean>(false);
  const [wiringEndPoint, setWiringEndPoint] = useState<Pos | null>(null);
  const [wiringCheckpoints, setWiringCheckpoints] = useState<Pos[]>([]);
  const [lastPin, setLastPin] = useState<string | null>("");
  const [terminalAdderY, setTerminalAdderY] = useState<number | null>(null);
  const [isTerminalAdderInput, setIsTerminalAdderInput] = useState<boolean>(true);

  const settings = useEditorStore((state: EditorState) => state.settings);
  const terminals = useEditorStore((state: EditorState) => state.terminals);
  const gates = useEditorStore((state: EditorState) => state.gates);
  const wires = useEditorStore((state: EditorState) => state.wires);
  const selectedGateId = useEditorStore((state: EditorState) => state.selectedGateId);
  const selectedPinId = useEditorStore((state: EditorState) => state.selectedPinId);
  const setSelectedPin = useEditorStore((state: EditorState) => state.setSelectedPin);
  const addingGateType = useEditorStore((state: EditorState) => state.addingGateType);
  const activePinIds = useEditorStore((state: EditorState) => state.activePinIds);

  const updateSelectedGate = useEditorStore((state: EditorState) => state.updateSelectedGate);
  const addWire = useEditorStore((state: EditorState) => state.addWire);
  const updateActivity = useEditorStore((state: EditorState) => state.updateActivity);
  const updateCurrentTruthTable = useEditorStore(
    (state: EditorState) => state.updateCurrentTruthTable
  );
  const addGate = useEditorStore((state: EditorState) => state.addGate);
  const addTerminal = useEditorStore((state: EditorState) => state.addTerminal);
  const setSelectedGate = useEditorStore((state: EditorState) => state.setSelectedGate);

  const handleMouseMove = () => {
    if (isDraggingGate) {
      handleGateDraggingMove();
    }
    if (isWiring) {
      handleWiringMove();
    }
  };

  const handleMouseUp = () => {
    if (isDraggingGate) {
      setIsDraggingGate(false);
    }
  };

  const handleMouseDown = () => {
    if (isWiring) {
      if (
        lastPin &&
        selectedPinId !== lastPin &&
        (!isTerminalId(selectedPinId) || !isTerminalId(lastPin))
      ) {
        addWire({
          pin0Id: selectedPinId,
          pin1Id: lastPin,
          checkpoints: wiringCheckpoints,
        });
        setIsWiring(false);
        setWiringEndPoint(null);
        setWiringCheckpoints([]);

        updateCurrentTruthTable();
        updateActivity();
        return;
      }

      setWiringCheckpoints([...wiringCheckpoints, wiringEndPoint!]);
    }
  };

  const handleDrop = (event: DragEvent) => {
    if (!addingGateType || !ref.current) {
      return;
    }

    const editorRect: DOMRect = ref.current.getBoundingClientRect();
    const gate: GateMeta = {
      id: gates.length,
      name: addingGateType.name,
      pos: {
        x: event.clientX - editorRect.left - addingGateType.width / 2,
        y: event.clientY - editorRect.top - addingGateType.height / 2,
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

  const handleWiringStart = (event: ReactMouseEvent, pinId: string) => {
    setIsWiring(true);
    setSelectedPin(pinId);
    wiringUpdateOrigin(event);
  };

  const handleWiringMove = () => {
    const { x, y } = computeGatePinPos(ref, gates, terminals, selectedPinId);
    setWiringEndPoint({
      x: Math.abs(wiringMouseOffset.x - x),
      y: Math.abs(wiringMouseOffset.y - y),
    });
  };

  const handleGateDraggingMove = () => {
    const gate = { ...gates[selectedGateId] };
    gate.pos = {
      x: Math.abs(mouseDragOffset.x - gateOrigin.x),
      y: Math.abs(mouseDragOffset.y - gateOrigin.y),
    };

    updateSelectedGate(gate);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setIsWiring(false);
      setWiringEndPoint(null);
      setWiringCheckpoints([]);
    };

    window.addEventListener("keyup", handleEscape);

    return () => window.removeEventListener("keyup", handleEscape);
  }, []);

  useEffect(() => {
    const handleTerminalAdderMove = (event: MouseEvent) => {
      const rect = ref.current!.getBoundingClientRect();
      const yPos = event.clientY - rect.top;
      if (yPos < 0 || event.clientY - rect.bottom > 0) {
        if (terminalAdderY) {
          setTerminalAdderY(null);
        }
        return;
      }

      const isLeft = Math.abs(rect.left - event.clientX) <= 20;
      const isInsideTerminal =
        terminals.find((terminal) => {
          if (terminal.input !== isLeft) {
            return false;
          }

          const diff = terminal.yPos - yPos;
          return diff >= -16 && diff <= 48;
        }) !== undefined;
      if (isInsideTerminal) {
        if (terminalAdderY) {
          setTerminalAdderY(null);
        }
        return;
      }

      const isRight = Math.abs(rect.right - event.clientX) <= 20;
      if (isLeft || isRight) {
        setIsTerminalAdderInput(isLeft);
        setTerminalAdderY(yPos);
      } else if (terminalAdderY) {
        setTerminalAdderY(null);
      }
    };

    window.addEventListener("mousemove", handleTerminalAdderMove);

    return () => window.removeEventListener("mousemove", handleTerminalAdderMove);
  }, [terminalAdderY, terminals]);

  return (
    <div
      className="relative border-zinc-800 border-4 rounded-lg grow h-[700px]"
      ref={ref}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {isWiring && (
        <h1 className="absolute font-medium m-2 -z-10">
          Press <span className="bg-zinc-800 p-1 rounded-md font-bold">Escape</span> to stop wiring
        </h1>
      )}
      {terminals.map((terminal, i) => {
        return <Terminal key={i} id={terminal.id} terminal={terminal} name={terminal.name} />;
      })}
      {terminalAdderY ? (
        <div
          className={`absolute h-8 w-8 rounded-full border-4 bg-stone-950 border-zinc-600 flex justify-center items-center hover:cursor-pointer hover:border-green-400 ${
            isTerminalAdderInput ? "left-[-17px]" : "right-[-17px]"
          }`}
          style={{
            top: terminalAdderY - 16,
          }}
          onClick={() => {
            addTerminal(isTerminalAdderInput, terminalAdderY + 16);
            setTerminalAdderY(null);
          }}
        >
          <FaPlus color="#94a3b8" />
        </div>
      ) : (
        <></>
      )}
      <EditorSettings />
      <svg
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
      >
        {settings.grid && (
          <Fragment>
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="#71717a"
                  strokeWidth="0.5"
                  opacity="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </Fragment>
        )}

        {isWiring && selectedPinId && wiringEndPoint && (
          <Wire
            points={[
              computeGatePinPos(ref, gates, terminals, selectedPinId),
              ...wiringCheckpoints,
              wiringEndPoint,
            ]}
            active={false}
          />
        )}
        {wires.map((wire, i) => (
          <Wire
            key={i}
            points={[
              computeGatePinPos(ref, gates, terminals, wire.pin0Id),
              ...wire.checkpoints,
              computeGatePinPos(ref, gates, terminals, wire.pin1Id),
            ]}
            active={activePinIds.includes(wire.pin0Id) || activePinIds.includes(wire.pin1Id)}
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
                  onMouseDown={(event) => handleWiringStart(event, id)}
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
                  onMouseDown={(event) => handleWiringStart(event, id)}
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
              onMouseDown={(event) => handleWiringStart(event, terminal.id)}
              setLastPin={setLastPin}
            />
          );
        })}
      </svg>
    </div>
  );
}
