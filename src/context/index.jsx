import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const TaskManagerContext = createContext(null);

const TaskManagerProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // New loading state
  const navigate = useNavigate();

  const taskFormData = useForm({
    defaultValues: {
      title: "",
      description: "",
      status: "",
      priority: "",
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      setIsAuthLoading(true); // Start auth loading
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/refresh`,
          { withCredentials: true }
        );
        console.log("Refresh token response:", response.data);
        setAccessToken(response.data.accessToken);
        setUser({ name: response.data.name, _id: response.data.userId });
        taskFormData.setValue("userId", response.data.userId); // Set userId in form
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Refresh token error:", error.message);
        }
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
        setIsAuthLoading(false); // End auth loading
      }
    };
    checkAuth();
  }, [taskFormData]);

  const register = async (formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/register`,
        formData
      );
      if (response.data.success) {
        toast.success(response.data.message, { position: "top-right" });
      }
      return response.data;
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };
  // Login user
  const login = async (formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        formData,
        { withCredentials: true }
      );
      if (response.data.success) {
        setAccessToken(response.data.accessToken);
        setUser({ name: response.data.name, _id: response.data.userId });

        taskFormData.setValue("userId", response.data.userId); // Set userId in form
      }
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      setAccessToken(null);
      taskFormData.reset();
      navigate("/auth?mode=login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getTasksByUserId = useCallback(
    async (userId) => {
      if (!userId) {
        console.error("No userId provided for fetching tasks");
        return { success: false, message: "User ID is required" };
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/task/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.data.success) {
          // Ensure tasks is an array
          const tasks = Array.isArray(response.data.tasks)
            ? response.data.tasks
            : [];
          setTaskList(tasks);
          return response.data;
        }
        return { success: false, message: "Failed to fetch tasks" };
      } catch (error) {
        console.error(
          "Get tasks error:",
          error.response?.data || error.message
        );
        if (error.response?.status === 401 || error.response?.status === 403) {
          try {
            const refreshResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/user/refresh`,
              { withCredentials: true }
            );
            if (refreshResponse.data.success) {
              setAccessToken(refreshResponse.data.accessToken);
              setUser({
                name: refreshResponse.data.name,
                _id: refreshResponse.data.userId,
              });
              taskFormData.setValue("userId", refreshResponse.data.userId);
              const retryResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/task/${userId}`,
                {
                  headers: {
                    Authorization: `Bearer ${refreshResponse.data.accessToken}`,
                  },
                }
              );
              if (retryResponse.data.success) {
                setTaskList(retryResponse.data.tasks);
                return retryResponse.data;
              }
            }
          } catch (refreshError) {
            console.error("Refresh token error:", refreshError);
            setUser(null);
            setAccessToken(null);
            navigate("/auth?mode=login");
            return {
              success: false,
              message: "Session expired, please log in",
            };
          }
        }
        return {
          success: false,
          message: error.response?.data?.message || "Failed to fetch tasks",
        };
      }
    },
    [accessToken, taskFormData, navigate]
  );

  const addNewTaskApi = useCallback(
    async (taskData) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/task`,
          taskData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.data.success) {
          // Update taskList locally to avoid fetching
          const newTask = response.data.task; // Assuming response.data.task is the new task
          if (newTask) {
            setTaskList((prev) => [...prev, newTask]);
          }
          return response.data;
        }
        return { success: false, message: "Failed to add task" };
      } catch (error) {
        console.error("Add task error:", error.response?.data || error.message);
        if (error.response?.status === 401 || error.response?.status === 403) {
          try {
            const refreshResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/user/refresh`,
              { withCredentials: true }
            );
            if (refreshResponse.data.success) {
              setAccessToken(refreshResponse.data.accessToken);
              setUser({
                name: refreshResponse.data.name,
                _id: refreshResponse.data.userId,
              });
              taskFormData.setValue("userId", refreshResponse.data.userId);
              const retryResponse = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/task`,
                taskData,
                {
                  headers: {
                    Authorization: `Bearer ${refreshResponse.data.accessToken}`,
                  },
                }
              );
              if (retryResponse.data.success) {
                return retryResponse.data;
              }
            }
          } catch (refreshError) {
            console.error("Refresh token error:", refreshError);
            setUser(null);
            setAccessToken(null);
            navigate("/auth?mode=login");
            return {
              success: false,
              message: "Session expired, please log in",
            };
          }
        }
        return {
          success: false,
          message: error.response?.data?.message || "Failed to add task",
        };
      }
    },
    [accessToken, taskFormData, navigate]
  );

  const deleteTaskApi = useCallback(
    async (taskId) => {
      if (!taskId) {
        console.error("No taskId provided for deletion");
        return { success: false, message: "Task ID is required" };
      }
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/task/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("Delete task response:", response.data);
        if (response.data.success) {
          // Remove the task from taskList
          setTaskList((prev) => prev.filter((task) => task._id !== taskId));
          return response.data;
        }
        return { success: false, message: "Failed to delete task" };
      } catch (error) {
        console.error(
          "Delete task error:",
          error.response?.data || error.message
        );
        if (error.response?.status === 401 || error.response?.status === 403) {
          try {
            const refreshResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/user/refresh`,
              { withCredentials: true }
            );
            if (refreshResponse.data.success) {
              setAccessToken(refreshResponse.data.accessToken);
              setUser({
                name: refreshResponse.data.name,
                _id: refreshResponse.data.userId,
              });
              taskFormData.setValue("userId", refreshResponse.data.userId);
              const retryResponse = await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/task/${taskId}`,
                {
                  headers: {
                    Authorization: `Bearer ${refreshResponse.data.accessToken}`,
                  },
                }
              );
              console.log("Retry delete task response:", retryResponse.data);
              if (retryResponse.data.success) {
                setTaskList((prev) =>
                  prev.filter((task) => task._id !== taskId)
                );
                return retryResponse.data;
              }
            }
          } catch (refreshError) {
            console.error("Refresh token error:", refreshError);
            setUser(null);
            setAccessToken(null);
            navigate("/auth?mode=login");
            return {
              success: false,
              message: "Session expired, please log in",
            };
          }
        }
        return {
          success: false,
          message: error.response?.data?.message || "Failed to delete task",
        };
      }
    },
    [accessToken, taskFormData, navigate]
  );
  const updateTaskApi = useCallback(
    async (taskId, taskData) => {
      if (!taskId) {
        console.error("No taskId provided for update");
        return { success: false, message: "Task ID is required" };
      }
      console.log("Task data sent to update API:", { taskId, ...taskData });
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/task/${taskId}`,
          taskData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("Update task response:", response.data);
        if (response.data.success) {
          const updatedTask = response.data.task;
          if (
            updatedTask &&
            typeof updatedTask === "object" &&
            updatedTask._id &&
            typeof updatedTask.title === "string" &&
            typeof updatedTask.status === "string" &&
            typeof updatedTask.priority === "string"
          ) {
            setTaskList((prev) =>
              prev.map((task) =>
                task._id === updatedTask._id ? updatedTask : task
              )
            );
          } else {
            console.error("Invalid updated task object:", updatedTask);
            await getTasksByUserId(taskData.userId);
          }
          return response.data;
        }
        return { success: false, message: "Failed to update task" };
      } catch (error) {
        console.error(
          "Update task error:",
          error.response?.data || error.message
        );
        if (error.response?.status === 401 || error.response?.status === 403) {
          try {
            const refreshResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/user/refresh`,
              { withCredentials: true }
            );
            if (refreshResponse.data.success) {
              setAccessToken(refreshResponse.data.accessToken);
              setUser({
                name: refreshResponse.data.name,
                _id: refreshResponse.data.userId,
              });
              taskFormData.setValue("userId", refreshResponse.data.userId);
              const retryResponse = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/task/${taskId}`,
                taskData,
                {
                  headers: {
                    Authorization: `Bearer ${refreshResponse.data.accessToken}`,
                  },
                }
              );
              console.log("Retry update task response:", retryResponse.data);
              if (retryResponse.data.success) {
                const updatedTask = retryResponse.data.task;
                if (
                  updatedTask &&
                  typeof updatedTask === "object" &&
                  updatedTask._id &&
                  typeof updatedTask.title === "string" &&
                  typeof updatedTask.status === "string" &&
                  typeof updatedTask.priority === "string"
                ) {
                  setTaskList((prev) =>
                    prev.map((task) =>
                      task._id === updatedTask._id ? updatedTask : task
                    )
                  );
                } else {
                  console.error(
                    "Invalid retry updated task object:",
                    updatedTask
                  );
                  await getTasksByUserId(taskData.userId);
                }
                return retryResponse.data;
              }
            }
          } catch (refreshError) {
            console.error("Refresh token error:", refreshError);
            setUser(null);
            setAccessToken(null);
            navigate("/auth?mode=login");
            return {
              success: false,
              message: "Session expired, please log in",
            };
          }
        }
        return {
          success: false,
          message: error.response?.data?.message || "Failed to update task",
        };
      }
    },
    [accessToken, taskFormData, navigate, getTasksByUserId]
  );

  return (
    <TaskManagerContext.Provider
      value={{
        user,
        setUser,
        taskList,
        setTaskList,
        loading,
        setLoading,
        currentEditedId,
        setCurrentEditedId,
        taskFormData,
        register,
        login,
        logout,
        accessToken,
        getTasksByUserId,
        addNewTaskApi,
        deleteTaskApi,
        updateTaskApi,
        isAuthLoading,
      }}
    >
      {children}
    </TaskManagerContext.Provider>
  );
};

export default TaskManagerProvider;
