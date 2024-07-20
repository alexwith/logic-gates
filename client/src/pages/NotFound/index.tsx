export default function NotFound() {
  return (
    <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center">
      <span className="font-medium text-violet-500 text-lg">404</span>
      <h1 className="font-bold text-5xl">Page not found</h1>
      <p className="mt-5 text-zinc-400">We couldn't find the page you were looking for.</p>
    </div>
  );
}
