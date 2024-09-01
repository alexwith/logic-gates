import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { deleteProject, getLikes, getProject, toggleLike } from "../../services/project/service";
import { useQuery } from "@tanstack/react-query";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../css/markdown.css";
import { SIMULATOR_WIDTH } from "../../common/constants";
import Simulator from "../../components/simulator/Simulator";
import BasicButton from "../../components/common/BasicButton";
import { useState, useEffect } from "react";
import TruthTableButton from "../../components/common/TruthTableButton";
import { useUser } from "../../hooks/useUser";
import {
  CircuitIcon,
  EditIcon,
  EmptyLikeIcon,
  FilledLikeIcon,
  MenuIcon,
  TrashIcon,
} from "../../common/icons";

export default function Project() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUser();
  const projectId = useLoaderData() as number;
  const { isLoading, data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
  });

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number[]>([]);

  useEffect(() => {
    if (!project) {
      return;
    }

    getLikes(project.id!).then((users) => {
      setLikes(users);
    });
  }, [project]);

  useEffect(() => {
    setLiked(isLoggedIn && likes.includes(user.id));
  }, [isLoggedIn, user, likes]);

  if (isLoading || !project) {
    return null;
  }

  const isUserCreator = isLoggedIn && user.id === project.creatorId;

  const handleDeleteClick = async () => {
    await deleteProject(project.id!);
    navigate(`/user/${user.id}`);
  };

  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      return;
    }

    setLiked(!liked);

    if (likes.includes(user!.id)) {
      setLikes(likes.filter((userId) => userId !== user.id));
    } else {
      setLikes([...likes, user!.id]);
    }

    const success = await toggleLike(project!.id!);
    if (!success) {
      setLiked(liked);
      setLikes(likes);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-2 justify-between mb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-2xl">{project!.name}</h1>
          <p className="text-zinc-300 max-w-lg">{project!.shortDescription}</p>
        </div>
        <div className="flex space-x-2 mt-auto">
          <div
            className={
              "group flex space-x-1 items-center px-2 py-1 rounded-md font-bold bg-zinc-700 hover:cursor-pointer"
            }
            onClick={handleLikeClick}
          >
            {liked ? (
              <FilledLikeIcon size={20} className="text-violet-500" />
            ) : (
              <EmptyLikeIcon size={20} className="text-zinc-400" />
            )}
            <p className="group-hover:hidden">{likes.length}</p>
            <p className="hidden group-hover:block">Like</p>
          </div>
          {isUserCreator && (
            <div onMouseEnter={() => setShowMenu(true)} onMouseLeave={() => setShowMenu(false)}>
              <BasicButton name="Menu" icon={<MenuIcon size={20} />} />
              <div
                className={`absolute flex flex-col space-y-1 bg-zinc-800 p-2 w-44 rounded-md z-10 ${
                  showMenu ? "" : "hidden"
                }`}
              >
                <>
                  <Link to={`/details/${project!.id}`}>
                    <BasicButton name="Edit details" icon={<EditIcon size={20} />} hoverable />
                  </Link>
                  <Link to={`/editor/${project!.id}`}>
                    <BasicButton name="Edit circuit" icon={<CircuitIcon size={20} />} hoverable />
                  </Link>
                  <BasicButton
                    name="Delete"
                    icon={<TrashIcon size={20} />}
                    hoverable
                    onClick={handleDeleteClick}
                  />
                </>
              </div>
            </div>
          )}
          <TruthTableButton />
        </div>
      </div>
      <Simulator project={project!} />
      <div className="border-4 border-zinc-800 rounded-lg my-4 sm:mx-0">
        <div className="leading-tight border-b-4 text-xl font-bold mb-4 p-2 border-zinc-800">
          <h1 className="ml-2">Description</h1>
        </div>
        <div className="prose prose-invert markdown px-4" style={{ maxWidth: SIMULATOR_WIDTH }}>
          {project!.description ? (
            <Markdown remarkPlugins={[remarkGfm]}>{project!.description}</Markdown>
          ) : (
            <p className="mb-4 text-zinc-500">This project does not have a description.</p>
          )}
        </div>
      </div>
    </div>
  );
}
