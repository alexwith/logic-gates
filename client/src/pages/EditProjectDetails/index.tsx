import BasicButton from "../../components/common/BasicButton";
import { HiOutlineSave as SaveIcon } from "react-icons/hi";
import { useLoaderData, useNavigate } from "react-router-dom";
import { getProject, updateProject } from "../../services/projectService";
import DetailsForm from "../../components/project/DetailsForm";
import { useState } from "react";
import { Project } from "../../common/types";
import { useQuery } from "@tanstack/react-query";
import { validateProjectDetails } from "../../libs/validation";

export default function EditProjectDetails() {
  const navigate = useNavigate();
  const projectId = useLoaderData() as number;
  const { isLoading, data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
  });

  const [details, setDetails] = useState<Project | undefined>();

  if (isLoading) {
    return null;
  }

  const handleSaveClick = async () => {
    if (!validateProjectDetails(details)) {
      return;
    }

    await updateProject(project!.id!, details!);
    navigate(`/project/${project!.id}`);
  };

  return (
    <div className="flex flex-col space-y-4 w-1/3 mt-12">
      <h1 className="font-bold text-2xl">
        Editing <span className="text-violet-500">{project!.name}</span>
      </h1>
      <DetailsForm defaults={project} onUpdate={setDetails} />
      <div className="flex justify-end">
        <BasicButton name="Save changes" icon={<SaveIcon size={20} />} onClick={handleSaveClick} />
      </div>
    </div>
  );
}
