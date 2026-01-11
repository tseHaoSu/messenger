import { AuthLayout } from "@/app/modules/auth/layouts/AuthLayout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps): React.ReactElement => (
  <AuthLayout>{children}</AuthLayout>
);

export default Layout;
