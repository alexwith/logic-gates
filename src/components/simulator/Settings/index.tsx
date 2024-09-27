import { GridIcon, StraightLinesIcon } from "../../../common/icons";
import { tryStraightenWire } from "../../../libs/wires";
import { SimulatorActions, SimulatorState, useSimulatorStore } from "../../../store/simulatorStore";

export default function Settings() {
  const settings = useSimulatorStore((state: SimulatorState) => state.settings);
  const wires = useSimulatorStore((state: SimulatorState) => state.wires);

  const setSettings = useSimulatorStore((actions: SimulatorActions) => actions.setSettings);

  const handleToggleGrid = () => {
    setSettings({
      ...settings,
      grid: !settings.grid,
    });
  };

  const handleToggleStraightWires = () => {
    if (!settings.autoStraightWires) {
      wires.forEach((wire) => {
        tryStraightenWire(wire.startPin.getPos(), wire.endPin.getPos(), wire.checkpoints);
      });
    }

    setSettings({
      ...settings,
      autoStraightWires: !settings.autoStraightWires,
    });
  };

  return (
    <div className="absolute flex space-x-2 justify-center items-center right-0 bottom-0 m-2">
      <div
        className={`bg-zinc-800 p-1 rounded-md [&>*]:hover:cursor-pointer ${settings.autoStraightWires && "border-[1px] border-violet-500"}`}
      >
        <StraightLinesIcon size={20} onClick={handleToggleStraightWires} />
      </div>
      <div
        className={`bg-zinc-800 p-1 rounded-md [&>*]:hover:cursor-pointer ${settings.grid && "border-[1px] border-violet-500"}`}
      >
        <GridIcon size={20} onClick={handleToggleGrid} />
      </div>
    </div>
  );
}
