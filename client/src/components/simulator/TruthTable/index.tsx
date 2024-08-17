import { IO } from "../../../common/types";
import TerminalEntity from "../../../entities/TerminalEntity";

interface Props {
  terminals: TerminalEntity[];
  truthTable: boolean[][];
}

export default function TruthTable({ terminals, truthTable }: Props) {
  if (truthTable.length === 0) {
    return <h1 className="font-bold">Empty truth table</h1>;
  }

  return (
    <div className="rounded-lg overflow-auto inline-block text-center font-bold w-fit h-fit">
      <table className="w-full h-full">
        <thead className="bg-zinc-700">
          <tr>
            {terminals
              .filter((pin) => pin.io === IO.Input)
              .map((terminal, i) => (
                <th className="py-1 px-3" key={i}>
                  {terminal.name}
                </th>
              ))}
            {terminals
              .filter((pin) => pin.io === IO.Output)
              .map((terminal, i) => (
                <th className="py-1 px-3" key={i}>
                  {terminal.name}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {truthTable.map((row, i) => {
            return (
              <tr className="odd:bg-zinc-600 even:bg-zinc-700" key={i}>
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
