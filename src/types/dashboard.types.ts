export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface PieChartData {
  status: string;
  count: number;
}

export interface BarChartData {
  month: Date | string;
  count: number;
}

export interface IAdminDashboardData {
  movieCount: number;
  userCount: number;
  reviewCount: number;
  purchaseCount: number;
  subscriptionCount: number;
  totalRevenue: number;
  activeUserCount: number;
  premiumUserCount: number;
  barChartData: BarChartData[];
  pieChartData: PieChartData[];
}
