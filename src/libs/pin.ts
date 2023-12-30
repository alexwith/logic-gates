import { POS_ZERO } from "../common/constants";
import { TerminalMeta, GateMeta, Pos } from "../common/types";
import { indexFromPinId, isTerminalId, isInputPinId, gateIdFromPinId } from "../utils/idUtil";

export const computeGatePinPos = (
  diagramRef: any,
  gates: GateMeta[],
  terminals: TerminalMeta[],
  pinId: string
): Pos => {
  const pinIndex = indexFromPinId(pinId);
  if (isTerminalId(pinId)) {
    const pin = terminals.find((pin) => pin.id === pinId);

    return pin ? computeTerminalPos(diagramRef, terminals, pinId) : POS_ZERO;
  }

  const gateId = gateIdFromPinId(pinId);
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
  const top = middle - 32 * amount;
  const bottom = middle + 32 * amount;
  const height = Math.abs(top - bottom);

  // 32 is the height of a terminal, should do this dynamically in the future by getting the terminals rect
  const interval = amount <= 0 ? 0 : height / amount;
  return top + interval / 2 + interval * pinIndex + 32;
};
