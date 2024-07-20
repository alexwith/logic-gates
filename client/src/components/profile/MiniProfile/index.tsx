import { useEffect, useRef, useState } from "react";
import { useUser } from "../../../hooks/useUser";
import { createGithubUrl } from "../../../utils/createGithubUrl";
import { TbLogin2 as LogInIcon } from "react-icons/tb";
import { TbLogout2 as LogOutIcon } from "react-icons/tb";
import BasicButton from "../../common/BasicButton";

export default function MiniProfile() {
  const user = useUser();
  const githubUrl = createGithubUrl(window.location.pathname);

  const menuRef = useRef<any>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const logout = () => {
    fetch("http://localhost:8080/api/v1/auth/logout", {
      method: "post",
      credentials: "include",
    }).then(() => {
      window.location.reload();
    });
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && menuRef.current.contains(event.target)) {
        return;
      }

      setShowMenu(false);
    };

    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <div className="flex space-x-1 items-center" onClick={() => setShowMenu(!showMenu)}>
            <img
              className="w-12 h-12 rounded-full border-4 border-zinc-800"
              alt="User avatar"
              src={`https://avatars.githubusercontent.com/u/${user.githubId}?v=4`}
            />
            <h1 className="text-lg font-bold hover:cursor-pointer hover:text-zinc-400">
              {user.username}
            </h1>
          </div>
          {showMenu && (
            <div
              className="absolute z-10 rounded-lg bg-zinc-800 font-bold text-md p-2 w-[200px] translate-x-[-50px] mt-4"
              ref={menuRef}
            >
              <BasicButton
                name="Log Out"
                icon={<LogOutIcon size={20} />}
                hoverable
                onClick={logout}
              />
            </div>
          )}
        </div>
      ) : (
        <BasicButton
          name="Log In"
          icon={<LogInIcon size={25} />}
          hoverable
          onClick={() => {
            window.location.href = githubUrl;
          }}
        />
      )}
    </div>
  );
}
