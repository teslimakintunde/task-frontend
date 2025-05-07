import { TaskManagerContext } from "@/context";
import TasksPage from "@/pages/tasks-page/TasksPage";
import React, { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../header/Header";

const CommonLayout = () => {
  // const { user, logout } = useContext(TaskManagerContext);
  // const navigate = useNavigate();
  return (
    <div>
      {/* <nav className="bg-blue-600 text-white p-4 flex justify-between">
        <div>
          <h1 className="text-lg font-bold">Task Manager</h1>
        </div>
        {user ? (
          <div className="flex items-center gap-4">
            <span>Welcome, {user.name}</span>
            <button
              onClick={() => logout()}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/auth?mode=login")}
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
            >
              Login
            </button>
          </div>
        )}
      </nav> */}
      <Header />
      <Outlet />
    </div>
  );
};

export default CommonLayout;
