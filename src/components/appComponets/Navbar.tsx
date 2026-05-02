'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film,
  Menu,
  X,
  Search,
  Heart,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Movies', path: '/movies' },
  { label: 'Series', path: '/series' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 🔥 login state (demo)
  const [user, setUser] = useState(true); // true হলে logged in

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    setUser(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-2 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-lg border-b border-border'
          : 'bg-background'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex h-16 items-center px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <Film className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:rotate-12 transition-transform" />
            <span className="font-play text-xl sm:text-2xl tracking-wider text-foreground">
              FILM<span className="text-primary">SPHERE</span>
            </span>
            {/* <span className="text-xl font-bold text-primary">FILM SPHERE</span> */}
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              href={item.path}
              className={`px-3 py-2 text-sm font-medium rounded-md transition ${
                pathname === item.path
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/watchlist">
            <Button variant="ghost" size="icon">
              <Heart className="w-5 h-5" />
            </Button>
          </Link>

          <Link href="/search">
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
          </Link>

          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>

              <Button size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>

              <Link href="/register">
                <Button size="sm">Join Free</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-background/95 backdrop-blur-lg border-t border-border"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition ${
                    pathname === item.path
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="flex flex-col gap-2 mt-3">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        Dashboard
                      </Button>
                    </Link>

                    <Button
                      className="w-full"
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>

                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full">Join Free</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
