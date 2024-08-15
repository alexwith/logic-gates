import { Link } from "react-router-dom";
import { Project } from "../../../common/types";

interface Props {
  project: Project;
}
export default function ProjectCard({ project }: Props) {
  return (
    <div className="flex-col space-y-2 border-zinc-700 border-4 rounded-lg w-96 px-4 pt-2 pb-4">
      <div className="flex justify-between">
        <Link to={`/project/${project.id}`}>
          <h1 className="font-bold text-xl hover:text-violet-500 hover:cursor-pointer">
            {project.name}
          </h1>
        </Link>
        <div className="flex flex-col">
          <p className="border-2 border-violet-500 px-2 rounded-md font-bold text-violet-500">
            {project.visibility.charAt(0) + project.visibility.slice(1).toLowerCase()}
          </p>
        </div>
      </div>
      <p className="text-zinc-400 line-clamp-2 h-12">{project.shortDescription}</p>
    </div>
  );
}
