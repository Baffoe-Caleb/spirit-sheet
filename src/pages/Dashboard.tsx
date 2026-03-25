// src/pages/Dashboard.tsx

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Loader2,
  RefreshCw,
  Clock,
  ArrowRight,
  BarChart3,
  DollarSign,
  UserPlus,
  Activity,
  PieChart,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/redux/reducers";
import { fetchDashboardAnalyticsRequest } from "@/redux/actions/reportActions";

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    service: "bg-blue-100 text-blue-800",
    bible_study: "bg-purple-100 text-purple-800",
    prayer_meeting: "bg-green-100 text-green-800",
    youth_event: "bg-orange-100 text-orange-800",
    special_event: "bg-pink-100 text-pink-800",
    conference: "bg-indigo-100 text-indigo-800",
    outreach: "bg-yellow-100 text-yellow-800",
    uncategorized: "bg-gray-100 text-gray-800",
    default: "bg-gray-100 text-gray-800",
  };
  return colors[category] || colors.default;
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    service: "Service",
    bible_study: "Bible Study",
    prayer_meeting: "Prayer Meeting",
    youth_event: "Youth Event",
    special_event: "Special Event",
    conference: "Conference",
    retreat: "Retreat",
    social: "Social",
    outreach: "Outreach",
    uncategorized: "Uncategorized",
    other: "Other",
  };
  return labels[category] || category;
};

const parseGrowthRate = (growthString: string) => {
  // Parse "5.2%" to 5.2
  const num = parseFloat(growthString?.replace('%', '') || '0');
  return isNaN(num) ? 0 : num;
};

// ============================================
// COMPONENT
// ============================================

