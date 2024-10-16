import Login from "@/pages/Login";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

const LoginWrapper = () => {
  useAuth();
  return <Login />;
};

export const Route = createFileRoute("/login")({
  component: LoginWrapper,
});
