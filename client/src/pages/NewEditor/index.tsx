import { DragEvent, MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from "react";
import Simulator from "../../components/simulator/Simulator";
import { EditorState, useEditorStore } from "../../store";
import { IO, Pos } from "../../common/types";
import { FaPlus as AddIcon } from "react-icons/fa";
import PinEntity from "../../entities/PinEntity";
import GateEntity from "../../entities/GateEntity";
import useMouse from "../../hooks/useMouse";

export default function NewEditor() {
  const ref = useRef<HTMLDivElement>(null);
  const { mouseDragOffset } = useMouse();
  const { mouseDragOffset: wiringMouseOffset, updateOrigin: wiringMouseUpdateOrigin } = useMouse(
    true,
    true,
  );

  const [newTerminalIO, setNewTerminalIO] = useState<IO | null>(null);
  const [newTerminalY, setNewTerminalY] = useState<number>(0);
  const [isWiring, setIsWiring] = useState<boolean>(false);
  const [wiringEndPoint, setWiringEndPoint] = useState<Pos | null>(null);
  const [wiringCheckpoints, setWiringCheckpoints] = useState<Pos[]>([]);

  const gateTypes = useEditorStore((state: EditorState) => state.gateTypes);
  const addingGateType = useEditorStore((state: EditorState) => state.addingGateType);
  const terminals = useEditorStore((state: EditorState) => state.terminals);
  const selectedPin = useEditorStore((state: EditorState) => state.selectedPin);

  const setAddingGateType = useEditorStore((state: EditorState) => state.setAddingGateType);
  const addTerminal = useEditorStore((state: EditorState) => state.addTerminal);
  const setSelectedPin = useEditorStore((state: EditorState) => state.setSelectedPin);
  const setSelectedGate = useEditorStore((state: EditorState) => state.setSelectedGate);
  const addGate = useEditorStore((state: EditorState) => state.addGate);

  const handlePinClick = (event: ReactMouseEvent, pin: PinEntity) => {
    setIsWiring(true);
    setSelectedPin(pin);
    wiringMouseUpdateOrigin(event);
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
        <Simulator editable onPinClick={handlePinClick}></Simulator>
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
