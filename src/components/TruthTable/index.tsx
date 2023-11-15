import { GlobalPinMeta } from "../../common/types";

interface Props {
  pins: GlobalPinMeta[];
  truthTable: boolean[][];
}

export default function TruthTable({ pins, truthTable }: Props) {

  return (
    <div className="absolute rounded-lg overflow-x-auto inline-block text-center font-bold w-fit h-fit">
      <table className="w-full h-full">
        <thead className="bg-slate-500">
          <tr>
            {pins.map((pin) => (
              <th className="py-1 px-3">{pin.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {truthTable.map((row) => {
            return (
              <tr className="odd:bg-slate-700 even:bg-slate-600">
                {row.map((value) => (
                  <td>{value ? 1 : 0}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
