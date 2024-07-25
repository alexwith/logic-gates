import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/v1/user/me");
        return await response.json();
      } catch {
        return null;
      }
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
