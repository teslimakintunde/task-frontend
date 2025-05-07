import React from "react";
import { Route, Routes } from "react-router-dom";
import TaskBoard from "./pages/task-board/TaskBoard";
import CommonLayout from "./components/common-layout/CommonLayout";
import AuthPage from "./pages/auth-page/AuthPage";
import TasksPage from "./pages/tasks-page/TasksPage";
import ProtectedRoutes from "./components/protected-routes/ProtectedRoutes";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import RootLayout from "./components/root-layout/RootLayout";

const App = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          element={
            <ProtectedRoutes>
              <CommonLayout />
            </ProtectedRoutes>
          }
        >
          <Route path="/taskboard" element={<TaskBoard />} />
          <Route path="/tasks" element={<TasksPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
