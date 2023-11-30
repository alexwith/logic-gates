import { TerminalMeta } from "../../common/types";

interface Props {
  pins: TerminalMeta[];
  truthTable: boolean[][];
}

export default function TruthTable({ pins, truthTable }: Props) {
  return (
    <div className="rounded-lg overflow-x-auto inline-block text-center font-bold w-fit h-fit">      
      <table className="w-full h-full">
        <thead className="bg-slate-500">
          <tr>
            {pins.map((pin, i) => (
              <th className="py-1 px-3" key={i}>
                {pin.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {truthTable.map((row, i) => {
            return (
              <tr className="odd:bg-slate-700 even:bg-slate-600" key={i}>
                {row.map((value, j) => (
                  <td key={j}>{value ? 1 : 0}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
