import { DragEvent, MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from "react";
import Simulator from "../../components/simulator/Simulator";
import { EditorState, useEditorStore } from "../../store";
import { IO, Pos } from "../../common/types";
import { FaPlus as AddIcon } from "react-icons/fa";
import { LuTrash2 as TrashIcon } from "react-icons/lu";
import PinEntity from "../../entities/PinEntity";
import GateEntity from "../../entities/GateEntity";
import useMouse from "../../hooks/useMouse";
import Wire from "../../components/simulator/Wire";
import TerminalEntity from "../../entities/TerminalEntity";
import WireEntity from "../../entities/WireEntity";

export default function NewEditor() {
  const ref = useRef<HTMLDivElement>(null);
  const { mouseDragOffset } = useMouse();
  const { mouseDragOffset: wiringMouseOffset, updateOrigin: wiringMouseUpdateOrigin } = useMouse(
    true,
    true,
  );

  const [newTerminalIO, setNewTerminalIO] = useState<IO | null>(null);
  const [newTerminalY, setNewTerminalY] = useState<number>(0);
  const [gateOrigin, setGateOrigin] = useState<Pos>({ x: 0, y: 0 });
  const [isDraggingGate, setIsDraggingGate] = useState<boolean>(false);
  const [isWiring, setIsWiring] = useState<boolean>(false);
  const [wiringEndPoint, setWiringEndPoint] = useState<Pos | null>(null);
  const [wiringCheckpoints, setWiringCheckpoints] = useState<Pos[]>([]);
  const [lastPin, setLastPin] = useState<PinEntity | null>(null);

  const gateTypes = useEditorStore((state: EditorState) => state.gateTypes);
  const addingGateType = useEditorStore((state: EditorState) => state.addingGateType);
  const terminals = useEditorStore((state: EditorState) => state.terminals);
  const selectedPin = useEditorStore((state: EditorState) => state.selectedPin);
  const wires = useEditorStore((state: EditorState) => state.wires);

  const setAddingGateType = useEditorStore((state: EditorState) => state.setAddingGateType);
  const addTerminal = useEditorStore((state: EditorState) => state.addTerminal);
  const setSelectedPin = useEditorStore((state: EditorState) => state.setSelectedPin);
  const selectedGate = useEditorStore((state: EditorState) => state.selectedGate);
  const setSelectedGate = useEditorStore((state: EditorState) => state.setSelectedGate);
  const addGate = useEditorStore((state: EditorState) => state.addGate);
  const removeGate = useEditorStore((state: EditorState) => state.removeGate);
  const addWire = useEditorStore((state: EditorState) => state.addWire);
  const removeWire = useEditorStore((state: EditorState) => state.removeWire);
  const updateActivity = useEditorStore((state: EditorState) => state.updateActivity);
  const updateCurrentTruthTable = useEditorStore(
    (state: EditorState) => state.updateCurrentTruthTable,
  );

  const handlePinClick = (event: ReactMouseEvent, pin: PinEntity) => {
    setIsWiring(true);
    setSelectedPin(pin);
    wiringMouseUpdateOrigin(event);
  };

  const handleGateClick = (event: ReactMouseEvent, gate: GateEntity) => {
    setIsDraggingGate(true);
    setSelectedGate(gate);
    setGateOrigin(gate.pos);
  };

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

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event: DragEvent) => {
    if (!addingGateType || !ref.current) {
      return;
    }

    const simulatorBoundingBox: DOMRect = ref.current.getBoundingClientRect();
    const gate = new GateEntity(
      {
        x: event.clientX - simulatorBoundingBox.left,
        y: event.clientY - simulatorBoundingBox.top,
      },
      addingGateType,
    );
    gate.pos.x -= gate.width / 2;
    gate.pos.y -= gate.height / 2;

    addGate(gate);
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
    const handleNewTerminalMove = (event: MouseEvent) => {
      const boundingBox = ref.current!.getBoundingClientRect();
      const yPos = event.clientY - boundingBox.top;
      if (yPos < 0 || event.clientY - boundingBox.bottom > 0) {
        setNewTerminalIO(null);
        return;
      }

      const isLeft = Math.abs(boundingBox.left - event.clientX) <= 20;
      const isRight = Math.abs(boundingBox.right - event.clientX) <= 20;
      const io = isLeft ? IO.Input : isRight ? IO.Output : null;

      for (const terminal of terminals) {
        const diff = terminal.yPos - yPos;
        if (terminal.io === io && diff >= -16 && diff <= 48) {
          setNewTerminalIO(null);
          return;
        }
      }

      setNewTerminalIO(io);
      setNewTerminalY(yPos);
    };

    window.addEventListener("mousemove", handleNewTerminalMove);

    return () => window.removeEventListener("mousemove", handleNewTerminalMove);
  }, [newTerminalY, terminals]);

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

  return (
    <div>
      <div ref={ref} className="relative" onDragOver={handleDragOver} onDrop={handleDrop}>
        {newTerminalIO !== null ? (
          <div
            className={`absolute h-8 w-8 z-10 rounded-full border-4 bg-stone-950 border-zinc-600 flex justify-center items-center hover:cursor-pointer hover:border-violet-500 ${
              newTerminalIO === IO.Input ? "left-[-15px]" : "right-[-15px]"
            }`}
            style={{
              top: newTerminalY - 16,
            }}
            onClick={() => {
              addTerminal(newTerminalIO, newTerminalY + 16);
              setNewTerminalIO(null);
            }}
          >
            <AddIcon color="#94a3b8" />
          </div>
        ) : (
          <></>
        )}
        {isWiring && (
          <h1 className="absolute font-medium m-2 -z-10">
            Press <span className="bg-zinc-800 p-1 rounded-md font-bold">Escape</span> to stop
            wiring
          </h1>
        )}
        {isDraggingGate && (
          <div
            className="absolute bg-zinc-800 p-2 z-10 left-0 bottom-0 m-2 rounded-md hover:cursor-pointer hover:text-red-500"
            onMouseUp={deleteDraggingGate}
          >
            <TrashIcon size={20} />
          </div>
        )}
        <Simulator
          editable
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onPinClick={handlePinClick}
          onPinHover={setLastPin}
          onGateClick={handleGateClick}
        >
          {isWiring && selectedPin && wiringEndPoint && (
            <Wire
              points={[selectedPin.getPos(), ...wiringCheckpoints, wiringEndPoint]}
              active={false}
            />
          )}
        </Simulator>
      </div>
      <div className="flex space-x-2 mb-4">
        {gateTypes.map((type, i) => (
          <div
            className="bg-violet-500 w-fit p-2 font-bold rounded-md select-none"
            key={i}
            draggable
            onDragStart={() => {
              setAddingGateType(type);
            }}
          >
            {type.name}
          </div>
        ))}
      </div>
    </div>
  );
}
