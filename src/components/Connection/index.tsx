import { Pos } from "../../common/types";

interface Props {
  id: number;
  pos0: Pos;
  pos1: Pos;
  active: boolean;
}

const ORIGIN_PADDING = 25;

export default function Connection({ pos0, pos1, active }: Props) {
  const { x: x0, y: y0 } = pos0;
  const { x: x1, y: y1 } = pos1;

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
    const middleX = (x0 + x1) / 2;
    const minY = Math.min(y0, y1);
    const diffY = Math.abs(y0 - y1);

    const endX1 = x0 + ORIGIN_PADDING;

    return (
      <>
        <line className={lineStyle} x1={x0} y1={y0} x2={endX1} y2={y0} />
        <line className={lineStyle} x1={endX1} y1={y0} x2={endX1} y2={y1} />
        <line className={lineStyle} x1={endX1} y1={y1} x2={x1} y2={y1} />
      </>
    );
  };

  const createLine = () => {
    /*if (x1 < x0 + ORIGIN_PADDING) {
      return createStapleLine(x0, y0, x1, y1);
    }*/

    return createZigLine(x0, y0, x1, y1);
  };

  return <>{createLine()}</>;
}
