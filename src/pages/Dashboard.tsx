import { Users, Calendar, CheckCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/reducers";
import CategoryList from "@/components/CategoryList";

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const stats = [
    {
      title: "Total Members",
      value: "248",
      description: "Active members",
      icon: Users,
      trend: "+12 this month",
    },
    {
      title: "This Week",
      value: "187",
      description: "Attendees",
      icon: CheckCircle,
      trend: "75% attendance",
    },
    {
      title: "Services",
      value: "3",
      description: "This week",
      icon: Calendar,
      trend: "Sunday & Midweek",
    },
    {
      title: "Growth",
      value: "+8%",
      description: "vs last month",
      icon: TrendingUp,
      trend: "Positive trend",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.firstName || user?.username}</p>
        <button>Click me </button>
      </div>
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground mb-1">{stat.description}</p>
              <p className="text-xs text-secondary font-medium">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Record Attendance
            </CardTitle>
            <CardDescription>Mark attendance for today's service</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/attendance">
              <Button className="w-full">Start Recording</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Manage Members
            </CardTitle>
            <CardDescription>View and manage church members</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/members">
              <Button variant="outline" className="w-full">
                View Members
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Groups
            </CardTitle>
            <CardDescription>Organize ministry groups</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/groups">
              <Button variant="outline" className="w-full">
                View Groups
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              View Reports
            </CardTitle>
            <CardDescription>Check attendance history and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Category List Component */}
      <div className="mt-8">
        <CategoryList />
      </div>

      {/* Recent Activity */}
      <Card className="mt-8 shadow-soft">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { service: "Sunday Morning Service", date: "Today", count: 187 },
              { service: "Wednesday Bible Study", date: "2 days ago", count: 94 },
              { service: "Sunday Evening Service", date: "3 days ago", count: 132 },
            ].map((record, index) => (
              <div key={index} className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-foreground">{record.service}</p>
                  <p className="text-sm text-muted-foreground">{record.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-primary">{record.count}</p>
                  <p className="text-xs text-muted-foreground">attendees</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
