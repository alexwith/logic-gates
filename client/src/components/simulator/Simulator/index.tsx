import { Fragment, useEffect, useRef, useState } from "react";
import { SIMULATOR_WIDTH } from "../../../common/constants";
import { EditorState, useEditorStore } from "../../../store";
import Terminal from "../../editor/Terminal";
import { deserializeCircuit } from "../../../libs/circuitFile";
import { Project } from "../../../common/types";
import Wire from "../../editor/Wire";
import GateEntity from "../../../entities/GateEntity";
import Gate from "../../editor/Gate";
import Pin from "../../editor/Pin";
import Settings from "../Settings";

interface Props {
  project: Project;
}

export function Simulator({ project }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [render, rerender] = useState<boolean>(false);

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
  }, [setGateTypes, setGates, setTerminals, setWires, updateActivity, project.data]);

  return (
    <div className="flex-col space-y-3" style={{ width: SIMULATOR_WIDTH }}>
      <div className="relative border-zinc-800 border-4 rounded-lg grow h-[800px]" ref={ref}>
        <Settings />
        {terminals.map((terminal, i) => {
          return (
            <Terminal
              key={i}
              terminal={terminal}
              editorRect={ref.current?.getBoundingClientRect()}
              rerenderEditor={() => rerender(!render)}
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
                    onMouseDown={() => {}}
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
                    onMouseDown={() => {}}
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
                onMouseDown={() => {}}
                setLastPin={() => {}}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
