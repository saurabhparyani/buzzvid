/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { REGISTER_USER } from "../graphql/mutations/Register";
import { useUserStore } from "../stores/userStore";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";
import { RegisterUserMutation } from "@/gql/graphql";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const registerSchema = z
  .object({
    fullname: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const [registerUser, { loading, error, data }] =
    useMutation<RegisterUserMutation>(REGISTER_USER);

  const setUser = useUserStore((state) => state.setUser);

  const handleRegister = async (formData: RegisterFormValues) => {
    try {
      const result = await registerUser({
        variables: {
          email: formData.email,
          password: formData.password,
          fullname: formData.fullname,
          confirmPassword: formData.confirmPassword,
        },
      });

      if (result.data?.register.user) {
        setUser({
          _id: result.data.register.user._id,
          email: result.data.register.user.email,
          fullname: result.data.register.user.fullname,
        });
        return true; // Indicate successful registration
      }
      return false; // Indicate failed registration
    } catch (error) {
      console.error("Registration error:", error);
      return false; // Indicate failed registration
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    const success = await handleRegister(data);
    if (success) {
      toast.success("Signed up successfully", {
        position: "bottom-right",
        className: "dark:bg-gray-800 dark:text-white",
      });
      navigate({ to: "/feed" });
    } else {
      // Handle registration failure (e.g., show an error message)
      toast.error("Registration failed", {
        position: "bottom-right",
        className: "dark:bg-gray-800 dark:text-white",
      });
    }
  };

  return (
    <div className="flex h-screen">
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
            <h1 className="text-3xl font-bold">Welcome to buzz.</h1>
            <p className="text-muted-foreground">
              Create an account to join the hive
            </p>
          </div>

          <Card className="mx-auto max-w-full">
            <CardHeader></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullname">Full name</Label>
                  <Input
                    id="fullname"
                    {...register("fullname")}
                    placeholder="John Doe"
                    required
                  />
                  {errors.fullname && (
                    <p className="text-red-500 text-sm">
                      {errors.fullname.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="john@example.com"
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
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      value={confirmPasswordValue}
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword", {
                        onChange: (e) =>
                          setConfirmPasswordValue(e.target.value),
                      })}
                      required
                    />
                    {confirmPasswordValue.length > 0 && (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create an account"}
                </Button>
              </form>
              {/* <div className="flex justify-center">
                <GoogleLogin
                  theme="filled_black"
                  shape="circle"
                  onSuccess={handleLoginWithGoogle}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </div> */}
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="hidden lg:block flex-1">
        <img
          src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          alt="Signup background"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default Register;
