import { GridIcon } from "../../../common/icons";
import { SimulatorActions, SimulatorState, useSimulatorStore } from "../../../store/simulatorStore";

export default function EditorSettings() {
  const settings = useSimulatorStore((state: SimulatorState) => state.settings);

  const setSettings = useSimulatorStore((actions: SimulatorActions) => actions.setSettings);

  const handleToggleGrid = () => {
    setSettings({
      grid: !settings.grid,
    });
  };

  return (
    <div className="absolute flex space-x-3 justify-center items-center bg-zinc-800 p-2 right-0 bottom-0 m-2 rounded-md [&>*]:hover:cursor-pointer">
      <GridIcon size={20} onClick={handleToggleGrid} />
    </div>
  );
}
