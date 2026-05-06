'use client';

import { useTransition } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logoutService } from '@/services/auth/logout.service';

export default function LogoutButton({
  fullWidth = false,
}: {
  fullWidth?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutService();
    });
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isPending}
      className={fullWidth ? 'w-full' : ''}
      size="sm"
    >
      <LogOut className="w-4 h-4 mr-2" />
      {isPending ? 'Logging out...' : 'Logout'}
    </Button>
  );
}
