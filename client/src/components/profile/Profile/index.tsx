import BasicButton from "../../common/BasicButton";
import ProjectCard from "../ProjectCard";
import { LuCircuitBoard as NewProjectIcon } from "react-icons/lu";

export default function Profile() {
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