const Dashboard = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Redux state
  const { user } = useSelector((state: RootState) => state.auth);
  const { dashboardAnalytics, isLoadingDashboard, error } = useSelector(
    (state: RootState) => state.reports
  );

  console.log(user);

  // Fetch dashboard data on mount
  useEffect(() => {
    dispatch(fetchDashboardAnalyticsRequest());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Refresh handler
  const handleRefresh = () => {
    dispatch(fetchDashboardAnalyticsRequest());
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Extract data with defaults - matching new backend structure
  const analytics = dashboardAnalytics?.data;
  const overview = analytics?.overview || {
    totalMembers: 0,
    activeMembers: 0,
    newMembers: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalCheckIns: 0,
    memberCheckIns: 0,
    guestCheckIns: 0,
    memberGrowth: "0%",
    lastUpdated: new Date().toISOString(),
  };

  const financialSummary = analytics?.financialSummary || {
    income: 0,
    expenses: 0,
    net: 0,
    transactionCount: 0,
  };

  const memberDistribution = analytics?.memberDistribution || {
    groups: {},
    statuses: {},
  };

  const eventDistribution = analytics?.eventDistribution || {
    categories: {},
  };

  const charts = analytics?.charts || {
    attendanceTrend: [],
    memberGrowthTrend: [],
    eventAttendance: [],
  };

  const growthRate = parseGrowthRate(overview.memberGrowth);

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            {getGreeting()}, {user?.firstName || user?.username || "there"}! Here's
            what's happening.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isLoadingDashboard}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoadingDashboard ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Loading State */}
      {isLoadingDashboard && !dashboardAnalytics ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            Loading dashboard...
          </span>
        </div>
      ) : (
        <>
          {/* Main Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Total Members */}
            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Members
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {overview.totalMembers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {overview.activeMembers.toLocaleString()} active
                </p>
                <div className="flex items-center gap-1">
                  <UserPlus className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">
                    +{overview.newMembers} this month
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Total Check-ins */}
            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Check-ins
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {overview.totalCheckIns.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  Last 30 days
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-blue-600">{overview.memberCheckIns} members</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-green-600">{overview.guestCheckIns} guests</span>
                </div>
              </CardContent>
            </Card>

            {/* Events */}
            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Events
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {overview.totalEvents}
                </div>
                <p className="text-xs text-muted-foreground mb-1">Last 30 days</p>
                <p className="text-xs text-secondary font-medium">
                  {overview.upcomingEvents} upcoming
                </p>
              </CardContent>
            </Card>

            {/* Growth */}
            <Card className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Growth
                </CardTitle>
                {growthRate >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </CardHeader>
              <CardContent>
                <div
                  className={`text-3xl font-bold mb-1 ${growthRate >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {overview.memberGrowth}
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  vs last month
                </p>
                <p className="text-xs text-secondary font-medium">
                  Member growth rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            {/* Quick Actions */}
            <Card className="shadow-soft lg:col-span-1">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks at your fingertips</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/attendance">
                  <Button className="w-full justify-between" variant="default">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Record Attendance
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link to="/members">
                  <Button className="w-full justify-between" variant="outline">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Manage Members
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link to="/groups">
                  <Button className="w-full justify-between" variant="outline">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      View Groups
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link to="/reports">
                  <Button className="w-full justify-between" variant="outline">
                    <span className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      View Reports
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Event Attendance */}
            <Card className="shadow-soft lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Event Attendance</CardTitle>
                  <CardDescription>
                    Top events by attendance in the last 30 days
                  </CardDescription>
                </div>
                <Link to="/reports">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {charts.eventAttendance?.length > 0 ? (
                  <div className="space-y-4">
                    {charts.eventAttendance.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{event.eventName}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(event.eventDate)}</span>
                              <Badge className={getCategoryColor(event.eventCategory)}>
                                {getCategoryLabel(event.eventCategory)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-2xl text-primary">
                            {event.attendanceCount}
                          </p>
                          <p className="text-xs text-muted-foreground">attendees</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No attendance data</p>
                    <p className="text-sm">Record attendance to see data here</p>
                    <Link to="/attendance">
                      <Button className="mt-4">Record Attendance</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Second Row - Charts and Distribution */}
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* Attendance Trend */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Attendance Trend</CardTitle>
                <CardDescription>Daily attendance over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                {charts.attendanceTrend?.length > 0 ? (
                  <div className="space-y-3">
                    {charts.attendanceTrend.map((day, index) => {
                      const maxAttendance = Math.max(...charts.attendanceTrend.map(d => d.attendance));
                      const percentage = maxAttendance > 0 ? (day.attendance / maxAttendance) * 100 : 0;

                      return (
                        <div key={index} className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground w-20">
                            {new Date(day.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <div className="flex-1">
                            <Progress value={percentage} className="h-2" />
                          </div>
                          <span className="text-sm font-medium w-10 text-right">
                            {day.attendance}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-sm">No attendance trend data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Member Growth Trend */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Member Growth</CardTitle>
                <CardDescription>New members over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                {charts.memberGrowthTrend?.length > 0 ? (
                  <div className="space-y-3">
                    {charts.memberGrowthTrend.map((month, index) => {
                      const maxMembers = Math.max(...charts.memberGrowthTrend.map(m => m.newMembers));
                      const percentage = maxMembers > 0 ? (month.newMembers / maxMembers) * 100 : 0;

                      return (
                        <div key={index} className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground w-20">
                            {month.month}
                          </span>
                          <div className="flex-1">
                            <Progress value={percentage} className="h-2" />
                          </div>
                          <span className="text-sm font-medium w-10 text-right">
                            +{month.newMembers}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-sm">No growth data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Third Row - Distributions and Financial */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Member Status Distribution */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Member Status</CardTitle>
                <CardDescription>Distribution by status</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(memberDistribution.statuses).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(memberDistribution.statuses).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              status === "active"
                                ? "bg-green-100 text-green-800"
                                : status === "inactive"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {status}
                          </Badge>
                        </div>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <PieChart className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-sm">No status data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Event Categories Distribution */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Event Categories</CardTitle>
                <CardDescription>Events by category</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(eventDistribution.categories).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(eventDistribution.categories).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <Badge className={getCategoryColor(category)}>
                          {getCategoryLabel(category)}
                        </Badge>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-sm">No event data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Current month overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-800">Income</span>
                    </div>
                    <span className="font-bold text-green-600">
                      {formatCurrency(financialSummary.income)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-red-600" />
                      <span className="text-sm text-red-800">Expenses</span>
                    </div>
                    <span className="font-bold text-red-600">
                      {formatCurrency(financialSummary.expenses)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-blue-800">Net</span>
                    </div>
                    <span
                      className={`font-bold ${financialSummary.net >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {formatCurrency(financialSummary.net)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {financialSummary.transactionCount} transactions this month
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Last Updated */}
          {overview.lastUpdated && (
            <p className="text-xs text-muted-foreground text-center mt-6">
              Last updated: {new Date(overview.lastUpdated).toLocaleString()}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;