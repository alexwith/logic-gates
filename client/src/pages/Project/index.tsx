import { useLoaderData } from "react-router-dom";
import { getProject } from "../../services/projectService";
import { useQuery } from "@tanstack/react-query";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../css/markdown.css";
import { EDITOR_WIDTH } from "../../common/constants";

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
    <div className="">
      <h1 className="font-bold text-2xl">{project!.name}</h1>
      <div
        className="prose prose-invert markdown border-4 border-zinc-800 p-4 rounded-lg mt-4"
        style={{ maxWidth: EDITOR_WIDTH }}
      >
        <Markdown remarkPlugins={[remarkGfm]}>{project!.description}</Markdown>
      </div>
    </div>
  );
}

export const handleProjectLoader = async ({ params }: any): Promise<number> => {
  const { projectId } = params;

  const project = await getProject(projectId);
  return project.id!;
};
