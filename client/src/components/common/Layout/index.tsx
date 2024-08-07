import MiniProfile from "../../profile/MiniProfile";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-20 justify-between items-center w-full px-10 max-w-[1500px]">
        <Link to="/">
          <h1 className="font-black text-3xl hover:cursor-pointer">Logic Gates</h1>
        </Link>
        <MiniProfile />
      </div>
      <Outlet />
    </div>
  );
}
