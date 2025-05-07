import CommonCard from "@/components/common-card/CommonCard";
import { scrumBoardOptions } from "@/components/config";
import { Button } from "@/components/ui/button";
import { TaskManagerContext } from "@/context";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TaskBoard = () => {
  const navigate = useNavigate();
  const {
    user,
    taskList,
    setTaskList,
    getTasksByUserId,
    updateTaskApi,
    isAuthLoading,
  } = useContext(TaskManagerContext);

  const [isLoading, setIsLoading] = useState(false);

  async function fetchListOfTasks() {
    if (!user?._id) return;
    setIsLoading(true);
    const response = await getTasksByUserId(user._id);
    if (response?.success) {
      setTaskList(Array.isArray(response.tasks) ? response.tasks : []);
    }
    setIsLoading(false);
  }

  function onDragStart(event, taskId) {
    event.dataTransfer.setData("id", taskId);
  }

  async function updateTaskByStatus(taskId, status) {
    const task = taskList.find((item) => item._id.toString() === taskId);
    if (!task) {
      console.error("Task not found:", taskId);
      return;
    }

    // Optimistically update the taskList state
    const updatedTask = { ...task, status };
    setTaskList((prev) =>
      prev.map((item) => (item._id.toString() === taskId ? updatedTask : item))
    );

    const updatedTaskData = {
      title: task.title,
      description: task.description || "",
      status,
      priority: task.priority,
      userId: user._id,
    };

    try {
      const response = await updateTaskApi(taskId, updatedTaskData);
      if (response.success && response.task) {
        // Update taskList with the server response to ensure consistency
        setTaskList((prev) =>
          prev.map((item) =>
            item._id.toString() === taskId ? response.task : item
          )
        );
      } else {
        // Revert optimistic update on failure
        setTaskList((prev) =>
          prev.map((item) => (item._id.toString() === taskId ? task : item))
        );
        console.error("Failed to update task:", response.message);
      }
    } catch (error) {
      // Revert optimistic update on error
      setTaskList((prev) =>
        prev.map((item) => (item._id.toString() === taskId ? task : item))
      );
      console.error("Update task error:", error);
    }
  }

  function onDrop(event, newStatus) {
    const draggedTaskId = event.dataTransfer.getData("id");
    if (draggedTaskId) {
      updateTaskByStatus(draggedTaskId, newStatus);
    }
  }

  function renderTaskByTaskStatus() {
    const taskStatuses = {
      todo: [],
      inProgress: [],
      blocked: [],
      review: [],
      done: [],
    };

    const tasks = Array.isArray(taskList) ? taskList : [];
    tasks.forEach((taskItem) => {
      if (!taskItem || !taskItem._id || !taskItem.status) {
        console.warn("Invalid task item:", taskItem);
        return;
      }
      const status = Object.prototype.hasOwnProperty.call(
        taskStatuses,
        taskItem.status
      )
        ? taskItem.status
        : "todo";
      const statusOption = scrumBoardOptions.find(
        (boardOption) => boardOption.id === taskItem.status
      );
      const statusLabel = statusOption?.label || "Unknown Status";

      taskStatuses[status].push(
        <div
          key={taskItem._id}
          onDragStart={
            taskItem.status !== "done"
              ? (event) => onDragStart(event, taskItem._id)
              : null
          }
          className="mb-2"
          draggable={taskItem.status !== "done"}
        >
          <CommonCard
            extraTextStyles={taskItem.status === "done" ? "line-through" : ""}
            title={taskItem.title || "Untitled"}
            description={statusLabel}
          />
        </div>
      );
    });

    return taskStatuses;
  }

  useEffect(() => {
    if (isAuthLoading) return;
    if (user) {
      fetchListOfTasks();
    } else {
      navigate("/auth?mode=login");
    }
  }, [user, isAuthLoading, navigate]);

  const handleAddTask = () => {
    if (!user) {
      navigate("/auth?mode=login");
    } else {
      navigate("/tasks");
    }
  };

  const handleRefreshTasks = () => {
    if (user) {
      fetchListOfTasks();
    } else {
      navigate("/auth?mode=login");
    }
  };

  return (
    <Fragment>
      <div className="max-w-7xl  mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="space-x-4">
            <Button
              className="bg-blue-500"
              onClick={handleAddTask}
              variant="default"
            >
              Add Task
            </Button>
            <Button onClick={handleRefreshTasks} variant="outline">
              Refresh Tasks
            </Button>
          </div>
        </div>
        {!isLoading && !isAuthLoading && taskList.length === 0 ? (
          <p className="text-center text-gray-500">
            No tasks available. Add a task to get started!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 h-full">
            {scrumBoardOptions.map((item) => (
              <div
                className="border border-blue-500 rounded overflow-auto"
                key={item.id}
                onDrop={(event) => onDrop(event, item.id)}
                onDragOver={(event) => event.preventDefault()}
              >
                <div className="px-1 py-3 text-center bg-blue-500 border-none mb-3">
                  <h3 className="text-2xl font-extrabold text-white">
                    {item.label}
                  </h3>
                </div>
                <div className="p-3">
                  {renderTaskByTaskStatus()[item.id] || (
                    <p className="text-gray-500">No tasks</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default TaskBoard;
