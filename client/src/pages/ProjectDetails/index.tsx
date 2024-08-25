import BasicButton from "../../components/common/BasicButton";
import { useLoaderData, useNavigate } from "react-router-dom";
import { getProject, updateProject } from "../../services/project/service";
import DetailsForm from "../../components/project/DetailsForm";
import { useState } from "react";
import { Project } from "../../common/types";
import { useQuery } from "@tanstack/react-query";
import { validateProjectDetails } from "../../libs/validation";
import { SaveIcon } from "../../common/icons";

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

    await updateProject(project!.id!, {
      name: details!.name,
      shortDescription: details!.shortDescription,
      description: details!.description,
      visibility: details!.visibility,
    });
    navigate(`/project/${project!.id}`);
  };

  return (
    <div className="flex flex-col space-y-4 max-w-1/3 mt-12 mx-6">
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
