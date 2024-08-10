import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import reportWebVitals from "./reportWebVitals";
import { UserProvider } from "./hooks/useUser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/common/Layout";
import Profile, { handleProfileLoader } from "./pages/Profile";
import NotFound from "./pages/NotFound";
import NewProject from "./pages/NewProject";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import Project, { handleProjectLoader } from "./pages/Project";
import EditProjectDetails from "./pages/EditProjectDetails";
import NewEditor from "./pages/Editor";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/editor",
        element: <NewEditor />,
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
        path: "/projectdetails/:projectId",
        element: (
          <ProtectedRoute>
            <EditProjectDetails />
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

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{ backgroundColor: "#181818" }}
        />
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

reportWebVitals();
