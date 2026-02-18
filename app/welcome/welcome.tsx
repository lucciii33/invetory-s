import Card from "~/comp/Card";
import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import { posts } from "~/utils/api";
import { useNavigate } from "react-router";
import HenkoPopup from "~/comp/HenkoPopup";
import mixpanel from "mixpanel-browser";
import { useEffect, useState } from "react";
import LoginForm from "~/comp/loginForm";
import RegisterForm from "~/comp/registerForm";

export function Welcome() {
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (typeof window !== "undefined" && mixpanel.__loaded) {
  //     mixpanel.track("Page View: Welcome");
  //   }
  // }, []);
  const [showBox, setShowBox] = useState({
    login: true,
    register: false,
  });

  const changeView = () => {
    setShowBox({ login: !showBox.login, register: !showBox.register });
  };
  return (
    <div className="min-h-screen bg-grey-900 flex items-center justify-center  p-10 ">
      <div className="bg-white h-100 w-30 mt-20px flex flex-col text-center justify-around gap-5">
        <div className="text-black">Logo</div>
        <div
          onClick={changeView}
          className={`cursor-pointer px-3 h-20 flex items-center justify-center text-center py-2 rounded ${
            showBox.login
              ? "text-blue-500 border-l-4 border-l-4-blue-400"
              : "text-gray-500"
          }`}
        >
          Login
        </div>
        <div
          onClick={changeView}
          className={`cursor-pointer flex items-center justify-center text-center px-3 h-20 rounded ${
            showBox.register
              ? "text-blue-500 border-l-4 border-l-4-blue-400"
              : "text-gray-500"
          }`}
        >
          Register
        </div>
      </div>
      <div className="bg-blue-500 h-140 w-70 mt-[-10px]"></div>
      <div className="bg-white h-100 w-100 mt-20px overflow-y-auto">
        {showBox.login && <LoginForm />}
        {showBox.register && <RegisterForm />}
      </div>
    </div>
  );
}
