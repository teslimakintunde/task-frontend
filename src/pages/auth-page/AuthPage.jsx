import React, { useEffect, useState } from "react";
import SignIn from "../../components/auth/sign-in/SignIn";
import SignUp from "../../components/auth/sign-up/SignUp";
import CommonButton from "../../components/common-button/CommonButton";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/header/Header";

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Sync isLoginView with URL query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    console.log("AuthPage mode:", mode, "isLoginView:", mode !== "register");
    setIsLoginView(mode !== "register");
  }, [location.search]);

  const handleSwitch = () => {
    const newMode = isLoginView ? "register" : "login";
    navigate(`/auth?mode=${newMode}`);
  };
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 xs:px-6 tablet:px-8 pt-24">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 xs:p-8">
          <h1 className="text-2xl xs:text-3xl tablet:text-4xl font-bold text-gray-800 text-center mb-6">
            {isLoginView
              ? " Welcome to Task manager Sign In Page"
              : " Welcome to Task manager Sign Up Page"}
          </h1>
          {isLoginView ? <SignIn /> : <SignUp />}

          <div className="flex items-center justify-center w-full">
            <CommonButton
              type={"button"}
              buttonText={
                isLoginView ? "Switch to sign Up" : "Switch to sign In"
              }
              disabled={false}
              onClick={handleSwitch}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
