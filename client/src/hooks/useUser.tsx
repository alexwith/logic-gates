import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      return fetch("http://localhost:8080/api/v1/user/me", {
        credentials: "include",
      })
        .then((response) => (response.ok ? response.json() : null))
        .catch(() => {
          return null;
        });
    },
  });

  if (isLoading) {
    return <></>;
  }

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

export const useUser = (): any => {
  return useContext(UserContext);
};
