import { Project } from "../common/types";
import { toast } from "react-toastify";

export const validateProjectDetails = (details?: Project): boolean => {
  if (!details) {
    toast.error("You must fill out the fields.");
    return false;
  }

  if (!/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/.test(details.name) || details.name.length > 50) {
    toast.error(
      "The name can only contain letters, numbers and single spaces and be a maximum 50 characters.",
    );
    return false;
  }

  return true;
};
