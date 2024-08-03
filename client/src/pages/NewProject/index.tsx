import BasicButton from "../../components/common/BasicButton";
import { LuCircuitBoard as NewProjectIcon } from "react-icons/lu";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { createProject } from "../../services/projectService";
import { DetailsForm } from "../../components/project/DetailsForm";
import { useState } from "react";
import { Project } from "../../common/types";

export default function NewProject() {
  const { user } = useUser();
  const routerNavigate = useNavigate();

  const [details, setDetails] = useState<Project | undefined>();

  const handleCreateClick = async () => {
    if (!details) {
      toast.error("You must fill out the fields.");
      return;
    }

    if (!/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/.test(details.name) || details.name.length > 50) {
      toast.error(
        "The name can only contain letters, numbers and single spaces and be a maximum 50 characters.",
      );
      return;
    }

    await createProject({
      ...details,
      data: Int8Array.from([]),
    });

    routerNavigate(`/user/${user.id}`);
  };

  return (
    <div className="flex flex-col space-y-4 w-1/3 mt-12">
      <div>
        <h1 className="font-bold text-2xl">Create a new project</h1>
        <p className="text-zinc-500">
          A project is a place to manage and create circuits with a goal in mind.
        </p>
      </div>
      <DetailsForm onUpdate={setDetails} />
      <div className="flex justify-end">
        <BasicButton
          name="Create project"
          icon={<NewProjectIcon size={20} />}
          onClick={handleCreateClick}
        />
      </div>
    </div>
  );
}
