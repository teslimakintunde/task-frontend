import CommonForm from "@/components/common-form/CommonForm";
import { signupFormCOntrols } from "@/components/config";
import { TaskManagerContext } from "@/context";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  // const { register } = useContext(TaskManagerContext);
  // const navigate = useNavigate();
  // const [error, setError] = useState("");
  // const [success, setSuccess] = useState("");

  // const formData = useForm({
  //   defaultValues: {
  //     name: "",
  //     email: "",
  //     password: "",
  //   },
  // });

  // const handleSubmit = async (getData) => {
  //   console.log(getData);
  //   const result = await register(getData);
  //   console.log("Register response:", result);
  //   if (result.success) {
  //     setSuccess(result.message);
  //     setTimeout(() => navigate("/auth?mode=login"), 2000);
  //     // navigate("/auth?mode=login");
  //   } else {
  //     setError(result.message);
  //   }
  // };
  const { register } = useContext(TaskManagerContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setError("");
    setSuccess("");
    const result = await register(data);
    console.log("Register response:", result);
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        console.log("Navigating to /auth?mode=login");
        navigate("/auth?mode=login");
      }, 1000); // 1-second delay for UX
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="w-full">
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
      <CommonForm
        formControls={signupFormCOntrols}
        form={form}
        handleSubmit={onSubmit}
        btnText="Sign Up"
      />
    </div>
  );
};

export default SignUp;
