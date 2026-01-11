import { SignIn } from "@clerk/nextjs";

export const SignInView = (): React.ReactElement => (
  <SignIn fallbackRedirectUrl="/" signUpUrl="/sign-up" />
);
