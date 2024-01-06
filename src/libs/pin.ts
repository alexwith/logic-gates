import { POS_ZERO } from "../common/constants";
import { TerminalMeta, GateMeta, Pos } from "../common/types";
import { indexFromPinId, isTerminalId, isInputPinId, gateIdFromPinId } from "../utils/idUtil";

export const computeGatePinPos = (
  editorRef: any,
  gates: GateMeta[],
  terminals: TerminalMeta[],
  pinId: string
): Pos => {
  const pinIndex = indexFromPinId(pinId);
  if (isTerminalId(pinId)) {
    const terminal = terminals.find((pin) => pin.id === pinId);

    return terminal ? computeTerminalPos(editorRef, terminals, pinId) : POS_ZERO;
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
  editorRef: any,
  terminals: TerminalMeta[],
  pinId: string
): Pos => {
  if (!editorRef.current) {
    return POS_ZERO;
  }

  const editorRect: DOMRect = editorRef.current.getBoundingClientRect();
  const input = isInputPinId(pinId);
  const terminal = terminals.find((terminal) => terminal.id === pinId);

  return {
    x: input ? 50 : editorRect.width - 60,
    y: terminal!.yPos - 15,
  };
};