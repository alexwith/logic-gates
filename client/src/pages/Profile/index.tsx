import { useLoaderData } from "react-router-dom";
import BasicButton from "../../components/common/BasicButton";
import ProjectCard from "../../components/profile/ProjectCard";
import { LuCircuitBoard as NewProjectIcon } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const userId: string = useLoaderData() as string;
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      fetch(`http://localhost:8080/api/v1/user/${userId}`).then((response) => response.json()),
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="">
      <div className="flex justify-between mb-4">
        <h1 className="font-bold text-2xl">Projects</h1>
        <BasicButton name="New Project" icon={<NewProjectIcon size={20} />} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ProjectCard
          name="SR Latch"
          description="Here is a very short description about this project. And it continues so we can see the end of the potato."
        />
        <ProjectCard
          name="SR Latch"
          description="Here is a very short description about this project. And it continues so we can see the end of the potato."
        />
        <ProjectCard
          name="SR Latch"
          description="Here is a very short description about this project. And it continues so we can see the end of the potato."
        />
        <ProjectCard
          name="SR Latch"
          description="Here is a very short description about this project. And it continues so we can see the end of the potato."
        />
        <ProjectCard
          name="SR Latch"
          description="Here is a very short description about this project. And it continues so we can see the end of the potato."
        />
        <ProjectCard
          name="SR Latch"
          description="Here is a very short description about this project. And it continues so we can see the end of the potato."
        />
      </div>
    </div>
  );
}

export const handleProfileLoader = ({ params }: any): string => {
  const { userId } = params;
  if (false) {
    throw new Response("", { status: 404 });
  }

  return userId;
};
