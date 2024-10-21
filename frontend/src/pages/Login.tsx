import { Link } from "@tanstack/react-router";
import logo from "../assets/logo.png";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../graphql/mutations/Login";
import { useUserStore } from "../stores/userStore";
import { useNavigate } from "@tanstack/react-router";
import { LoginUserMutation } from "@/gql/graphql";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { GOOGLE_LOGIN } from "@/graphql/mutations/GoogleLogin";
import { useDummyLogin } from "@/hooks/useDummyLogin";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const dummyLogin = useDummyLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [loginUser, { loading }] = useMutation<LoginUserMutation>(LOGIN_USER);
  const [googleLoginMutation] = useMutation(GOOGLE_LOGIN);

  const setUser = useUserStore((state) => state.setUser);

  const handleLogin = async (formData: LoginFormValues) => {
    try {
      const result = await loginUser({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });

      if (result.data?.login.user) {
        setUser({
          email: result.data.login.user.email,
          fullname: result.data.login.user.fullname,
        });
        toast.success("Logged in successfully", {
          position: "bottom-right",
          className: "dark:bg-gray-800 dark:text-white",
        });
        navigate({ to: "/feed" });
      } else {
        toast.error("User not found", {
          position: "bottom-right",
          className: "dark:bg-gray-800 dark:text-white",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Please try again.", {
        position: "bottom-right",
        className: "dark:bg-gray-800 dark:text-white",
      });
    }
  };

  const onSubmit = (data: LoginFormValues) => {
    handleLogin(data);
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      const result = await googleLoginMutation({
        variables: {
          token: credentialResponse.credential,
        },
      });

      if (result.data?.googleLogin.user) {
        const userData = {
          id: result.data.googleLogin.user.id,
          email: result.data.googleLogin.user.email,
          fullname: result.data.googleLogin.user.fullname,
          googleImage: result.data.googleLogin.user.googleImage,
        };
        setUser(userData);
        console.log("User data set after Google login:", userData); // Add this line for debugging
        toast.success("Signed in with Google successfully", {
          position: "bottom-right",
          className: "dark:bg-gray-800 dark:text-white",
        });
        navigate({ to: "/feed" });
      } else {
        throw new Error("User data not received from server");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.", {
        position: "bottom-right",
        className: "dark:bg-gray-800 dark:text-white",
      });
    }
  };

  return (
    <div className="flex lg:-mt-24">
      <div className="hidden lg:block flex-1">
        <img
          src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          alt="Login background"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full px-6">
          <div className="flex justify-center mb-6">
            <Link to="/">
              <img
                src={logo}
                alt="Buzz Logo"
                className="h-16 w-auto transition-transform duration-300 hover:scale-110"
              />
            </Link>
          </div>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
            <div className="border-t-2 border-muted-foreground w-1/2 mx-auto my-2">
              <p className="text-muted-foreground mt-2">
                or{" "}
                <button
                  onClick={dummyLogin}
                  className="text-foreground underline underline-offset-2 hover:scale-105 mx-2 cursor-pointer"
                >
                  Use a dummy account
                </button>
              </p>
            </div>
          </div>

          <Card className="mx-auto max-w-full">
            <CardHeader></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <div className="grid gap-2 -mt-6">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="m@example.com"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        onChange: (e) => setPasswordValue(e.target.value),
                      })}
                      required
                    />
                    {passwordValue.length > 0 && (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    )}
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Log In"}
                </Button>
              </form>

              <div className="flex justify-center mt-4">
                <GoogleLogin
                  theme="filled_black"
                  shape="circle"
                  width="100%"
                  onSuccess={handleGoogleLogin}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </div>

              <div className="mt-4 text-center text-sm">
                New to buzz?{" "}
                <Link to="/register" className="underline">
                  Register here
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
