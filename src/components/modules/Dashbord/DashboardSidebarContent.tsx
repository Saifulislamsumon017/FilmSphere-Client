'use client';

import { NavSection } from '@/types/dashboard.types';
import { UserInfo } from '@/types/user.types';

import SidebarHeader from './SidebarHeader';
import SidebarUser from './SidebarUser';
import NavItems from './NavItems';

interface DashboardSidebarContentProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardSidebarContent = ({
  dashboardHome,
  navItems,
  userInfo,
}: DashboardSidebarContentProps) => {
  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r bg-card overflow-y-auto">
      {/* Header */}
      <SidebarHeader dashboardHome={dashboardHome} />

      {/* Navigation */}
      <NavItems navItems={navItems} />

      {/* User */}
      <SidebarUser userInfo={userInfo} />
    </div>
  );
};

export default DashboardSidebarContent;
