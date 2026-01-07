"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Next.js 13 router
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Sample users for demo (login credentials)
const sampleUsers = [
  { email: "admin1@gmail.com", password: "1234", role: "admin", userId: "EMP-1001", name: "Juan Dela Cruz" },
  { email: "admin2@gmail.com", password: "4321", role: "admin", userId: "EMP-1005", name: "Roberto Martinez" },
  { email: "employee1@dole.gov.ph", password: "1234", role: "user", userId: "EMP-1002", name: "Maria Santos" },
];

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Store sample users in localStorage once
  useEffect(() => {
    // Always update to include latest users
    localStorage.setItem("sampleUsers", JSON.stringify(sampleUsers));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    // normalize input
    const inputEmail = email.trim().toLowerCase();
    const inputPassword = password;

    const users = JSON.parse(localStorage.getItem("sampleUsers") || "[]");

    const user = users.find(
      (u) =>
        u.email.toLowerCase() === inputEmail && u.password === inputPassword
    );

    if (user) {
      // save token, role, user email, userId, and name
      localStorage.setItem("authToken", "sampletoken123");
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userId", user.userId || "");
      localStorage.setItem("userName", user.name || "");

      setSuccess("Login successful!");
      setError("");

      // redirect based on role
      setTimeout(() => {
        if (user.role === "admin") {
          router.push("/Admin");
        } else {
          router.push("/user/dashboard");
        }
      }, 500);
    } else {
      setError("Invalid email or password");
      setSuccess("");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/dolebuilding.jpg')" }}
    >
      {/* Glass-like login card */}
      <Card className="w-full max-w-sm relative rounded-lg overflow-hidden 
                       bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
        <form onSubmit={handleLogin} className="relative p-6">
          <CardHeader>
            <div className="flex justify-center items-center mb-4">
              <CardTitle className="text-xl font-bold text-white">
                Login to your account
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4">
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/20 text-white placeholder-white/70 border-white/40 focus:ring-white/60 focus:border-white"
                />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/20 text-white placeholder-white/70 border-white/40 focus:ring-white/60 focus:border-white"
                />
              </div>

              {/* Messages */}
              {error && <p className="text-red-400 mt-1">{error}</p>}
              {success && <p className="text-green-400 mt-1">{success}</p>}
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2 mt-2">
            <Button
              type="submit"
              className="w-32 bg-white/20 text-white hover:bg-white/30 mx-auto"
            >
              Login
            </Button>
            <a
              href="#"
              className="text-sm underline-offset-4 hover:underline text-white/80 text-center mt-2"
            >
              Forgot your password?
            </a>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
