import { useEffect, useState } from "react";
import { FaHeart as FilledLikeIcon, FaRegHeart as EmptyLikeIcon } from "react-icons/fa";
import { useUser } from "../../../hooks/useUser";
import { getLikes, toggleLike } from "../../../services/projectService";

interface Props {
  id: number;
  name: string;
  description: string;
}
export default function ProjectCard({ id, name, description }: Props) {
  const { user, isLoggedIn } = useUser();

  const [liked, setLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number[]>([]);

  useEffect(() => {
    getLikes(id).then((users) => {
      setLikes(users);
    });
  }, [id]);

  useEffect(() => {
    setLiked(isLoggedIn && likes.includes(user.id));
  }, [likes, isLoggedIn, user.id]);

  const handleLikeClick = async () => {
    setLiked(!liked);

    if (likes.includes(user!.id)) {
      setLikes(likes.filter((userId) => userId !== user.id));
    } else {
      setLikes([...likes, user!.id]);
    }

    const success = await toggleLike(id);
    if (!success) {
      setLiked(liked);
      setLikes(likes);
    }
  };

  return (
    <div className="flex-col space-y-2 border-zinc-700 border-4 rounded-lg w-96 px-4 pt-2 pb-4">
      <div className="flex justify-between">
        <h1 className="font-bold text-xl hover:text-violet-500 hover:cursor-pointer">{name}</h1>
        <div className="flex space-x-1 items-center">
          <div className="hover:cursor-pointer" onClick={handleLikeClick}>
            {liked ? (
              <FilledLikeIcon size={20} className="text-violet-500" />
            ) : (
              <EmptyLikeIcon size={20} className="text-zinc-500" />
            )}
          </div>
          <p className="font-semibold text-lg">{likes.length}</p>
        </div>
      </div>
      <p className="text-zinc-400 line-clamp-2 h-12">{description}</p>
    </div>
  );
}
