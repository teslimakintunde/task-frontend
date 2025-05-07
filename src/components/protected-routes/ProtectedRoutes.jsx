import { TaskManagerContext } from "@/context";
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { user } = useContext(TaskManagerContext);

  return <> {user && children}</>;
};

export default ProtectedRoutes;
