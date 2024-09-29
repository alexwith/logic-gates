import { DragEvent, MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from "react";
import Simulator from "../../simulator/Simulator";
import { SimulatorActions, SimulatorState, useSimulatorStore } from "../../../store/simulatorStore";
import { IO, Pos } from "../../../common/types";
import PinEntity from "../../../entities/PinEntity";
import GateEntity from "../../../entities/GateEntity";
import useMouse from "../../../hooks/useMouse";
import Wire from "../../simulator/Wire";
import WireEntity from "../../../entities/WireEntity";
import { AddIcon } from "../../../common/icons";
import EditorBar from "../EditorBar";
import { dispatchEditorChanges } from "../../../utils/editorChangesEvent";
import { tryStraightenWire } from "../../../libs/wires";
import GateType from "../GateType";

export default function Editor() {
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

  const gateTypes = useSimulatorStore((state: SimulatorState) => state.gateTypes);
  const addingGateType = useSimulatorStore((state: SimulatorState) => state.addingGateType);
  const terminals = useSimulatorStore((state: SimulatorState) => state.terminals);
  const currentPin = useSimulatorStore((state: SimulatorState) => state.currentPin);
  const currentGate = useSimulatorStore((state: SimulatorState) => state.currentGate);
  const wires = useSimulatorStore((state: SimulatorState) => state.wires);
  const settings = useSimulatorStore((state: SimulatorState) => state.settings);

  const setGates = useSimulatorStore((actions: SimulatorActions) => actions.setGates);
  const setTerminals = useSimulatorStore((actions: SimulatorActions) => actions.setTerminals);
  const setWires = useSimulatorStore((actions: SimulatorActions) => actions.setWires);
  const setAddingGateType = useSimulatorStore(
    (actions: SimulatorActions) => actions.setAddingGateType,
  );
  const addTerminal = useSimulatorStore((actions: SimulatorActions) => actions.addTerminal);
  const setCurrentPin = useSimulatorStore((actions: SimulatorActions) => actions.setCurrentPin);
  const setCurrentGate = useSimulatorStore((actions: SimulatorActions) => actions.setCurrentGate);
  const addGate = useSimulatorStore((actions: SimulatorActions) => actions.addGate);
  const addWire = useSimulatorStore((actions: SimulatorActions) => actions.addWire);
  const updateActivity = useSimulatorStore((actions: SimulatorActions) => actions.updateActivity);
  const updateTruthTable = useSimulatorStore(
    (actions: SimulatorActions) => actions.updateTruthTable,
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

  const handleMouseDown = (event: ReactMouseEvent) => {
    handleWiringClick(event);
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

  const handlePinClick = (event: ReactMouseEvent, pin: PinEntity) => {
    setIsWiring(true);
    setCurrentPin(pin);
    wiringMouseUpdateOrigin(event);
  };

  const handleGateClick = (event: ReactMouseEvent, gate: GateEntity) => {
    setIsDraggingGate(true);
    setCurrentGate(gate);
    setGateOrigin(gate.pos);
  };

  const handleWiringMove = () => {
    if (!currentPin) {
      return;
    }

    const { x, y } = currentPin.getPos();
    setWiringEndPoint({
      x: Math.abs(wiringMouseOffset.x - x),
      y: Math.abs(wiringMouseOffset.y - y),
    });
  };

  const handleWiringClick = (event: ReactMouseEvent) => {
    if (!currentPin || !isWiring) {
      return;
    }

    if (lastPin && currentPin !== lastPin) {
      if (settings.autoStraightWires) {
        tryStraightenWire(currentPin.getPos(), lastPin.getPos(), wiringCheckpoints);
      }

      addWire(new WireEntity(currentPin, lastPin, wiringCheckpoints));
      setIsWiring(false);
      setWiringEndPoint(null);
      setWiringCheckpoints([]);

      updateTruthTable();
      updateActivity();
      return;
    }

    setWiringCheckpoints([...wiringCheckpoints, wiringEndPoint!]);
  };

  const handleGateDraggingMove = () => {
    if (!currentGate) {
      return;
    }

    currentGate.pos = {
      x: Math.abs(mouseDragOffset.x - gateOrigin.x),
      y: Math.abs(mouseDragOffset.y - gateOrigin.y),
    };

    if (settings.autoStraightWires) {
      wires.forEach((wire) => {
        if (
          currentGate.inputPins.includes(wire.startPin) ||
          currentGate.inputPins.includes(wire.endPin) ||
          currentGate.outputPins.includes(wire.startPin) ||
          currentGate.outputPins.includes(wire.endPin)
        ) {
          tryStraightenWire(wire.startPin.getPos(), wire.endPin.getPos(), wire.checkpoints);
        }
      });
    }

    dispatchEditorChanges();
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

    const handleContextMenu = () => {
      // disable current edits while in context menu
      setIsWiring(false);
      setWiringEndPoint(null);
      setWiringCheckpoints([]);
    };

    window.addEventListener("keyup", handleEscape);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("keyup", handleEscape);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <EditorBar />
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
              dispatchEditorChanges();
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
        <Simulator
          editable
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onPinClick={handlePinClick}
          onPinHover={setLastPin}
          onGateClick={handleGateClick}
        >
          {isWiring && currentPin && wiringEndPoint && (
            <Wire
              points={[currentPin.getPos(), ...wiringCheckpoints, wiringEndPoint]}
              active={false}
            />
          )}
        </Simulator>
      </div>
      <div className="flex space-x-2 mb-4">
        {gateTypes.map((type, i) => (
          <GateType type={type} key={i} />
        ))}
      </div>
    </div>
  );
}
