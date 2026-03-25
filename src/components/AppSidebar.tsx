import { CheckCircle, Users, UsersRound, BarChart3, UserCircle, Settings, LogOut, BarChart2, DollarSign, MapPin } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { auth0Logout } from "@/redux/actions/authActions";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// Each item has a `page` key that maps to useRoleAccess page permissions
const mainItems = [
  { title: "Dashboard", url: "/", icon: BarChart2, page: "dashboard" },
  { title: "Record Attendance", url: "/attendance", icon: CheckCircle, page: "attendance" },
  { title: "Manage Members", url: "/members", icon: Users, page: "members" },
  { title: "Groups", url: "/groups", icon: UsersRound, page: "groups" },
  { title: "Cells & Zones", url: "/cell-zones", icon: MapPin, page: "cell-zones" },
  { title: "View Reports", url: "/reports", icon: BarChart3, page: "reports" },
  { title: "View Finances", url: "/finances", icon: DollarSign, page: "finance" },
];

const bottomItems = [
  { title: "Profile", url: "/profile", icon: UserCircle, page: "profile" },
  { title: "Settings", url: "/settings", icon: Settings, page: "settings" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const dispatch = useDispatch();
  const { logout } = useAuth0();
  const { canAccessPage } = useRoleAccess();
  const collapsed = state === "collapsed";

  // Filter nav items based on user role
  const visibleMainItems = mainItems.filter((item) => canAccessPage(item.page));
  const visibleBottomItems = bottomItems.filter((item) => canAccessPage(item.page));

  const handleLogout = () => {
    dispatch(auth0Logout());
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Navigation</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleBottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}