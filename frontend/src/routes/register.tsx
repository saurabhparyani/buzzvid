import Register from "@/pages/Register";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

const RegisterWrapper = () => {
  useAuth();
  return <Register />;
};

export const Route = createFileRoute("/register")({
  component: RegisterWrapper,
});
