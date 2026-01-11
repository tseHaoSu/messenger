import { SignIn } from "@clerk/nextjs";

export const SignInView = (): React.ReactElement => (
  <SignIn fallbackRedirectUrl="/conversations" signUpUrl="/sign-up" />
);
