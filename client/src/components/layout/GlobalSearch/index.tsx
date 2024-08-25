import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useRef, useState } from "react";
import { Project, User } from "../../../common/types";
import useDebounce from "../../../hooks/useDebounce";
import { searchName } from "../../../services/project/service";
import { searchUsername } from "../../../services/user/service";
import { useNavigate } from "react-router-dom";

const useSearch = <T,>(id: string, query: string, search: (query: string) => Promise<T[]>) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [`${id}/${query}`],
    queryFn: async () => {
      if (!query) {
        return [] as T[];
      }

      const cache = queryClient.getQueryData([`${id}/${query}`]);
      if (cache) {
        return cache as T[];
      }

      return await search(query);
    },
  });
};

export default function GlobalSearch() {
  const debounce = useDebounce();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [showResults, setShowResults] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const { data: projects } = useSearch("searchProject", query, searchName);
  const { data: users } = useSearch("searchUsers", query, searchUsername);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    debounce(() => setQuery(query));
  };

  const handleQueryFocus = () => {
    setShowResults(true);
  };

  const handleQueryBlur = () => {
    setShowResults(false);
    setQuery("");
    inputRef.current!.value = "";
  };

  return (
    <div className="relative hidden sm:block">
      <input
        ref={inputRef}
        className="border-zinc-800 border-[3px] bg-transparent rounded-md px-2 py-1 outline-none focus:border-violet-500"
        onChange={handleQueryChange}
        placeholder="Search for circuits"
        onFocus={handleQueryFocus}
        onBlur={handleQueryBlur}
      />
      {showResults && (
        <div className="absolute flex flex-col space-y-2 bg-midnight z-20 border-4 border-zinc-800 rounded-md w-72 px-4 py-2 -translate-x-1/2 left-1/2 mt-2">
          <div>
            {projects && projects.length > 0 && (
              <>
                <h1 className="font-bold text-lg">Projects</h1>
                <div className="flex flex-col space-y-1">
                  {projects.map((project: Project) => {
                    return (
                      <div
                        key={project.id}
                        className="border-2 border-zinc-700 px-1 rounded-md hover:border-violet-500 hover:cursor-pointer"
                        onMouseDown={() => navigate(`/project/${project.id}`)}
                      >
                        <p className="font-bold text-violet-500">{project.name}</p>
                        {project.shortDescription ? (
                          <p className="text-zinc-400 text-sm line-clamp-1">
                            {project.shortDescription}
                          </p>
                        ) : (
                          <p className="text-zinc-500 text-sm">There is no description...</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <div>
            {users && users.length > 0 && (
              <>
                <h1 className="font-bold text-lg">Users</h1>
                <div className="flex flex-col space-y-1">
                  {users.map((user: User) => {
                    return (
                      <div
                        key={user.id}
                        className="border-2 border-zinc-700 px-1 rounded-md hover:border-violet-500 hover:cursor-pointer"
                        onMouseDown={() => navigate(`/user/${user.id}`)}
                      >
                        <p className="font-bold text-violet-500">{user.username}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
