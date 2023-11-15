import { Pos } from "../../common/types";
import Pin from "../Pin";

interface Props {
  id: number;
  pos0: Pos;
  pos1: Pos;
  active: boolean;
}

export default function Connection({ pos0, pos1, active }: Props) {
  const { x: x0, y: y0 } = pos0;
  const { x: x1, y: y1 } = pos1;

  /*const bad0 = Math.sign(x1 - x0) != 1;
  const bad1 = Math.sign(x0 - x1) != -1;*/

  const lineStyle = `stroke-[4px] ${active ? "stroke-red-500" : "stroke-slate-700"}`;

  const create4Line = (x0: number, y0: number, x1: number, y1: number) => {
    const middleY = (y0 + y1) / 2;
    return (
      <>
        <line
          className={lineStyle}
          x1={x0}
          y1={middleY}
          x2={x1}
          y2={middleY}
          stroke="white"
          strokeWidth={4}
          width={4}
        />
        <line className={lineStyle} x1={x0} y1={y0} x2={x0} y2={middleY} />
        <line className={lineStyle} x1={x1} y1={y1} x2={x1} y2={middleY} />
      </>
    );
  };

  const create3Line = (x0: number, y0: number, x1: number, y1: number) => {    
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

  const createLine = () => {
    return create3Line(x0, y0, x1, y1);
  };

  return <>{createLine()}</>;
}
