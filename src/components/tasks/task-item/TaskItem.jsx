import CommonButton from "@/components/common-button/CommonButton";
import CommonCard from "@/components/common-card/CommonCard";
import { scrumBoardOptions } from "@/components/config";
import React from "react";

const TaskItem = ({
  item,
  setShowDialog,
  taskFormData,
  handleDelete,
  setCurrentEditedId,
}) => {
  return (
    <CommonCard
      title={item?.title}
      description={item?.description}
      taskStatus={
        scrumBoardOptions.find((boardOption) => boardOption.id === item?.status)
          .label
      }
      footerContent={
        <div className="flex justify-between items-center gap-3">
          <CommonButton
            onClick={() => {
              setShowDialog(true);
              setCurrentEditedId(item?._id);
              taskFormData.setValue("title", item?.title);
              taskFormData.setValue("description", item?.description);
              taskFormData.setValue("status", item?.status);
              taskFormData.setValue("priority", item?.priority);
            }}
            buttonText={"Edit"}
          />
          <CommonButton
            onClick={() => {
              handleDelete(item?._id), console.log(item?._id);
            }}
            buttonText={"Delete"}
          />
        </div>
      }
    />
  );
};

export default TaskItem;
