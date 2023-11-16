import { POS_ZERO } from "../common/constants";
import { GlobalPinMeta, PortMeta, Pos } from "../common/types";
import { indexFromPinId, isGlobalPinId, isInputPinId } from "../utils/idUtil";

export const computePortPinPos = (
  diagramRef: any,
  ports: PortMeta[],
  globalPins: GlobalPinMeta[],
  pinId: string
): Pos => {
  const args = pinId.split("-");
  const pinIndex = Number(args[2]);
  if (isGlobalPinId(pinId)) {
    const pin = globalPins.find((pin) => pin.id === pinId);

    return pin ? computeGlobalEntryPos(diagramRef, globalPins, pinId) : POS_ZERO;
  }

  const portId = Number(args[0]);
  const input = isInputPinId(args[1]);

  const port = ports.find((port) => port.id === portId);
  if (!port) {
    return POS_ZERO;
  }

  const { x: cx, y: cy } = port.pos;

  const pins = input ? port.inputs : port.outputs;
  const spacing = port.height / pins;
  const offsetY = spacing / 2;
  const offsetX = input ? 0 : port.width;

  return { x: cx + offsetX, y: cy + offsetY + spacing * pinIndex };
};

export const computeGlobalEntryPos = (
  diagramRef: any,
  globalPins: GlobalPinMeta[],
  pinId: string
): Pos => {
  if (!diagramRef.current) {
    return POS_ZERO;
  }

  const diagramRect: DOMRect = diagramRef.current.getBoundingClientRect();
  const input = isInputPinId(pinId);

  return {
    x: input ? 50 : diagramRect.width - 60,
    y: computeGlobalPinYPos(diagramRef, globalPins, pinId) - 39,
  };
};

export const computeGlobalPinYPos = (
  diagramRef: any,
  globalPins: GlobalPinMeta[],
  pinId: string
): number => {
  if (!diagramRef.current) {
    return 0;
  }

  const pinIndex = indexFromPinId(pinId);
  const isInput = isInputPinId(pinId);

  const amount = globalPins.filter((pin) => pin.input === isInput).length;

  const diagramRect: DOMRect = diagramRef.current.getBoundingClientRect();
  const middle = diagramRect.height / 2;
  const top = middle - 40 * amount;
  const bottom = middle + 40 * amount;
  const length = Math.abs(top - bottom);

  const interval = amount <= 0 ? 0 : length / amount;
  return top + interval / 2 + interval * pinIndex;
};