'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { getIconComponent } from '@/lib/iconMapper';
import { cn } from '@/lib/utils';
import { NavSection } from '@/types/dashboard.types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarNavProps {
  navItems: NavSection[];
}

const NavItems = ({ navItems }: SidebarNavProps) => {
  const pathname = usePathname();

  return (
    <ScrollArea className="flex-1 px-3 py-4 min-h-0">
      <nav className="space-y-6">
        {navItems.map((section, index) => (
          <div key={section.title || index}>
            {section.title && (
              <h4 className="text-xs font-semibold text-muted-foreground px-3 mb-2 uppercase tracking-wider">
                {section.title}
              </h4>
            )}

            <div className="space-y-2">
              {section.items.map(item => {
                const isActive = pathname === item.href;
                const Icon = getIconComponent(item.icon);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>

            {index < navItems.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </nav>
    </ScrollArea>
  );
};

export default NavItems;
