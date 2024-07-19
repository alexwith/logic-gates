import { useState } from "react";
import { FaHeart as FilledLikeIcon, FaRegHeart as EmptyLikeIcon } from "react-icons/fa";

interface Props {
  name: string;
  description: string;
}
export default function ProjectCard({ name, description }: Props) {
  const [liked, setLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(0);

  const handleLikeToggle = () => {
    setLikes(likes + (liked ? -1 : 1));
    setLiked(!liked);
  };

  return (
    <div className="flex-col space-y-2 border-zinc-700 border-4 rounded-lg w-96 px-4 pt-2 pb-4">
      <div className="flex justify-between">
        <h1 className="font-bold text-xl hover:text-violet-500 hover:cursor-pointer">{name}</h1>
        <div className="flex space-x-1 items-center">
          <div className="hover:cursor-pointer" onClick={handleLikeToggle}>
            {liked ? (
              <FilledLikeIcon size={20} className="text-violet-500" />
            ) : (
              <EmptyLikeIcon size={20} className="text-zinc-500" />
            )}
          </div>
          <p className="font-semibold text-lg">{likes}</p>
        </div>
      </div>
      <p className="text-zinc-400 line-clamp-2 h-12">{description}</p>
    </div>
  );
}
