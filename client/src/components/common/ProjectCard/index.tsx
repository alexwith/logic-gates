import { Link } from "react-router-dom";
import { Project } from "../../../common/types";
import { useQuery } from "@tanstack/react-query";
import { getLikes } from "../../../services/project/service";

interface Props {
  project: Project;
  showLikes?: boolean;
}

export default function ProjectCard({ project, showLikes }: Props) {
  const { isLoading: isLoadingLikes, data: likes } = useQuery({
    queryKey: ["likes", project.id],
    queryFn: () => getLikes(project.id!),
    enabled: showLikes,
  });

  return (
    <div className="flex-col border-zinc-700 border-4 rounded-lg w-96 px-4 pt-2 pb-4">
      <div className="flex justify-between">
        <Link to={`/project/${project.id}`}>
          <h1 className="font-bold text-xl hover:text-violet-500 hover:cursor-pointer">
            {project.name}
          </h1>
        </Link>
        {showLikes ? (
          <div className="flex flex-col">
            <p className="border-2 border-violet-500 px-2 rounded-md font-bold text-violet-500">
              {isLoadingLikes ? "?" : likes?.length} Likes
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="border-2 border-violet-500 px-2 rounded-md font-bold text-violet-500">
              {project.visibility.charAt(0) + project.visibility.slice(1).toLowerCase()}
            </p>
          </div>
        )}
      </div>
      {project.shortDescription ? (
        <p className="text-zinc-400 line-clamp-2 h-12">{project.shortDescription}</p>
      ) : (
        <p className="text-zinc-500 h-12">There is no description...</p>
      )}
    </div>
  );
}
