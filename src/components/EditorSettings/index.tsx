import { BsFillGrid3X3GapFill as GridIcon } from "react-icons/bs";
import { CgZoomIn as ZoomInIcon, CgZoomOut as ZoomOutIcon } from "react-icons/cg";
import { EditorState, useEditorStore } from "../../store";

export default function EditorSettings() {
  const settings = useEditorStore((state: EditorState) => state.settings);
  const setSettings = useEditorStore((state: EditorState) => state.setSettings);

  const handleToggleGrid = () => {
    setSettings({
      grid: !settings.grid,
    });
  };

  return (
    <div className="absolute flex space-x-3 justify-center items-center bg-slate-700 p-2 right-0 bottom-0 m-2 rounded-md [&>*]:hover:cursor-pointer">
      <GridIcon size={20} onClick={handleToggleGrid} />
      <ZoomInIcon size={20} />
      <ZoomOutIcon size={20} />
    </div>
  );
}
