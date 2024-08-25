import Layout from "../components/layout/Layout";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import NewProject from "../pages/NewProject";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Home from "../pages/Home";
import { createBrowserRouter } from "react-router-dom";
import { getProject } from "../services/project/service";
import Project from "../pages/Project";
import ProjectEditor from "../pages/ProjectEditor";
import ProjectDetails from "../pages/ProjectDetails";
import { getUser } from "../services/user/service";
import Playground from "../pages/Playground";

const handleProjectLoader = async ({ params }: any): Promise<number> => {
  const { projectId } = params;

  const project = await getProject(projectId);
  return project.id!;
};

const handleProfileLoader = async ({ params }: any): Promise<number> => {
  const { userId } = params;

  const user = await getUser(userId);
  return user.id;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/playground",
        element: <Playground />,
      },
      {
        path: "/newproject",
        element: (
          <ProtectedRoute>
            <NewProject />
          </ProtectedRoute>
        ),
      },
      {
        path: "/editor/:projectId",
        element: (
          <ProtectedRoute>
            <ProjectEditor />
          </ProtectedRoute>
        ),
        loader: handleProjectLoader,
        errorElement: <NotFound />,
      },
      {
        path: "/details/:projectId",
        element: (
          <ProtectedRoute>
            <ProjectDetails />
          </ProtectedRoute>
        ),
        loader: handleProjectLoader,
        errorElement: <NotFound />,
      },
      {
        path: "/project/:projectId",
        element: <Project />,
        loader: handleProjectLoader,
        errorElement: <NotFound />,
      },
      {
        path: "/user/:userId",
        element: <Profile />,
        loader: handleProfileLoader,
        errorElement: <NotFound />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
