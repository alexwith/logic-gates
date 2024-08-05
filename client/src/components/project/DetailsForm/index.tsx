import { useState, ChangeEvent, useEffect } from "react";
import { Project, ProjectVisibilty } from "../../../common/types";
import TextInput from "../../common/TextInput";
import { LuLock as PrivateIcon } from "react-icons/lu";
import { MdOutlinePublic as PublicIcon } from "react-icons/md";

interface Props {
  defaults?: Project;
  onUpdate: (details: Project) => void;
}

export default function DetailsForm({ defaults, onUpdate }: Props) {
  const initValues: Project = {
    name: defaults?.name || "",
    shortDescription: defaults?.shortDescription || "",
    description: defaults?.description || "",
    visibility: defaults?.visibility || ProjectVisibilty.Public,
  };

  const [name, setName] = useState<string>(initValues.name);
  const [shortDescription, setShortDescription] = useState<string>(initValues.shortDescription);
  const [description, setDescription] = useState<string>(initValues.description);
  const [visibility, setVisibility] = useState<ProjectVisibilty>(initValues.visibility);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setName(value);
  };

  const handleShortDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setShortDescription(value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setDescription(value);
  };

  const handleVisibilityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setVisibility(value as ProjectVisibilty);
  };

  useEffect(() => {
    onUpdate({
      name,
      shortDescription,
      description,
      visibility,
    });
  }, [onUpdate, name, shortDescription, description, visibility]);

  return (
    <div className="space-y-4">
      <div>
        <p className="font-bold">Project name</p>
        <TextInput value={name} onChange={handleNameChange} />
      </div>
      <div>
        <p className="font-bold">Short Description</p>
        <p className="text-sm text-zinc-500">
          A shorter description that will show in the project preview.
        </p>
        <TextInput
          value={shortDescription}
          onChange={handleShortDescriptionChange}
          className="w-full"
        />
      </div>
      <div>
        <p className="font-bold">Description</p>
        <p className="text-sm text-zinc-500">
          The description that will show when viewing the project. Supports markdown.
        </p>
        <textarea
          className="appearance-none focus:outline-none bg-transparent border-2 border-zinc-700 rounded-md py-1 px-2 w-full min-h-[75px]"
          value={description}
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
              checked={visibility === ProjectVisibilty.Public}
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
              checked={visibility === ProjectVisibilty.Private}
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
