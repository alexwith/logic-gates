import { useEffect, useState } from "react";
import Editor from "./components/Editor";
import GateTypes from "./components/GateTypes";
import MiniProfile from "./components/MiniProfile";
import { VscArrowBoth as ExpandWidthIcon } from "react-icons/vsc";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [expandWarning, setExpandWarning] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (!expandWarning && window.innerWidth < 1200) {
        setExpandWarning(true);
      }

      if (expandWarning && window.innerWidth > 1200) {
        setExpandWarning(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [expandWarning]);

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex h-20 justify-between items-center w-full px-10">
          <h1 className="font-black text-3xl">Logic Gates</h1>
          <MiniProfile />
        </div>
        <div className="flex space-x-5">
          {expandWarning ? (
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 border-zinc-800 border-4 rounded-lg p-8">
              <h1 className="text-center font-bold text-2xl">Expand your window</h1>
              <div className="flex justify-center py-2">
                <ExpandWidthIcon size={40} className="animate-ping" />
                <ExpandWidthIcon size={40} className="absolute" />
              </div>
              <p className="text-zinc-400">The editor needs a bit more width to fit.</p>
            </div>
          ) : (
            <div className="flex flex-col w-[1200px] space-y-2">
              <Editor />
              <GateTypes />
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{ backgroundColor: "#181818"}}
      />
    </>
  );
}
