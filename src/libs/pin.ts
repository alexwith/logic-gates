import { POS_ZERO } from "../common/constants";
import { TerminalMeta, GateMeta, Pos } from "../common/types";
import { indexFromPinId, isTerminalId, isInputPinId } from "../utils/idUtil";

export const computeGatePinPos = (
  diagramRef: any,
  gates: GateMeta[],
  terminals: TerminalMeta[],
  pinId: string
): Pos => {
  const args = pinId.split("-");
  const pinIndex = Number(args[2]);
  if (isTerminalId(pinId)) {
    const pin = terminals.find((pin) => pin.id === pinId);

    return pin ? computeTerminalPos(diagramRef, terminals, pinId) : POS_ZERO;
  }

  const gateId = Number(args[0]);
  const input = isInputPinId(pinId);

  const gate = gates.find((gate) => gate.id === gateId);
  if (!gate) {
    return POS_ZERO;
  }

  const { x: cx, y: cy } = gate.pos;

  const pins = input ? gate.inputs : gate.outputs;
  const spacing = gate.height / pins;
  const offsetY = spacing / 2;
  const offsetX = input ? 0 : gate.width;

  return { x: cx + offsetX, y: cy + offsetY + spacing * pinIndex };
};

export const computeTerminalPos = (
  diagramRef: any,
  terminals: TerminalMeta[],
  pinId: string
): Pos => {
  if (!diagramRef.current) {
    return POS_ZERO;
  }

  const diagramRect: DOMRect = diagramRef.current.getBoundingClientRect();
  const input = isInputPinId(pinId);  

  return {
    x: input ? 50 : diagramRect.width - 60,
    y: computeTerminalYPos(diagramRef, terminals, pinId) - 39,
  };
};

export const computeTerminalYPos = (
  diagramRef: any,
  terminals: TerminalMeta[],
  pinId: string
): number => {
  if (!diagramRef.current) {
    return 0;
  }

  const pinIndex = indexFromPinId(pinId);
  const isInput = isInputPinId(pinId);

  const amount = terminals.filter((pin) => pin.input === isInput).length;

  const diagramRect: DOMRect = diagramRef.current.getBoundingClientRect();
  const middle = diagramRect.height / 2;
  const top = middle - 40 * amount;
  const bottom = middle + 40 * amount;
  const length = Math.abs(top - bottom);

  const interval = amount <= 0 ? 0 : length / amount;
  return top + interval / 2 + interval * pinIndex;
};