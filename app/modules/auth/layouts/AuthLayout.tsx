interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps): React.ReactElement => (
  <div className="flex min-h-screen items-center justify-center">{children}</div>
);
