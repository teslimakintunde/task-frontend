import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import CommonForm from "../common-form/CommonForm";

const CommonDialog = ({
  showDialog,
  onOpenChange,
  title,
  formControls,
  btnText,
  handleSubmit,
  formData,
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[450px] overflow-auto">
        <DialogTitle>{title}</DialogTitle>
        <div>
          <CommonForm
            formControls={formControls}
            btnText={btnText}
            handleSubmit={handleSubmit}
            form={formData}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommonDialog;
