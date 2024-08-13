import { useLoaderData } from "react-router-dom";
import { getProject } from "../../services/project/service";
import { useQuery } from "@tanstack/react-query";
import Editor from "../../components/editor/Editor";

export default function EditProjectCircuit() {
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
      <Editor project={project!} />
    </div>
  );
}
