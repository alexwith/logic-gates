import { useState, ChangeEvent } from "react";
import { Project, ProjectVisibilty } from "../../../common/types";
import TextInput from "../../common/TextInput";
import { LuLock as PrivateIcon } from "react-icons/lu";
import { MdOutlinePublic as PublicIcon } from "react-icons/md";

interface Props {
  onUpdate: (details: Project) => void;
}

export function DetailsForm({ onUpdate }: Props) {
  const [name, setName] = useState<string>("");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [visibility, setVisibility] = useState<ProjectVisibilty>(ProjectVisibilty.Public);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setName(value);
    notifyUpdate();
  };

  const handleShortDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setShortDescription(value);
    notifyUpdate();
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setDescription(value);
    notifyUpdate();
  };

  const handleVisibilityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setVisibility(value as ProjectVisibilty);
    notifyUpdate();
  };

  const notifyUpdate = () => {
    onUpdate({
      name,
      shortDescription,
      description,
      visibility,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="font-bold">Project name</p>
        <TextInput onChange={handleNameChange} />
      </div>
      <div>
        <p className="font-bold">Short Description</p>
        <p className="text-sm text-zinc-500">
          A shorter description that will show in the project preview.
        </p>
        <TextInput onChange={handleShortDescriptionChange} className="w-full" />
      </div>
      <div>
        <p className="font-bold">Description</p>
        <p className="text-sm text-zinc-500">
          The description that will show when viewing the project. Supports markdown.
        </p>
        <textarea
          className="appearance-none focus:outline-none bg-transparent border-2 border-zinc-700 rounded-md py-1 px-2 w-full min-h-[75px]"
          onChange={handleDescriptionChange}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <p className="font-bold">Visibility</p>
        <div className="flex space-x-4">
          <div className="flex space-x-2 items-center hover:cursor-pointer">
            <input
              className="appearance-none w-4 h-4 border-2 border-zinc-700 rounded-full checked:bg-violet-500"
              type="radio"
              name="visibility"
              value={ProjectVisibilty.Public}
              id="public"
              defaultChecked
              onChange={handleVisibilityChange}
            />
            <label className="flex space-x-1 items-center font-medium" htmlFor="public">
              <PublicIcon size={20} />
              <p>Public</p>
            </label>
          </div>
          <div className="flex space-x-2 items-center">
            <input
              className="appearance-none w-4 h-4 border-2 border-zinc-700 rounded-full checked:bg-violet-500"
              type="radio"
              name="visibility"
              value={ProjectVisibilty.Private}
              id="private"
              onChange={handleVisibilityChange}
            />
            <label className="flex space-x-1 items-center font-medium" htmlFor="private">
              <PrivateIcon size={20} />
              <p>Private</p>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
