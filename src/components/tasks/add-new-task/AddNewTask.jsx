import CommonDialog from "@/components/common-dialog/CommonDialog";
import { addNewTaskFormControls } from "@/components/config";
import React from "react";

const AddNewTask = ({
  showDialog,
  setShowDialog,
  currentEditedId,
  taskFormData,
  handleSubmit,
  setCurrentEditedId,
}) => {
  return (
    <CommonDialog
      formControls={addNewTaskFormControls}
      showDialog={showDialog}
      onOpenChange={() => {
        setShowDialog(false);
        currentEditedId ? taskFormData.reset() : null;
        setCurrentEditedId(null);
      }}
      title={currentEditedId ? "Edit Task" : "Post New Task"}
      btnText={"Add"}
      handleSubmit={handleSubmit}
      formData={taskFormData}
    />
  );
};

export default AddNewTask;
