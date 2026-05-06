'use client';

import Link from 'next/link';
import { Film } from 'lucide-react';

interface SidebarHeaderProps {
  dashboardHome: string;
}

const SidebarHeader = ({ dashboardHome }: SidebarHeaderProps) => {
  return (
    <div className="flex h-16 items-center border-b px-6 py-4">
      {/* FIX: py-4 added */}
      <Link href={dashboardHome} className="flex items-center gap-2 group">
        <Film className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
        <span className="font-play text-xl tracking-wider">
          FILM<span className="text-primary">SPHERE</span>
        </span>
      </Link>
    </div>
  );
};

export default SidebarHeader;
