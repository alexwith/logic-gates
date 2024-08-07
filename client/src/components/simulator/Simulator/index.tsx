import { Fragment, useEffect, useRef, useState, MouseEvent } from "react";
import { SIMULATOR_HEIGHT, SIMULATOR_WIDTH } from "../../../common/constants";
import { EditorState, useEditorStore } from "../../../store";
import Terminal from "../../editor/Terminal";
import { deserializeCircuit } from "../../../libs/circuitFile";
import { Project } from "../../../common/types";
import Wire from "../../editor/Wire";
import GateEntity from "../../../entities/GateEntity";
import { VscArrowBoth as ExpandWidthIcon } from "react-icons/vsc";
import Gate from "../../editor/Gate";
import Pin from "../../editor/Pin";
import Settings from "../Settings";
import PinEntity from "../../../entities/PinEntity";

interface Props {
  project?: Project;
  editable?: boolean;
  onPinClick?: (event: MouseEvent, pin: PinEntity) => void;
}

export default function Simulator({ project, editable, onPinClick }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [render, rerender] = useState<boolean>(false);
  const [expandWarning, setExpandWarning] = useState<boolean>(false);

  const settings = useEditorStore((state: EditorState) => state.settings);
  const terminals = useEditorStore((state: EditorState) => state.terminals);
  const gates = useEditorStore((state: EditorState) => state.gates);
  const wires = useEditorStore((state: EditorState) => state.wires);

  const setGateTypes = useEditorStore((state: EditorState) => state.setGateTypes);
  const setGates = useEditorStore((state: EditorState) => state.setGates);
  const setTerminals = useEditorStore((state: EditorState) => state.setTerminals);
  const setWires = useEditorStore((state: EditorState) => state.setWires);
  const updateActivity = useEditorStore((state: EditorState) => state.updateActivity);

  useEffect(() => {
    if (!project) {
      return;
    }

    const buffer = Uint8Array.from(project.data!).buffer;
    const deserializedData = deserializeCircuit(buffer);
    if (!deserializedData) {
      return;
    }

    const [gateTypes, gates, terminals, wires] = deserializedData!;

    setGateTypes(gateTypes);
    setGates(gates);
    setTerminals(terminals);
    setWires(wires);
    updateActivity();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (!expandWarning && window.innerWidth < SIMULATOR_WIDTH) {
        setExpandWarning(true);
      }

      if (expandWarning && window.innerWidth > SIMULATOR_WIDTH) {
        setExpandWarning(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [expandWarning]);

  if (expandWarning) {
    return (
      <div className="border-zinc-800 border-4 rounded-lg p-8 mt-20 text-center">
        <h1 className="font-bold text-2xl">Expand your window</h1>
        <div className="flex justify-center py-2">
          <ExpandWidthIcon size={40} className="animate-ping" />
          <ExpandWidthIcon size={40} className="absolute" />
        </div>
        <p className="text-zinc-400">The simulator needs a bit more width to fit.</p>
      </div>
    );
  }

  return (
    <div className="flex-col space-y-3">
      <div
        className="relative border-zinc-800 border-4 rounded-lg grow"
        style={{ height: SIMULATOR_HEIGHT, width: SIMULATOR_WIDTH }}
        ref={ref}
      >
        <Settings />
        {terminals.map((terminal, i) => {
          return (
            <Terminal
              key={i}
              terminal={terminal}
              rerenderParent={() => rerender(!render)}
              editable={editable}
            />
          );
        })}
        <svg className="w-full h-full">
          {settings.grid && (
            <>
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
            </>
          )}
          {wires.map((wire, i) => (
            <Wire
              key={i}
              points={[wire.startPin.getPos(), ...wire.checkpoints, wire.endPin.getPos()]}
              active={wire.startPin.active || wire.endPin.active}
            />
          ))}
          {gates.map((gate: GateEntity, i) => (
            <Fragment key={i}>
              <Gate key={i} gate={gate} setIsDraggingGate={() => {}} setSelectedGate={() => {}} />
              {gate.inputPins.map((pin, j) => {
                return (
                  <Pin
                    key={`in-${j}`}
                    pin={pin}
                    pos={pin.getPos()}
                    onMouseDown={(event) => onPinClick?.(event, pin)}
                    setLastPin={() => {}}
                  />
                );
              })}
              {gate.outputPins.map((pin, j) => {
                return (
                  <Pin
                    key={`out-${j}`}
                    pin={pin}
                    pos={pin.getPos()}
                    onMouseDown={(event) => onPinClick?.(event, pin)}
                    setLastPin={() => {}}
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
                onMouseDown={(event) => onPinClick?.(event, terminal.pin)}
                setLastPin={() => {}}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
