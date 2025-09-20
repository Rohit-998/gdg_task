import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { signin, signup } from "../../lib/apiClient";

const getAuthSchema = (type) =>
  z.object({
    name:
      type === "signUp"
        ? z.string().min(2, { message: "Name must be at least 2 characters" })
        : z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  });

const FormField = ({ control, name, label, placeholder, type = "text" }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="label">{label}</FormLabel>
        <FormControl>
          <Input type={type} placeholder={placeholder} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default function AuthForm({ type }) {
  const navigate = useNavigate();
  const isSignIn = type === "signIn";

  const form = useForm({
    resolver: zodResolver(getAuthSchema(type)),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = isSignIn ? await signin(data) : await signup(data);

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        toast.success(
          isSignIn ? "Login successful!" : "Account created successfully!"
        );
        navigate("/home"); // Navigate to home after successful auth
      } else {
        toast.error("Authentication failed. Please try again.");
      }
    } catch (error) {
      console.error("Auth Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    // ✅ FIX: Added px-4 for padding on small screens
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      {/* ✅ FIX: Refactored to a responsive structure */}
      <div className="card-border w-full max-w-md">
        <div className="form-container">
          <div className="flex flex-col items-center mb-6">
            <img src="/logo.png" alt="Logo" width={50} height={36} />
            <h2 className="text-2xl font-bold mt-2">
              {isSignIn ? "Login" : "Sign Up"}
            </h2>
            <p className="text-sm text-gray-400">Library Management</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="name"
                  label="Name"
                  placeholder="Enter your name"
                />
              )}

              <FormField
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
                type="email"
              />

              <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
              />

              <Button type="submit" className="w-full">
                {isSignIn ? "Login" : "Sign Up"}
              </Button>
            </form>
          </Form>

          <p className="mt-4 text-sm text-center">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
            <Link
              to={isSignIn ? "/signup" : "/login"}
              className="text-blue-400 hover:underline font-bold"
            >
              {isSignIn ? "Sign Up" : "Login"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}