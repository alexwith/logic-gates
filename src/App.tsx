import Editor from "./components/Editor";
import GateTypes from "./components/GateTypes";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="flex flex-col items-center">
      <div>
        <h1 className="font-black text-3xl my-6">Logic Gates</h1>
        <div className="flex space-x-20">
          <Sidebar />
          <div className="flex flex-col w-[1200px] space-y-2">
            <Editor />
            <GateTypes />
          </div>
        </div>
      </div>
    </div>
  );
}
