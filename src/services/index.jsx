import axios from "axios";

export const registerUserApi = async (formData) => {
  const response = await axios.post(
    `${import.meta.env.VITE_REACT_BACKEND_BASEURL}/api/user/register`,
    formData
  );
  return response?.data;
};

export const addNewTaskApi = async (formData) => {
  const response = await axios.post(
    `${import.meta.env.VITE_REACT_BACKEND_BASEURL}/api/task/add`,
    formData
  );
  return response?.data;
};

export const getAllTasksApi = async (getCurrentUserId) => {
  const response = await axios.post(
    `${
      import.meta.env.VITE_REACT_BACKEND_BASEURL
    }/api/task/userId/${getCurrentUserId}`
  );
  return response?.data;
};

export const updateTaskApi = async (formData) => {
  const response = await axios.post(
    `${import.meta.env}/api/task/update`,
    formData
  );
  return response?.data;
};

export const deleteTaskAPi = async (getCurrentTaskId) => {
  const response = await axios.post(
    `${
      import.meta.env.VITE_REACT_BACKEND_BASEURL
    }/api/task/delete/${getCurrentTaskId}`
  );
  return response?.data;
};
