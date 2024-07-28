import axios from "axios";
import { Project, User } from "../common/types";

export const getMe = async (): Promise<User> => {
  const response = await axios.get("/api/v1/users/me");
  return await response.data;
};

export const getUser = async (id: number): Promise<User> => {
  const response = await axios.get(`/api/v1/users/${id}`);
  return response.data;
};

export const getProjects = async (userId: number): Promise<Project[]> => {
  const response = await axios.get(`/api/v1/users/${userId}/projects`);
  return response.data;
};
