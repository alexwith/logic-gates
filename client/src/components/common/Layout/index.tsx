import { PropsWithChildren } from "react";
import MiniProfile from "../../profile/MiniProfile";
import { ToastContainer } from "react-toastify";

interface Props {}

export function Layout({ children }: PropsWithChildren<Props>) {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex h-20 justify-between items-center w-full px-10 max-w-[1500px]">
          <h1 className="font-black text-3xl">Logic Gates</h1>
          <MiniProfile />
        </div>
        {children}
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
