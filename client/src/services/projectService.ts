import axios from "axios";
import { Project } from "../common/types";

export const createProject = async ({
  name,
  shortDescription,
  description,
  visibility,
}: Project): Promise<void> => {
  await axios.post("/api/v1/projects/create", {
    name,
    shortDescription,
    description,
    visibility,
  });
  return Promise.resolve();
};

export const getLikes = async (id: number): Promise<number[]> => {
  const response = await axios.get(`/api/v1/projects/likes/${id}`);
  return response.data;
};

export const toggleLike = async (id: number): Promise<boolean> => {
  const response = await axios.post(`/api/v1/projects/like/${id}/toggle`);
  return response.status === 200;
};
