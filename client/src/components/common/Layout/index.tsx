import MiniProfile from "../../profile/MiniProfile";
import { Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex h-20 justify-between items-center w-full px-10 max-w-[1500px]">
        <h1 className="font-black text-3xl hover:cursor-pointer" onClick={handleHomeClick}>
          Logic Gates
        </h1>
        <MiniProfile />
      </div>
      <Outlet />
    </div>
  );
}
