import { SignUp } from "@clerk/nextjs";

export const SignUpView = (): React.ReactElement => (
  <SignUp fallbackRedirectUrl="/conversations" signInUrl="/sign-in" />
);
