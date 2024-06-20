import {
  DragEvent,
  Fragment,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { IO, Pos } from "../../common/types";
import Gate from "../Gate";
import Pin from "../Pin";
import Wire from "../Wire";
import useMouse from "../../hooks/useMouse";
import Terminal from "../Terminal";
import { EditorState, useEditorStore } from "../../store";
import { FaPlus as AddIcon } from "react-icons/fa";
import { VscArrowBoth as ExpandWidthIcon } from "react-icons/vsc";
import { LuTrash2 as TrashIcon } from "react-icons/lu";
import EditorSettings from "../EditorSettings";
import { EditorBar } from "../EditorBar";
import GateTypes from "../GateTypes";
import PinEntity from "../../entities/PinEntity";
import GateEntity from "../../entities/GateEntity";
import TerminalEntity from "../../entities/TerminalEntity";
import WireEntity from "../../entities/WireEntity";
import { EDITOR_WIDTH } from "../../common/constants";

export default function Editor() {
  const ref = useRef<HTMLDivElement>(null);
  const { mouseDragOffset } = useMouse();
  const { mouseDragOffset: wiringMouseOffset, updateOrigin: wiringUpdateOrigin } = useMouse(true);

  const [gateOrigin, setGateOrigin] = useState<Pos>({ x: 0, y: 0 });
  const [isDraggingGate, setIsDraggingGate] = useState<boolean>(false);
  const [isWiring, setIsWiring] = useState<boolean>(false);
  const [wiringEndPoint, setWiringEndPoint] = useState<Pos | null>(null);
  const [wiringCheckpoints, setWiringCheckpoints] = useState<Pos[]>([]);
  const [lastPin, setLastPin] = useState<PinEntity | null>(null);
  const [terminalAdderY, setTerminalAdderY] = useState<number | null>(null);
  const [isTerminalAdderInput, setIsTerminalAdderInput] = useState<boolean>(true);
  const [expandWarning, setExpandWarning] = useState<boolean>(false);

  const settings = useEditorStore((state: EditorState) => state.settings);
  const terminals = useEditorStore((state: EditorState) => state.terminals);
  const gates = useEditorStore((state: EditorState) => state.gates);
  const wires = useEditorStore((state: EditorState) => state.wires);
  const selectedGate = useEditorStore((state: EditorState) => state.selectedGate);
  const selectedPin = useEditorStore((state: EditorState) => state.selectedPin);
  const setSelectedPin = useEditorStore((state: EditorState) => state.setSelectedPin);
  const addingGateType = useEditorStore((state: EditorState) => state.addingGateType);
  const activePinIds = useEditorStore((state: EditorState) => state.activePinIds);

  const addWire = useEditorStore((state: EditorState) => state.addWire);
  const removeWire = useEditorStore((state: EditorState) => state.removeWire);
  const updateActivity = useEditorStore((state: EditorState) => state.updateActivity);
  const addGate = useEditorStore((state: EditorState) => state.addGate);
  const removeGate = useEditorStore((state: EditorState) => state.removeGate);
  const addTerminal = useEditorStore((state: EditorState) => state.addTerminal);
  const setSelectedGate = useEditorStore((state: EditorState) => state.setSelectedGate);
  const updateCurrentTruthTable = useEditorStore(
    (state: EditorState) => state.updateCurrentTruthTable
  );

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
    if (!selectedPin) {
      return;
    }

    if (isWiring) {
      if (
        lastPin &&
        selectedPin !== lastPin &&
        (!(selectedPin.attached instanceof TerminalEntity) ||
          !(lastPin.attached instanceof TerminalEntity))
      ) {
        addWire(new WireEntity(selectedPin, lastPin, wiringCheckpoints));
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
    const gate = new GateEntity(
      {
        x: event.clientX - editorRect.left,
        y: event.clientY - editorRect.top,
      },
      addingGateType
    );
    gate.pos.x -= gate.width / 2;
    gate.pos.y -= gate.height / 2;

    addGate(gate);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleWiringStart = (event: ReactMouseEvent, pin: PinEntity) => {
    setIsWiring(true);
    setSelectedPin(pin);
    wiringUpdateOrigin(event);
  };

  const handleWiringMove = () => {
    if (!selectedPin) {
      return;
    }

    const { x, y } = selectedPin.getPos();
    setWiringEndPoint({
      x: Math.abs(wiringMouseOffset.x - x),
      y: Math.abs(wiringMouseOffset.y - y),
    });
  };

  const handleGateDraggingMove = () => {
    if (!selectedGate) {
      return;
    }

    selectedGate.pos = {
      x: Math.abs(mouseDragOffset.x - gateOrigin.x),
      y: Math.abs(mouseDragOffset.y - gateOrigin.y),
    };
  };

  const deleteDraggingGate = () => {
    if (!selectedGate) {
      return;
    }

    wires.forEach((wire) => {
      if (wire.startPin.attached === selectedGate || wire.endPin.attached === selectedGate) {
        removeWire(wire);
      }
    });

    removeGate(selectedGate);
    setSelectedGate(null);
    setIsDraggingGate(false);
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
          if ((terminal.io === IO.Input) !== isLeft) {
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

  useEffect(() => {
    const handleResize = () => {
      if (!expandWarning && window.innerWidth < EDITOR_WIDTH) {
        setExpandWarning(true);
      }

      if (expandWarning && window.innerWidth > EDITOR_WIDTH) {
        setExpandWarning(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [expandWarning]);

  if (expandWarning) {
    return (
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 border-zinc-800 border-4 rounded-lg p-8">
        <h1 className="text-center font-bold text-2xl">Expand your window</h1>
        <div className="flex justify-center py-2">
          <ExpandWidthIcon size={40} className="animate-ping" />
          <ExpandWidthIcon size={40} className="absolute" />
        </div>
        <p className="text-zinc-400">The editor needs a bit more width to fit.</p>
      </div>
    );
  }

  return (
    <div className="flex-col space-y-3" style={{ width: EDITOR_WIDTH }}>
      <EditorBar />
      <div
        className="relative border-zinc-800 border-4 rounded-lg grow h-[800px]"
        ref={ref}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {isWiring && (
          <h1 className="absolute font-medium m-2 -z-10">
            Press <span className="bg-zinc-800 p-1 rounded-md font-bold">Escape</span> to stop
            wiring
          </h1>
        )}
        {terminals.map((terminal, i) => {
          return <Terminal key={i} terminal={terminal} name={terminal.name} />;
        })}
        {terminalAdderY ? (
          <div
            className={`absolute h-8 w-8 rounded-full border-4 bg-stone-950 border-zinc-600 flex justify-center items-center hover:cursor-pointer hover:border-violet-500 ${
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
            <AddIcon color="#94a3b8" />
          </div>
        ) : (
          <></>
        )}

        {isDraggingGate && (
          <div
            className="absolute bg-zinc-800 p-2 left-0 bottom-0 m-2 rounded-md hover:cursor-pointer hover:text-red-500"
            onMouseUp={deleteDraggingGate}
          >
            <TrashIcon size={20} />
          </div>
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

          {isWiring && selectedPin && wiringEndPoint && (
            <Wire
              points={[selectedPin.getPos(), ...wiringCheckpoints, wiringEndPoint]}
              active={false}
            />
          )}
          {wires.map((wire, i) => (
            <Wire
              key={i}
              points={[wire.startPin.getPos(), ...wire.checkpoints, wire.endPin.getPos()]}
              active={
                activePinIds.includes(wire.startPin.id) || activePinIds.includes(wire.endPin.id)
              }
            />
          ))}
          {gates.map((gate: GateEntity, i) => (
            <Fragment key={i}>
              <Gate
                key={i}
                gate={gate}
                setIsDraggingGate={setIsDraggingGate}
                setSelectedGate={(gate) => {
                  setSelectedGate(gate);
                  setGateOrigin(gate.pos);
                }}
              />
              {gate.inputPins.map((pin, j) => {
                return (
                  <Pin
                    key={`in-${j}`}
                    pin={pin}
                    pos={pin.getPos()}
                    onMouseDown={(event) => handleWiringStart(event, pin)}
                    setLastPin={setLastPin}
                  />
                );
              })}
              {gate.outputPins.map((pin, j) => {
                return (
                  <Pin
                    key={`out-${j}`}
                    pin={pin}
                    pos={pin.getPos()}
                    onMouseDown={(event) => handleWiringStart(event, pin)}
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
                pin={terminal.pin}
                pos={terminal.pin.getPos()}
                onMouseDown={(event) => handleWiringStart(event, terminal.pin)}
                setLastPin={setLastPin}
              />
            );
          })}
        </svg>
      </div>
      <GateTypes />
    </div>
  );
}
