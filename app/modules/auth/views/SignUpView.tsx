import { SignUp } from "@clerk/nextjs";

export const SignUpView = (): React.ReactElement => (
  <SignUp fallbackRedirectUrl="/" signInUrl="/sign-in" />
);
