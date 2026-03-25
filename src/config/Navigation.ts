// src/config/navigation.ts
// Centralized navigation config with role-based filtering

import {
  LayoutDashboard,
  Users,
  CheckCircle,
  UserPlus,
  BarChart3,
  DollarSign,
  Settings,
  User,
  MapPin,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  page: string; // matches the key used in useRoleAccess
}

/**
 * Full list of navigation items.
 * The sidebar component should filter this list using:
 *
 *   const { canAccessPage } = useRoleAccess();
 *   const visibleItems = NAV_ITEMS.filter(item => canAccessPage(item.page));
 */
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    page: "dashboard",
  },
  {
    label: "Members",
    href: "/members",
    icon: Users,
    page: "members",
  },
  {
    label: "Attendance",
    href: "/attendance",
    icon: CheckCircle,
    page: "attendance",
  },
  {
    label: "Groups",
    href: "/groups",
    icon: UserPlus,
    page: "groups",
  },
  {
    label: "Cells & Zones",
    href: "/cell-zones",
    icon: MapPin,
    page: "cell-zones",
  },
  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
    page: "reports",
  },
  {
    label: "Finance",
    href: "/finance",
    icon: DollarSign,
    page: "finance",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    page: "settings",
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
    page: "profile",
  },
];

/**
 * Example usage in Sidebar component:
 *
 * ```tsx
 * import { NAV_ITEMS } from "@/config/navigation";
 * import { useRoleAccess } from "@/hooks/useRoleAccess";
 *
 * const Sidebar = () => {
 *   const { canAccessPage } = useRoleAccess();
 *   const visibleItems = NAV_ITEMS.filter(item => canAccessPage(item.page));
 *
 *   return (
 *     <nav>
 *       {visibleItems.map(item => (
 *         <Link key={item.href} to={item.href}>
 *           <item.icon className="h-5 w-5" />
 *           <span>{item.label}</span>
 *         </Link>
 *       ))}
 *     </nav>
 *   );
 * };
 * ```
 *
 * For an Usher role, this will only show:
 *   - Attendance
 *   - Profile
 */