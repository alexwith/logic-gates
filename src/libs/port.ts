import { POS_ZERO } from "../common/constants";
import { GlobalPinMeta, PortMeta, Pos } from "../common/types";
import { isGlobalPinId, isInputPinId } from "../utils/idUtil";

export const computePinPos = (
  ports: PortMeta[],
  globalPins: GlobalPinMeta[],
  pinId: string
): Pos => {
  const args = pinId.split("-");
  const pinIndex = Number(args[2]);
  if (isGlobalPinId(pinId)) {
    const pin = globalPins[pinIndex];

    return pin ? pin.pos : POS_ZERO;
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
