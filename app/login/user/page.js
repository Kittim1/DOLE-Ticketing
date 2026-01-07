"use client";

import { Suspense } from "react";
import UserLogin from "@/app/components/userLogin";

export default function UserLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserLogin />
    </Suspense>
  );
}
