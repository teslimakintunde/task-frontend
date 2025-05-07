import CommonButton from "@/components/common-button/CommonButton";
import AddNewTask from "@/components/tasks/add-new-task/AddNewTask";
import TaskItem from "@/components/tasks/task-item/TaskItem";
import { TaskManagerContext } from "@/context";
import React, { useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const TasksPage = () => {
  const [showDialog, setShowDialog] = useState(false);
  const {
    user,
    taskList,
    setTaskList,
    loading,
    getTasksByUserId,
    taskFormData,
    currentEditedId,
    setCurrentEditedId,
    addNewTaskApi,
    deleteTaskApi,
    updateTaskApi,
  } = useContext(TaskManagerContext);

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  // Memoize fetchTasks to prevent unnecessary re-renders
  const fetchTasks = useCallback(async () => {
    if (!user?._id) return; // Guard against missing user
    setIsFetching(true);

    setError("");
    const result = await getTasksByUserId(user._id);
    if (!result.success) {
      setError(result.message);
    }
    setIsFetching(false);
  }, [user?._id, getTasksByUserId]);

  useEffect(() => {
    if (!user) {
      navigate("/auth?mode=login");
      return;
    }

    if (!loading) {
      fetchTasks();
    }
  }, [user, loading, fetchTasks, navigate]); // Replace getTasksByUserId with fetchTasks

  const handleSubmit = async (data) => {
    setError("");
    console.log(data);
    const result =
      currentEditedId !== null
        ? await updateTaskApi(currentEditedId, { ...data, userId: user._id })
        : await addNewTaskApi({ ...data, userId: user._id });
    console.log(result);
    if (result.success) {
      toast.success(
        currentEditedId !== null
          ? "Task updated successfully"
          : "Task created successfully"
      );
      // Update the task list properly
      if (currentEditedId !== null) {
        // For updates
        setTaskList((prevTasks) =>
          prevTasks.map((task) =>
            task._id === currentEditedId ? result.task : task
          )
        );
      } else {
        // For new tasks
        setTaskList((prevTasks) => [...prevTasks, result.task]);
      }
      taskFormData.reset({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        userId: user._id,
      });
      // Fetch tasks after adding a new one
      setShowDialog(false);
      await fetchTasks();
    } else {
      setError(result.message);
    }
  };
  const handleDelete = async (taskId) => {
    if (!taskId) {
      toast.error("Invalid task ID");
      return;
    }

    setError("");
    try {
      const result = await deleteTaskApi(taskId);

      if (result.success) {
        // Update the task list by filtering out the deleted task
        setTaskList((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );

        toast.success("Task deleted successfully");
      } else {
        setError(result.message);
        toast.error(result.message || "Failed to delete task");
      }
    } catch (error) {
      setError("An error occurred while deleting the task");
      toast.error("An error occurred while deleting the task");
      console.error("Delete error:", error);
    }
  };

  return (
    <section className="max-w-7xl p-[15px] mx-auto">
      <div className="mt-10 max-w-max flex gap-3 sm:gap-5">
        <CommonButton
          onClick={() => setShowDialog(true)}
          buttonText={"Add New Task"}
        />
        <CommonButton
          onClick={() => navigate("/taskboard")}
          buttonText={"Tasks board"}
        />
      </div>
      <div>
        <p>{error}</p>
      </div>

      <div className="mt-5 flex flex-col">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-4">
          {isFetching ? (
            <p className="text-[16px]">Loading..</p>
          ) : taskList?.length > 0 ? (
            taskList.map((taskItem, index) => (
              <TaskItem
                key={index}
                setShowDialog={setShowDialog}
                handleDelete={handleDelete}
                item={taskItem}
                setCurrentEditedId={setCurrentEditedId}
                taskFormData={taskFormData}
              />
            ))
          ) : (
            <h1>No tasks added! Please add one</h1>
          )}
        </div>
      </div>
      <AddNewTask
        showDialog={showDialog}
        handleSubmit={handleSubmit}
        setShowDialog={setShowDialog}
        taskFormData={taskFormData}
        currentEditedId={currentEditedId}
        setCurrentEditedId={setCurrentEditedId}
      />
    </section>
  );
};

export default TasksPage;
