import { useLoaderData } from "react-router-dom";
import { getProject } from "../../services/projectService";
import { useQuery } from "@tanstack/react-query";

export function Project() {
  const projectId = useLoaderData() as number;
  const { isLoading, data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
  });

  if (isLoading) {
    return null;
  }

  return (
    <div>
      <h1 className="font-bold text-2xl">{project!.name}</h1>
    </div>
  );
}

export const handleProjectLoader = async ({ params }: any): Promise<number> => {
  const { projectId } = params;

  const project = await getProject(projectId);
  return project.id!;
};
