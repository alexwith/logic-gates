import { Link } from "react-router-dom";
import Discovery from "../../components/common/Discovery";

export default function Home() {
  return (
    <div className="flex flex-col mt-10 items-center">
      <h1 className="font-bold text-4xl text-center sm:text-5xl">
        <span className="text-violet-500">Build</span>,{" "}
        <span className="text-green-400">simulate</span> and{" "}
        <span className="text-sky-400">share</span> circuits
      </h1>
      <p className="text-lg sm:text-xl text-center max-w-2xl p-2">
        Easily create and simulate logic gate circuits, then share your designs for collaboration
        and learning.
      </p>
      <Link to="/playground">
        <div className="bg-midnight border-[3px] border-violet-500 px-4 py-2 font-bold text-xl rounded-md m-6 shadow-[0_0px_15px_0px_rgba(139,92,246,0.9)] hover:cursor-pointer hover:bg-violet-500">
          Try playground
        </div>
      </Link>
      <div className="w-fit pt-10">
        <Discovery />
      </div>
    </div>
  );
}
