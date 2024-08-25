import Editor from "../../components/editor/Editor";

export default function Playground() {
  return (
    <div className="flex flex-col items-center mt-5">
      <h1 className="text-4xl font-bold text-violet-500">Playground</h1>
      <p className="text-lg max-w-2xl text-center">
        Build and simulate circuits, no login required. To save your work, simply export or import
        them as files. Log in for the full experience.
      </p>
      <div className="mt-5 mx-4">
        <Editor />
      </div>
    </div>
  );
}
