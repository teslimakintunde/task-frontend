import CommonForm from "@/components/common-form/CommonForm";
import { signInFormCOntrols } from "@/components/config";

import { TaskManagerContext } from "@/context";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const { login } = useContext(TaskManagerContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setError("");
    setSuccess("");
    const result = await login(data);
    console.log("Login response:", result);
    if (result.success) {
      setSuccess(result.message);
      navigate("/tasks");
    } else {
      setError(result.message);
    }
  };
  return (
    <div className="w-full">
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
      <CommonForm
        formControls={signInFormCOntrols}
        form={form}
        handleSubmit={onSubmit}
        btnText="Sign In"
      />
    </div>
  );
};

export default SignIn;
