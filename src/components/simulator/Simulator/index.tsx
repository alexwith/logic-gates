import { Fragment, useEffect, useRef, useState, MouseEvent, ReactNode, forwardRef } from "react";
import { SIMULATOR_HEIGHT, SIMULATOR_WIDTH } from "../../../common/constants";
import { SimulatorState, useSimulatorStore } from "../../../store/simulatorStore";
import Terminal from "../Terminal";
import Wire from "../Wire";
import GateEntity from "../../../entities/GateEntity";
import Gate from "../Gate";
import Pin from "../Pin";
import Settings from "../Settings";
import PinEntity from "../../../entities/PinEntity";
import { ExpandIcon } from "../../../common/icons";
import { downloadSVGImage } from "../../../libs/svgImageExport";

interface Props {
  children?: ReactNode;
  editable?: boolean;
  onMouseUp?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onGateClick?: (event: MouseEvent, gate: GateEntity) => void;
  onPinClick?: (event: MouseEvent, pin: PinEntity) => void;
  onPinHover?: (pin: PinEntity | null) => void;
}

export default forwardRef(function Simulator(
  {
    children,
    editable,
    onMouseUp,
    onMouseMove,
    onMouseDown,
    onGateClick,
    onPinClick,
    onPinHover,
  }: Props,
  displayRef: any,
) {
  const ref = useRef<HTMLDivElement>(null);

  const [render, rerender] = useState<boolean>(false);
  const [expandWarning, setExpandWarning] = useState<boolean>(false);

  const settings = useSimulatorStore((state: SimulatorState) => state.settings);
  const terminals = useSimulatorStore((state: SimulatorState) => state.terminals);
  const gates = useSimulatorStore((state: SimulatorState) => state.gates);
  const wires = useSimulatorStore((state: SimulatorState) => state.wires);

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
      <div className="border-zinc-800 border-4 rounded-lg p-8 sm:mt-20 text-center">
        <h1 className="font-bold text-2xl">Expand your window</h1>
        <div className="flex justify-center py-2">
          <ExpandIcon size={40} className="animate-ping" />
          <ExpandIcon size={40} className="absolute" />
        </div>
        <p className="text-zinc-400">The simulator needs a bit more width to fit.</p>
      </div>
    );
  }

  return (
    <div className="flex-col space-y-3">
      <div
        className="relative border-zinc-800 border-4 rounded-lg grow shadow-[0_0px_15px_0px_rgba(139,92,246,0.1)]"
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
        <svg
          ref={displayRef}
          className="w-full h-full"
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
        >
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
          {children}
          {wires.map((wire, i) => (
            <Wire
              key={i}
              wire={wire}
              points={[wire.startPin.getPos(), ...wire.checkpoints, wire.endPin.getPos()]}
              active={wire.startPin.active || wire.endPin.active}
              editable={editable}
            />
          ))}
          {gates.map((gate: GateEntity, i) => (
            <Fragment key={i}>
              <Gate key={i} gate={gate} onClick={onGateClick} editable={editable} />
              {gate.inputPins.map((pin, j) => {
                return (
                  <Pin
                    key={`in-${j}`}
                    pin={pin}
                    pos={pin.getPos()}
                    onMouseDown={(event) => onPinClick?.(event, pin)}
                    onHover={onPinHover}
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
                    onHover={onPinHover}
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
                onHover={onPinHover}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
});
