import { ProjectVisibilty } from "../../common/types";

export interface UpdateProjectDTO {
  name?: string;
  shortDescription?: string;
  description?: string;
  visibility?: ProjectVisibilty;
  data?: Uint8Array;
}
