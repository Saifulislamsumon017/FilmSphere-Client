'use client';

import { UserInfo } from '@/types/user.types';

interface SidebarUserProps {
  userInfo: UserInfo;
}

const SidebarUser = ({ userInfo }: SidebarUserProps) => {
  return (
    <div className="border-t px-3 py-4 mt-auto">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-semibold text-primary">
            {userInfo?.name?.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-medium truncate">{userInfo?.name}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {userInfo?.role?.toLowerCase().replace('_', ' ')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarUser;
