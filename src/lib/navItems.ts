import { NavSection } from '@/types/dashboard.types';
import { getDefaultDashboardRoute, UserRole } from './authUtils';

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);

  return [
    {
      items: [
        {
          title: 'Home',
          href: '/',
          icon: 'Home',
        },
        {
          title: 'Dashboard',
          href: defaultDashboard,
          icon: 'LayoutDashboard',
        },
        {
          title: 'My Profile',
          href: role === 'ADMIN' ? '/admin/profile' : '/user/profile',
          icon: 'User',
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Reset Password',
          href: '/reset-password',
          icon: 'Settings',
        },
      ],
    },
  ];
};

export const adminNavItems: NavSection[] = [
  {
    title: 'Management',
    items: [
      {
        title: 'Movies',
        href: '/admin/dashboard/movies',
        icon: 'Film',
      },
      {
        title: 'Users',
        href: '/admin/dashboard/users',
        icon: 'Users',
      },
      {
        title: 'Reviews',
        href: '/admin/dashboard/reviews',
        icon: 'Star',
      },
      {
        title: 'Activity',
        href: '/admin/dashboard/activity',
        icon: 'Activity',
      },
      {
        title: 'My Activity',
        href: '/admin/dashboard/my-activity',
        icon: 'History',
      },
      {
        title: 'Purchases',
        href: '/admin/dashboard/purchases',
        icon: 'CreditCard',
      },
      {
        title: 'Subscriptions',
        href: '/admin/dashboard/subscriptions',
        icon: 'BadgeCheck',
      },
      {
        title: 'Settings',
        href: '/admin/dashboard/settings',
        icon: 'Settings',
      },
    ],
  },
];

export const userNavItems: NavSection[] = [
  {
    title: 'My Account',
    items: [
      {
        title: 'Watchlist',
        href: '/dashboard/watchlist',
        icon: 'Heart',
      },
      {
        title: 'Purchases',
        href: '/dashboard/purchases',
        icon: 'CreditCard',
      },
      {
        title: 'Subscriptions',
        href: '/dashboard/subscriptions',
        icon: 'BadgeCheck',
      },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case 'ADMIN':
      return [...commonNavItems, ...adminNavItems];

    case 'USER':
      return [...commonNavItems, ...userNavItems];

    default:
      return commonNavItems;
  }
};
