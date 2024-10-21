import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../graphql/mutations/Login";
import { useUserStore } from "../stores/userStore";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";

export const useDummyLogin = () => {
  const navigate = useNavigate();
  const [loginUser] = useMutation(LOGIN_USER);
  const setUser = useUserStore((state) => state.setUser);

  const dummyLogin = async () => {
    try {
      const result = await loginUser({
        variables: {
          // a valid email and password from db
          email: "johndoe@gmail.com",
          password: "johndoe123",
        },
      });

      if (result.data?.login.user) {
        setUser({
          id: result.data.login.user.id,
          email: result.data.login.user.email,
          fullname: result.data.login.user.fullname,
        });
        toast.success("Logged in with dummy account", {
          position: "bottom-right",
          className: "dark:bg-gray-800 dark:text-white",
        });
        navigate({ to: "/feed" });
      } else {
        throw new Error("User not found");
      }
    } catch (err) {
      console.error("Dummy login error:", err);
      toast.error("Dummy login failed. Please try again.", {
        position: "bottom-right",
        className: "dark:bg-gray-800 dark:text-white",
      });
    }
  };

  return dummyLogin;
};