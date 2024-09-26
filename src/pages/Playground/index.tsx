import Editor from "../../components/editor/Editor";

export default function Playground() {
  return (
    <div className="flex flex-col items-center mt-5">
      <h1 className="text-4xl font-bold">Logic Gates</h1>
      <div className="mt-5 mx-4">
        <Editor />
      </div>
    </div>
  );
}
