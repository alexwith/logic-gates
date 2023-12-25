import { Pos } from "../../common/types";
import { DiagramState, useDiagramStore } from "../../store";
import { BoundingBox } from "../../utils/boundingBox";
import { nearestBoundingBox } from "../../utils/boundingBoxUtil";

interface Props {
  id: number;
  pos0: Pos;
  pos1: Pos;
  active: boolean;
  pos0BB?: BoundingBox;
  pos1BB?: BoundingBox;
}

const SAFETY_PADDING = 25;

export default function Connection({ pos0, pos1, active, pos0BB, pos1BB }: Props) {
  const gates = useDiagramStore((state: DiagramState) => state.gates);

  const { x: x0, y: y0 } = pos0;
  const { x: x1, y: y1 } = pos1;

  const boundingBoxes = gates.map((gate) => gate.boundingBox!);
  pos0BB = pos0BB || nearestBoundingBox(boundingBoxes, pos0)!.grow(SAFETY_PADDING);
  pos1BB = pos1BB || nearestBoundingBox(boundingBoxes, pos1)!.grow(SAFETY_PADDING);

  const isPos0Right = pos0.x > pos0BB.minX + (pos0BB.maxX - pos0BB.minX) / 2;
  const isPos1Right = pos1.x > pos1BB.minX + (pos1BB.maxX - pos1BB.minX) / 2;

  const lineStyle = `stroke-[4px] ${active ? "stroke-red-500" : "stroke-slate-700"}`;

  const createZigLine = (x0: number, y0: number, x1: number, y1: number) => {
    const middleX = (x0 + x1) / 2;
    const minY = Math.min(y0, y1);
    const diffY = Math.abs(y0 - y1);

    return (
      <>
        <line className={lineStyle} x1={middleX} y1={minY} x2={middleX} y2={minY + diffY} />
        <line className={lineStyle} x1={x0} y1={y0} x2={middleX} y2={y0} />
        <line className={lineStyle} x1={x1} y1={y1} x2={middleX} y2={y1} />
      </>
    );
  };

  const createStapleLine = (x0: number, y0: number, x1: number, y1: number) => {
    let endX1 = x0 + SAFETY_PADDING * (isPos0Right ? 1 : -1);
    if ((isPos0Right && pos0.x - pos1.x < 0) || (!isPos0Right && pos0.x - pos1.x >= 0)) {
      endX1 = x1 + SAFETY_PADDING * (isPos1Right ? 1 : -1);
    }

    return (
      <>
        <line className={lineStyle} x1={x0} y1={y0} x2={endX1} y2={y0} />
        <line className={lineStyle} x1={endX1} y1={y0} x2={endX1} y2={y1} />
        <line className={lineStyle} x1={endX1} y1={y1} x2={x1} y2={y1} />
      </>
    );
  };

  const createZigFlip = (x0: number, y0: number, x1: number, y1: number) => {
    const endX0 = x0 + SAFETY_PADDING * (isPos0Right ? 1 : -1);
    const endX1 = x1 + SAFETY_PADDING * (isPos0Right ? -1 : 1);

    let middleY = (y0 + y1) / 2;
    if (pos0BB!.isInside({ x: x0, y: middleY }) || pos1BB!.isInside({ x: x0, y: middleY })) {
      middleY = Math.max(pos0BB!.maxY, pos1BB!.maxY);
    }

    return (
      <>
        <line className={lineStyle} x1={x0} y1={y0} x2={endX0} y2={y0} />
        <line className={lineStyle} x1={endX0} y1={y0} x2={endX0} y2={middleY} />
        <line className={lineStyle} x1={endX0} y1={middleY} x2={endX1} y2={middleY} />
        <line className={lineStyle} x1={endX1} y1={middleY} x2={endX1} y2={y1} />
        <line className={lineStyle} x1={x1} y1={y1} x2={endX1} y2={y1} />
      </>
    );
  };

  const createLine = () => {
    if (!pos0BB || !pos1BB) {
      return createZigLine(x0, y0, x1, y1);
    }

    if (isPos0Right !== isPos1Right) {
      if ((isPos0Right && pos1.x - pos0.x < 0) || (isPos1Right && pos0.x - pos1.x < 0)) {
        return createZigFlip(x0, y0, x1, y1);
      } else if ((isPos0Right && pos1.x - pos0.x >= 0) || (isPos1Right && pos0.x - pos1.x >= 0)) {
        return createZigLine(x0, y0, x1, y1);
      }
    }

    return createStapleLine(x0, y0, x1, y1);
  };

  return <>{createLine()}</>;
}
