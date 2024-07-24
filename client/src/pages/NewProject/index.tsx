import { ChangeEvent, useState } from "react";
import BasicButton from "../../components/common/BasicButton";
import { LuCircuitBoard as NewProjectIcon } from "react-icons/lu";
import { LuLock as PrivateIcon } from "react-icons/lu";
import { MdOutlinePublic as PublicIcon } from "react-icons/md";
import { toast } from "react-toastify";

export default function NewProject() {
  const [name, setName] = useState<string>("");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("PUBLIC");

  const handleCreateClick = () => {
    if (!/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/.test(name) || name.length > 50) {
      toast.error(
        "The name can only contain letters, numbers and single spaces and be a maximum 50 characters."
      );
      return;
    }

    fetch("http://localhost:8080/api/v1/project/create", {
      method: "post",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        shortDescription,
        description,
        visibility,
      }),
    });
    console.log(name);
  };

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
    setVisibility(value);
  };

  return (
    <div className="flex flex-col space-y-4 w-1/3 mt-12">
      <div>
        <h1 className="font-bold text-2xl">Create a new project</h1>
        <p className="text-zinc-500">
          A project is a place to manage and create circuits with a goal in mind.
        </p>
      </div>
      <div>
        <p className="font-bold">Project name</p>
        <input
          className="appearance-none focus:outline-none bg-transparent border-2 border-zinc-700 rounded-md py-1 px-2"
          type="text"
          onChange={handleNameChange}
        />
      </div>
      <div>
        <p className="font-bold">Short Description</p>
        <p className="text-sm text-zinc-500">
          A shorter description that will show in the project preview.
        </p>
        <input
          className="appearance-none focus:outline-none bg-transparent border-2 border-zinc-700 rounded-md py-1 px-2 w-full"
          type="text"
          onChange={handleShortDescriptionChange}
        />
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
              value="PUBLIC"
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
              value="PRIVATE"
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
      <div className="flex justify-end">
        <BasicButton
          name="Create project"
          icon={<NewProjectIcon size={20} />}
          onClick={handleCreateClick}
        />
      </div>
    </div>
  );
}
