import { useLoaderData, useNavigate } from "react-router-dom";
import { deleteProject, getProject } from "../../services/projectService";
import { useQuery } from "@tanstack/react-query";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../css/markdown.css";
import { SIMULATOR_WIDTH } from "../../common/constants";
import Simulator from "../../components/simulator/Simulator";
import BasicButton from "../../components/common/BasicButton";
import { useState } from "react";
import TruthTableButton from "../../components/common/TruthTableButton";
import { useUser } from "../../hooks/useUser";
import { CircuitIcon, EditIcon, ForkIcon, MenuIcon, TrashIcon } from "../../common/icons";

export default function Project() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUser();
  const projectId = useLoaderData() as number;
  const { isLoading, data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
  });

  const [showMenu, setShowMenu] = useState<boolean>(false);

  if (isLoading) {
    return null;
  }

  const isUserCreator = isLoggedIn && user.id === project!.creatorId;

  const handleEditDetailsClick = () => {
    navigate(`/projectdetails/${project!.id}`);
  };

  const handleDeleteClick = async () => {
    await deleteProject(project!.id!);
    navigate(`/user/${user.id}`);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-4">
        <div>
          <h1 className="font-bold text-2xl">{project!.name}</h1>
          <p className="text-zinc-300 max-w-lg">{project!.shortDescription}</p>
        </div>
        <div className="flex space-x-2 mt-auto">
          <div onMouseEnter={() => setShowMenu(true)} onMouseLeave={() => setShowMenu(false)}>
            <BasicButton name="Menu" icon={<MenuIcon size={20} />} />
            <div
              className={`absolute flex flex-col space-y-1 bg-zinc-800 p-2 w-44 rounded-md z-10 ${
                showMenu ? "" : "hidden"
              }`}
            >
              {!isUserCreator && (
                <BasicButton name="Fork" icon={<ForkIcon size={20} />} hoverable />
              )}
              {isUserCreator && (
                <>
                  <BasicButton
                    name="Edit details"
                    icon={<EditIcon size={20} />}
                    hoverable
                    onClick={handleEditDetailsClick}
                  />
                  <BasicButton name="Edit circuit" icon={<CircuitIcon size={20} />} hoverable />
                  <BasicButton
                    name="Delete"
                    icon={<TrashIcon size={20} />}
                    hoverable
                    onClick={handleDeleteClick}
                  />
                </>
              )}
            </div>
          </div>
          <TruthTableButton />
        </div>
      </div>
      <Simulator project={project!} />
      <div className="border-4 border-zinc-800 rounded-lg my-4">
        <h1 className="leading-tight border-b-4 text-xl font-bold mb-4 p-2 border-zinc-800">
          Description
        </h1>
        <div className="prose prose-invert markdown px-4" style={{ maxWidth: SIMULATOR_WIDTH }}>
          <Markdown remarkPlugins={[remarkGfm]}>{project!.description}</Markdown>
        </div>
      </div>
    </div>
  );
}

export const handleProjectLoader = async ({ params }: any): Promise<number> => {
  const { projectId } = params;

  const project = await getProject(projectId);
  return project.id!;
};
