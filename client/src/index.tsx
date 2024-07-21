import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserProvider } from "./hooks/useUser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/common/Layout";
import Editor from "./pages/Editor";
import Profile, { handleProfileLoader } from "./pages/Profile";
import NotFound from "./pages/NotFound";
import NewProject from "./pages/NewProject";
import ProtectedRoute from "./components/common/ProtectedRoute";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/editor",
    element: <Editor />,
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
    path: "/user/:userId",
    element: <Profile />,
    loader: handleProfileLoader,
    errorElement: <NotFound />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Layout>
          <RouterProvider router={router} />
        </Layout>
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

reportWebVitals();
