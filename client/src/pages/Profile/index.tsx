import { Link, useLoaderData } from "react-router-dom";
import BasicButton from "../../components/common/BasicButton";
import ProjectCard from "../../components/profile/ProjectCard";
import { LuCircuitBoard as NewProjectIcon } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { getProjects, getUser } from "../../services/userService";
import { Project } from "../../common/types";
import { useUser } from "../../hooks/useUser";

export default function Profile() {
  const { user: meUser } = useUser();
  const userId = useLoaderData() as number;
  const { isLoading: isUserLoading, data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
  });
  const { isLoading: isProjectsLoading, data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(userId),
  });

  if (isUserLoading || isProjectsLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex flex-col">
      <div className="mb-12">
        <img
          className="w-28 h-28 rounded-full border-4 border-zinc-800"
          alt="User avatar"
          src={`https://avatars.githubusercontent.com/u/${user!.githubId}?v=4`}
        />
        <h1 className="font-bold text-2xl">{user!.username}</h1>
      </div>
      <div>
        <div className="flex justify-between mb-4">
          <h1 className="font-bold text-2xl">Projects</h1>
          {meUser.id === userId && (
            <Link to="/newproject">
              <BasicButton name="New Project" icon={<NewProjectIcon size={20} />} />
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {projects &&
            projects.map((project: Project) => {
              return (
                <ProjectCard
                  key={project.id}
                  id={project.id!}
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

export const handleProfileLoader = async ({ params }: any): Promise<number> => {
  const { userId } = params;

  const user = await getUser(userId);
  return user.id;
};
