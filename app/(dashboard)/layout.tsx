import { DashboardLayout } from "@/app/modules/dashboard/layouts/DashboardLayout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps): React.ReactElement => (
  <DashboardLayout>{children}</DashboardLayout>
);

export default Layout;
