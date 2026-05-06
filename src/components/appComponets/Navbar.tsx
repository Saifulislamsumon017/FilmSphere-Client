'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { Film, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { getDefaultDashboardRoute } from '@/lib/authUtils';
import { logoutService } from '@/services/auth/logout.service';
import { publicNavbarItems } from '@/lib/navItems';
import ThemeSwitch from '../shared/ThemeSwitch/ThemeSwitch';
import { useAuthUser } from '@/hooks/useAuthUser';

const Navbar = () => {
  const { user, setUser } = useAuthUser();

  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const dashboardHref = user ? getDefaultDashboardRoute(user.role) : '/login';

  // ✅ scroll effect ONLY (no setState cascade problem)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ logout handler
  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logoutService();

        queryClient.removeQueries({ queryKey: ['user', 'me'] });
        setUser(null);

        router.replace('/login');
      } catch (err) {
        console.error(err);
      }
    });
  };

  // ✅ reusable navigation handler (BEST PRACTICE)
  const handleNavigate = (path: string) => {
    setIsOpen(false); // close mobile menu
    router.push(path);
  };

  // ✅ reusable logo
  const Logo = (
    <div
      onClick={() => handleNavigate('/')}
      className="flex items-center gap-2 group cursor-pointer"
    >
      <Film className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:rotate-12 transition-transform" />
      <span className="font-play text-base sm:text-lg md:text-xl tracking-wider">
        FILM<span className="text-primary">SPHERE</span>
      </span>
    </div>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-2 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-lg border-b border-border'
          : 'bg-background'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* ✅ MOBILE */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[85%] max-w-sm p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>

              <div className="flex h-full flex-col">
                {/* LOGO */}
                <div className="flex h-16 items-center border-b px-4">
                  {Logo}
                </div>

                {/* NAV ITEMS */}
                <div className="flex-1 space-y-1 p-4">
                  {publicNavbarItems.map(item => (
                    <button
                      key={item.href}
                      onClick={() => handleNavigate(item.href)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                        pathname === item.href
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>

                {/* AUTH (MOBILE) */}
                <div className="border-t p-4">
                  {user ? (
                    <Button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      disabled={isPending}
                      className="w-full text-sm"
                      variant="destructive"
                    >
                      <LogOut className="mr-1 h-4 w-4" />
                      {isPending ? 'Logging...' : 'Logout'}
                    </Button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        className="text-sm"
                        onClick={() => handleNavigate('/login')}
                      >
                        Login
                      </Button>

                      <Button
                        variant="outline"
                        className="text-sm"
                        onClick={() => handleNavigate('/register')}
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* ✅ DESKTOP LOGO */}
        <div className="hidden md:block">
          <Link href="/" className="flex items-center gap-2">
            <Film className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">
              FILM<span className="text-primary">SPHERE</span>
            </span>
          </Link>
        </div>

        {/* ✅ DESKTOP NAV */}
        <nav className="hidden md:flex gap-5 lg:gap-6">
          {publicNavbarItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm md:text-base transition ${
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* ✅ RIGHT SIDE */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Button asChild variant="ghost" className="text-sm">
                  <Link href={dashboardHref}>Dashboard</Link>
                </Button>

                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  disabled={isPending}
                  className="text-sm"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  {isPending ? 'Logging...' : 'Logout'}
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-sm">
                  <Link href="/login">Login</Link>
                </Button>

                <Button asChild className="text-sm">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
