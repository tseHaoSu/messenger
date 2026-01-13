import type { Metadata } from "next";
import { SignInView } from "@/app/modules/auth/views/SignInView";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return <SignInView />;
}
