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

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sample users for demo
  const sampleUsers = [
    { email: "admin1@gmail.com", password: "1234", role: "admin" },
    { email: "admin2@gmail.com", password: "4321", role: "admin" },
  ];

  // Store sample users in localStorage once
  useEffect(() => {
    if (!localStorage.getItem("sampleUsers")) {
      localStorage.setItem("sampleUsers", JSON.stringify(sampleUsers));
    }
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
      // save token and role (mock)
      localStorage.setItem("authToken", "sampletoken123");
      localStorage.setItem("userRole", user.role);

      setSuccess("Login successful!");
      setError("");

      // redirect to admin dashboard after a short delay
      setTimeout(() => {
        router.push("/Admin"); // make sure your folder is lowercase for URL
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
        <div className="relative p-6">
          <CardHeader>
            <div className="flex justify-center items-center mb-4">
              <CardTitle className="text-xl font-bold text-white">
                Login to your account
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-2 mt-2">
            <Button
              type="submit"
              className="w-32 bg-white/20 text-white hover:bg-white/30 mx-auto"
              onClick={handleLogin} // optional, form submit already calls it
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
        </div>
      </Card>
    </div>
  );
}
