import Editor from "./components/Editor";
import MiniProfile from "./components/MiniProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex h-20 justify-between items-center w-full px-10">
          <h1 className="font-black text-3xl">Logic Gates</h1>
          <MiniProfile />
        </div>
        <Editor />
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
        toastStyle={{ backgroundColor: "#181818" }}
      />
    </>
  );
}
