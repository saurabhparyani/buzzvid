import { useMutation } from "@apollo/client";
import { LOGOUT_USER } from "@/graphql/mutations/Logout";
import { useUserStore } from "@/stores/userStore";
import { useNavigate } from "@tanstack/react-router";

export const useLogout = () => {
  const [logoutUser] = useMutation(LOGOUT_USER);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser({
        id: "",
        fullname: "",
        email: "",
        bio: "",
        image: "",
        googleImage: "",
      });
      navigate({ to: "/login" });
    } catch (err) {
      console.log(err);
    }
  };

  return handleLogout;
};