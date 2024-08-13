import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { getMe } from "../services/user/service";
import { User } from "../common/types";
import axios from "axios";

interface UserFnData {
  user: User;
  isLoading: boolean;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
}

const defaultUser: User = {
  id: -1,
  githubId: -1,
  username: "",
};

const logout = async (): Promise<void> => {
  await axios.post("/api/v1/auth/logout");
};

const UserContext = createContext<UserFnData>({
  user: defaultUser,
  isLoading: false,
  isLoggedIn: false,
  logout,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getMe(),
  });

  const data: UserFnData = {
    user: (user as User) || defaultUser,
    isLoading: isLoading,
    isLoggedIn: !isError && !isLoading,
    logout,
  };

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

export const useUser = (): UserFnData => {
  return useContext(UserContext);
};
