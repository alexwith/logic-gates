import { Link, Outlet } from "react-router-dom";
import MiniProfile from "../MiniProfile";
import GlobalSearch from "../GlobalSearch";

export default function Layout() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-20 justify-between items-center w-full px-10 max-w-[1500px]">
        <Link to="/">
          <h1 className="font-black text-3xl hover:cursor-pointer">Logic Gates</h1>
        </Link>
        <GlobalSearch />
        <MiniProfile />
      </div>
      <Outlet />
    </div>
  );
}
