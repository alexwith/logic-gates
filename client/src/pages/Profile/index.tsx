import { useLoaderData, useNavigate } from "react-router-dom";
import BasicButton from "../../components/common/BasicButton";
import ProjectCard from "../../components/profile/ProjectCard";
import { LuCircuitBoard as NewProjectIcon } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const routerNavigate = useNavigate();
  const userId: string = useLoaderData() as string;
  const { isLoading: isUserLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch(`/api/v1/user/${userId}`).then((response) => response.json()),
  });
  const { isLoading: isProjectsLoading, data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: () =>
      fetch("/api/v1/project/get", {
        credentials: "include",
      }).then((response) => response.json()),
  });

  if (isUserLoading || isProjectsLoading) {
    return <h1>Loading...</h1>;
  }

  const handleNewProjectClick = () => {
    routerNavigate("/newproject");
  };

  return (
    <div className="flex flex-col">
      <div className="mb-12">
        <img
          className="w-28 h-28 rounded-full border-4 border-zinc-800"
          alt="User avatar"
          src={`https://avatars.githubusercontent.com/u/${user.githubId}?v=4`}
        />
        <h1 className="font-bold text-2xl">{user.username}</h1>
      </div>
      <div>
        <div className="flex justify-between mb-4">
          <h1 className="font-bold text-2xl">Projects</h1>
          <BasicButton
            name="New Project"
            icon={<NewProjectIcon size={20} />}
            onClick={handleNewProjectClick}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {projects &&
            projects.map((project: any) => {
              return (
                <ProjectCard
                  key={project.id}
                  name={project.name}
                  description={project.shortDescription}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

export const handleProfileLoader = async ({ params }: any): Promise<string> => {
  const { userId } = params;

  const response = await fetch(`/api/v1/user/${userId}`);
  if (response.status === 404) {
    throw new Response("", { status: 404 });
  }

  return userId;
};
