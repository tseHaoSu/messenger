import type { Metadata } from "next";
import { SignUpView } from "@/app/modules/auth/views/SignUpView";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return <SignUpView />;
}
