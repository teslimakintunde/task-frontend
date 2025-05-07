import React from "react";
import { Button } from "../ui/button";

const CommonButton = ({ onClick, buttonText, type, disabled }) => {
  return (
    <Button
      type={type || "submit"}
      onClick={onClick || null}
      disabled={disabled || false}
      className="px-6 py-5 bg-black text-white w-fit"
    >
      {buttonText}
    </Button>
  );
};

export default CommonButton;
