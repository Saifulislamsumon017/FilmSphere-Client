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
          title: 'Change Password',
          href: '/change-password',
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
        href: '/admin/movies',
        icon: 'Film',
      },
      {
        title: 'Users',
        href: '/admin/users',
        icon: 'Users',
      },
      {
        title: 'Reviews',
        href: '/admin/reviews',
        icon: 'Star',
      },
      {
        title: 'Activity',
        href: '/admin/activity',
        icon: 'Activity',
      },
      {
        title: 'My Activity',
        href: '/admin/my-activity',
        icon: 'History',
      },
      {
        title: 'Purchases',
        href: '/admin/purchases',
        icon: 'CreditCard',
      },
      {
        title: 'Subscriptions',
        href: '/admin/subscriptions',
        icon: 'BadgeCheck',
      },
      {
        title: 'Settings',
        href: '/admin/settings',
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
        href: '/user/watchlist',
        icon: 'Heart',
      },
      {
        title: 'Purchases',
        href: '/user/purchases',
        icon: 'CreditCard',
      },
      {
        title: 'Subscriptions',
        href: '/user/subscriptions',
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
