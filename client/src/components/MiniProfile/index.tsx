import { useState } from "react";
import { useUser } from "../../hooks/useUser";
import { createGithubUrl } from "../../utils/createGithubUrl";
import { TbLogin2 as LoginIcon } from "react-icons/tb";

export default function MiniProfile() {
  const user = useUser();
  const githubUrl = createGithubUrl(window.location.pathname);

  const [hoveringProfile, setHoveringProfile] = useState<boolean>(false);

  const logout = () => {
    fetch("http://localhost:8080/api/v1/auth/logout", {
      method: "post",
      credentials: "include",
    }).then(() => {
      window.location.reload();
    });
  };

  return (
    <div>
      {user ? (
        <div
          onMouseEnter={() => setHoveringProfile(true)}
          onMouseLeave={() => setHoveringProfile(false)}
        >
          <h1 className="text-lg font-bold hover:cursor-pointer hover:text-zinc-400">{user.username}</h1>
          {hoveringProfile ? (
            <div className="absolute z-10 rounded-lg bg-zinc-800 font-medium text-md p-2 w-[200px] translate-x-[-120px]">
              <p
                className="px-2 py-1 rounded-md hover:cursor-pointer hover:bg-zinc-700"
                onClick={logout}
              >
                Log Out
              </p>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div
          className="flex space-x-2 items-center hover:text-zinc-400 hover:cursor-pointer"
          onClick={() => {
            window.location.href = githubUrl;
          }}
        >
          <h1 className="text-lg font-bold">Log In</h1>
          <LoginIcon size={25} />
        </div>
      )}
    </div>
  );
}
