import BasicButton from "../../components/common/BasicButton";
import { LuCircuitBoard as NewProjectIcon } from "react-icons/lu";
import { LuLock as PrivateIcon } from "react-icons/lu";
import { MdOutlinePublic as PublicIcon } from "react-icons/md";

export default function NewProject() {
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
        />
      </div>
      <div>
        <p className="font-bold">Description</p>
        <p className="text-sm text-zinc-500">
          The description that will show when viewing the project. Supports markdown.
        </p>
        <textarea className="appearance-none focus:outline-none bg-transparent border-2 border-zinc-700 rounded-md py-1 px-2 w-full min-h-[75px]" />
      </div>
      <div className="flex flex-col space-y-2">
        <p className="font-bold">Visibility</p>
        <div className="flex space-x-4">
          <div className="flex space-x-2 items-center">
            <input
              className="appearance-none w-4 h-4 border-2 border-zinc-700 rounded-full checked:bg-violet-500"
              type="radio"
              name="visibility"
              id="public"
              checked
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
              id="private"
            />
            <label className="flex space-x-1 items-center font-medium" htmlFor="private">
              <PrivateIcon size={20} />
              <p>Private</p>
            </label>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <BasicButton name="Create project" icon={<NewProjectIcon size={20} />} />
      </div>
    </div>
  );
}
