"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UserLogin() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUserLogin = () => {
    if (isProcessing) return;
    
    setIsProcessing(true);

    // Generate a simple user session
    const userId = `user_${Date.now()}`;
    localStorage.setItem("authToken", `usertoken_${userId}`);
    localStorage.setItem("userRole", "user");
    localStorage.setItem("userEmail", `user@dole.gov.ph`);

    setTimeout(() => {
      router.push("/user/dashboard");
    }, 500);
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/dolebuilding.jpg')" }}
    >
      <Card className="w-full max-w-md relative rounded-lg overflow-hidden 
                       bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
        <div className="relative p-6">
          <CardHeader>
            <div className="flex justify-center items-center mb-4">
              <CardTitle className="text-xl font-bold text-white text-center">
                User Login
              </CardTitle>
            </div>
            <p className="text-sm text-white/80 text-center">
              Welcome! Click below to login as a user
            </p>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-6">
            <Button
              onClick={handleUserLogin}
              disabled={isProcessing}
              className="w-full bg-white/20 text-white hover:bg-white/30 py-6 text-lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                  Logging in...
                </>
              ) : (
                "Login as User"
              )}
            </Button>

            <div className="text-white/80 text-xs text-center space-y-2">
              <p className="font-semibold mb-2">Note:</p>
              <p>• This is the user login page</p>
              <p>• Anyone can access this page</p>
              <p>• For admin access, use Admin Login</p>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2 mt-4">
            <a
              href="/login"
              className="text-sm underline-offset-4 hover:underline text-white/80 text-center mt-2"
            >
              Admin Login
            </a>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
