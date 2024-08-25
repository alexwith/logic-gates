import { useQuery } from "@tanstack/react-query";
import ProjectCard from "../ProjectCard";
import { Project } from "../../../common/types";
import { getDiscovery } from "../../../services/project/service";

export default function Discovery() {
  const { isLoading: isProjectsLoading, data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getDiscovery(),
  });

  if (isProjectsLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1 className="font-bold text-2xl mb-2">Discover</h1>
      <div className="grid grid-cols-2 gap-4">
        {projects!.map((project: Project) => {
          return <ProjectCard key={project.id} project={project} showLikes />;
        })}
      </div>
    </div>
  );
}
