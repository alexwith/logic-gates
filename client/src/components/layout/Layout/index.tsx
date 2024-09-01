import { Link, Outlet } from "react-router-dom";
import MiniProfile from "../MiniProfile";
import GlobalSearch from "../GlobalSearch";
import { GithubIcon } from "../../../common/icons";

export default function Layout() {
  return (
    <div className="flex flex-col items-center h-screen">
      <div className="flex h-20 justify-between items-center w-full px-10 max-w-[1500px]">
        <div className="text-center">
          <Link to="/">
            <h1 className="font-black text-3xl hover:cursor-pointer">Logic Gates</h1>
          </Link>
        </div>
        <GlobalSearch />
        <MiniProfile />
      </div>
      <Outlet />
      <div className="mt-auto p-5">
        <div className="flex space-x-2 items-center">
          <GithubIcon size={20} />
          <a href="https://github.com/alexwith/logic-gates" className="font-bold">
            View Source Code
          </a>
        </div>
      </div>
    </div>
  );
}
