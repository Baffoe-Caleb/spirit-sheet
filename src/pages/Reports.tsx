// src/pages/Reports.tsx

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Download,
  RefreshCw,
  Loader2,
  PieChart,
  Activity,
  UserPlus,
  Clock,
  CheckCircle,
  DollarSign,
  FileText,
  Filter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/redux/reducers";
import {
  fetchDashboardAnalyticsRequest,
  setActiveReportTab,
  resetReportOperation,
} from "@/redux/actions/reportActions";

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
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

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    default: "bg-gray-100 text-gray-800",
  };
  return colors[status] || colors.default;
};

const parseGrowthRate = (growthString: string) => {
  const num = parseFloat(growthString?.replace("%", "") || "0");
  return isNaN(num) ? 0 : num;
};

// ============================================
// COMPONENT
// ============================================

const Reports = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Redux state - using dashboardAnalytics from the same endpoint as Dashboard
  const {
    dashboardAnalytics,
    isLoadingDashboard,
    activeTab,
    error,
  } = useSelector((state: RootState) => state.reports);

  // ============================================
  // EFFECTS
  // ============================================

  // Fetch dashboard analytics on mount (same endpoint as Dashboard)
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

  // ============================================
  // HANDLERS
  // ============================================

  const handleTabChange = (tab: string) => {
    dispatch(setActiveReportTab(tab));
  };

  const handleRefresh = () => {
    dispatch(fetchDashboardAnalyticsRequest());
  };

  const handleExport = (reportType: string) => {
    // For now, show a toast - actual export would need backend implementation
    toast({
      title: "Export Started",
      description: `Exporting ${reportType} report...`,
    });
  };

  // ============================================
  // DATA EXTRACTION
  // ============================================

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

  // Calculate attendance stats from charts data
  const totalAttendanceFromTrend = charts.attendanceTrend?.reduce(
    (sum, day) => sum + day.attendance,
    0
  ) || 0;

  const averageAttendance = charts.attendanceTrend?.length > 0
    ? Math.round(totalAttendanceFromTrend / charts.attendanceTrend.length)
    : 0;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            View detailed analytics and insights
          </p>
        </div>
        <div className="flex gap-2">
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
      </div>

      {/* Loading State */}
      {isLoadingDashboard && !dashboardAnalytics ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading reports...</span>
        </div>
      ) : (
        <>
          {/* Summary Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Members
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {overview.totalMembers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {overview.activeMembers.toLocaleString()} active
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {growthRate >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span
                    className={`text-xs font-medium ${growthRate >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {overview.memberGrowth} growth
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Check-ins
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {overview.totalCheckIns.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="text-blue-600">
                    {overview.memberCheckIns} members
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-green-600">
                    {overview.guestCheckIns} guests
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Events
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {overview.totalEvents}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                <p className="text-xs text-secondary font-medium mt-1">
                  {overview.upcomingEvents} upcoming
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  New Members
                </CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {overview.newMembers}
                </div>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  +{overview.newMembers} added
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Report Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Quick Reports */}
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Quick Reports</CardTitle>
                    <CardDescription>
                      Generate common reports quickly
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Attendance Summary</p>
                          <p className="text-sm text-muted-foreground">
                            {overview.totalCheckIns} check-ins recorded
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport("attendance_summary")}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <PieChart className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Member Demographics</p>
                          <p className="text-sm text-muted-foreground">
                            {overview.totalMembers} total members
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport("member_demographics")}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Growth Report</p>
                          <p className="text-sm text-muted-foreground">
                            {overview.memberGrowth} growth rate
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport("member_growth")}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Calendar className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">Events Summary</p>
                          <p className="text-sm text-muted-foreground">
                            {overview.totalEvents} events held
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport("events_summary")}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Metrics */}
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Key Metrics</CardTitle>
                    <CardDescription>Important statistics at a glance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Member Activity Rate */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Member Activity Rate</span>
                        <span className="text-sm text-muted-foreground">
                          {overview.totalMembers > 0
                            ? Math.round(
                              (overview.activeMembers / overview.totalMembers) * 100
                            )
                            : 0}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          overview.totalMembers > 0
                            ? (overview.activeMembers / overview.totalMembers) * 100
                            : 0
                        }
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {overview.activeMembers} of {overview.totalMembers} members
                        active
                      </p>
                    </div>

                    {/* Check-in Distribution */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Member Check-ins</span>
                        <span className="text-sm text-muted-foreground">
                          {overview.totalCheckIns > 0
                            ? Math.round(
                              (overview.memberCheckIns / overview.totalCheckIns) * 100
                            )
                            : 0}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          overview.totalCheckIns > 0
                            ? (overview.memberCheckIns / overview.totalCheckIns) * 100
                            : 0
                        }
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {overview.memberCheckIns} members, {overview.guestCheckIns}{" "}
                        guests
                      </p>
                    </div>

                    {/* Financial Health */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Financial Health</span>
                        <span
                          className={`text-sm font-medium ${financialSummary.net >= 0
                              ? "text-green-600"
                              : "text-red-600"
                            }`}
                        >
                          {formatCurrency(financialSummary.net)}
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs">
                        <span className="text-green-600">
                          Income: {formatCurrency(financialSummary.income)}
                        </span>
                        <span className="text-red-600">
                          Expenses: {formatCurrency(financialSummary.expenses)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Attendance Summary */}
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Attendance Summary</CardTitle>
                    <CardDescription>Last 30 days overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {overview.totalCheckIns}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Total Check-ins
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {averageAttendance}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Daily Average
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span>Members</span>
                          </div>
                          <span className="font-medium">
                            {overview.memberCheckIns}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4 text-green-600" />
                            <span>Guests</span>
                          </div>
                          <span className="font-medium">
                            {overview.guestCheckIns}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-600" />
                            <span>Events Held</span>
                          </div>
                          <span className="font-medium">{overview.totalEvents}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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
                          const maxAttendance = Math.max(
                            ...charts.attendanceTrend.map((d) => d.attendance)
                          );
                          const percentage =
                            maxAttendance > 0
                              ? (day.attendance / maxAttendance) * 100
                              : 0;

                          return (
                            <div key={index} className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground w-24">
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
                        <p className="text-lg font-medium">No trend data</p>
                        <p className="text-sm">
                          Attendance trend will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Event Attendance */}
                <Card className="shadow-soft md:col-span-2">
                  <CardHeader>
                    <CardTitle>Top Events by Attendance</CardTitle>
                    <CardDescription>
                      Events with highest attendance in the last 30 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {charts.eventAttendance?.length > 0 ? (
                      <div className="space-y-4">
                        {charts.eventAttendance.map((event, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium">{event.eventName}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatDate(event.eventDate)}</span>
                                  <Badge
                                    className={getCategoryColor(event.eventCategory)}
                                  >
                                    {getCategoryLabel(event.eventCategory)}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                {event.attendanceCount}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                attendees
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <Calendar className="h-12 w-12 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No event data</p>
                        <p className="text-sm">
                          Event attendance will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Member Overview */}
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Member Overview</CardTitle>
                    <CardDescription>Current membership statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {overview.totalMembers}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Total Members
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {overview.activeMembers}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Active Members
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-purple-800">
                              New This Month
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Recently joined members
                            </p>
                          </div>
                          <p className="text-3xl font-bold text-purple-600">
                            +{overview.newMembers}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Growth Rate</p>
                            <p className="text-sm text-muted-foreground">
                              Compared to last month
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {growthRate >= 0 ? (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-600" />
                            )}
                            <span
                              className={`text-2xl font-bold ${growthRate >= 0 ? "text-green-600" : "text-red-600"
                                }`}
                            >
                              {overview.memberGrowth}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Member Status Distribution */}
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Status Distribution</CardTitle>
                    <CardDescription>Members by membership status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {Object.keys(memberDistribution.statuses).length > 0 ? (
                      <div className="space-y-4">
                        {Object.entries(memberDistribution.statuses).map(
                          ([status, count]) => {
                            const percentage =
                              overview.totalMembers > 0
                                ? Math.round((count / overview.totalMembers) * 100)
                                : 0;

                            return (
                              <div key={status}>
                                <div className="flex justify-between mb-1">
                                  <Badge className={getStatusColor(status)}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </Badge>
                                  <span className="text-sm font-medium">
                                    {count} ({percentage}%)
                                  </span>
                                </div>
                                <Progress value={percentage} className="h-2" />
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <PieChart className="h-12 w-12 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No status data</p>
                        <p className="text-sm">
                          Status distribution will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Member Growth Trend */}
                <Card className="shadow-soft md:col-span-2">
                  <CardHeader>
                    <CardTitle>Member Growth Trend</CardTitle>
                    <CardDescription>
                      New members over the last 6 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {charts.memberGrowthTrend?.length > 0 ? (
                      <div className="space-y-3">
                        {charts.memberGrowthTrend.map((month, index) => {
                          const maxMembers = Math.max(
                            ...charts.memberGrowthTrend.map((m) => m.newMembers)
                          );
                          const percentage =
                            maxMembers > 0
                              ? (month.newMembers / maxMembers) * 100
                              : 0;

                          return (
                            <div key={index} className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground w-24">
                                {month.month}
                              </span>
                              <div className="flex-1">
                                <Progress value={percentage} className="h-3" />
                              </div>
                              <span className="text-sm font-medium w-16 text-right">
                                +{month.newMembers} new
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <TrendingUp className="h-12 w-12 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No growth data</p>
                        <p className="text-sm">
                          Growth trend will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Group Distribution */}
                {Object.keys(memberDistribution.groups).length > 0 && (
                  <Card className="shadow-soft md:col-span-2">
                    <CardHeader>
                      <CardTitle>Group Distribution</CardTitle>
                      <CardDescription>Members by group</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(memberDistribution.groups).map(
                          ([group, count]) => (
                            <div
                              key={group}
                              className="p-4 border rounded-lg text-center"
                            >
                              <p className="text-2xl font-bold text-primary">
                                {count}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {group}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Events Overview */}
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Events Overview</CardTitle>
                    <CardDescription>Event statistics for the period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {overview.totalEvents}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Events Held
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {overview.upcomingEvents}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Upcoming
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-purple-800">
                              Total Attendance
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Across all events
                            </p>
                          </div>
                          <p className="text-3xl font-bold text-purple-600">
                            {overview.totalCheckIns}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Average per Event</p>
                            <p className="text-sm text-muted-foreground">
                              Mean attendance
                            </p>
                          </div>
                          <p className="text-2xl font-bold text-primary">
                            {overview.totalEvents > 0
                              ? Math.round(
                                overview.totalCheckIns / overview.totalEvents
                              )
                              : 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Event Categories */}
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Event Categories</CardTitle>
                    <CardDescription>Distribution by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {Object.keys(eventDistribution.categories).length > 0 ? (
                      <div className="space-y-4">
                        {Object.entries(eventDistribution.categories).map(
                          ([category, count]) => {
                            const percentage =
                              overview.totalEvents > 0
                                ? Math.round((count / overview.totalEvents) * 100)
                                : 0;

                            return (
                              <div key={category}>
                                <div className="flex justify-between mb-1">
                                  <Badge className={getCategoryColor(category)}>
                                    {getCategoryLabel(category)}
                                  </Badge>
                                  <span className="text-sm font-medium">
                                    {count} ({percentage}%)
                                  </span>
                                </div>
                                <Progress value={percentage} className="h-2" />
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <Calendar className="h-12 w-12 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No category data</p>
                        <p className="text-sm">
                          Event categories will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Financial Summary */}
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                    <CardDescription>Current month overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-800">
                              Income
                            </span>
                          </div>
                          <span className="text-2xl font-bold text-green-600">
                            {formatCurrency(financialSummary.income)}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 bg-red-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-red-600" />
                            <span className="font-medium text-red-800">
                              Expenses
                            </span>
                          </div>
                          <span className="text-2xl font-bold text-red-600">
                            {formatCurrency(financialSummary.expenses)}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-blue-800">
                              Net
                            </span>
                          </div>
                          <span
                            className={`text-2xl font-bold ${financialSummary.net >= 0
                                ? "text-green-600"
                                : "text-red-600"
                              }`}
                          >
                            {formatCurrency(financialSummary.net)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Total Transactions
                          </span>
                          <span className="font-medium">
                            {financialSummary.transactionCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Health */}
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Financial Health</CardTitle>
                    <CardDescription>Key financial indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Income vs Expenses */}
                      <div>
                        <p className="text-sm font-medium mb-2">
                          Income vs Expenses Ratio
                        </p>
                        {financialSummary.expenses > 0 ? (
                          <>
                            <Progress
                              value={
                                (financialSummary.income /
                                  (financialSummary.income +
                                    financialSummary.expenses)) *
                                100
                              }
                              className="h-4"
                            />
                            <div className="flex justify-between text-xs mt-1">
                              <span className="text-green-600">
                                Income:{" "}
                                {Math.round(
                                  (financialSummary.income /
                                    (financialSummary.income +
                                      financialSummary.expenses)) *
                                  100
                                )}
                                %
                              </span>
                              <span className="text-red-600">
                                Expenses:{" "}
                                {Math.round(
                                  (financialSummary.expenses /
                                    (financialSummary.income +
                                      financialSummary.expenses)) *
                                  100
                                )}
                                %
                              </span>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No expense data to compare
                          </p>
                        )}
                      </div>

                      {/* Status Indicator */}
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {financialSummary.net >= 0 ? (
                            <>
                              <div className="p-2 bg-green-100 rounded-full">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-green-800">
                                  Positive Balance
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Income exceeds expenses
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="p-2 bg-red-100 rounded-full">
                                <TrendingDown className="h-6 w-6 text-red-600" />
                              </div>
                              <div>
                                <p className="font-medium text-red-800">
                                  Negative Balance
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Expenses exceed income
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

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

export default Reports;