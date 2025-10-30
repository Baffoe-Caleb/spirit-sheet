import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Calendar, Users } from "lucide-react";

const Reports = () => {
  const reportData = [
    {
      month: "January",
      avgAttendance: 245,
      services: 12,
      newMembers: 8,
    },
    {
      month: "February",
      avgAttendance: 238,
      services: 11,
      newMembers: 6,
    },
    {
      month: "March",
      avgAttendance: 252,
      services: 13,
      newMembers: 12,
    },
    {
      month: "April",
      avgAttendance: 248,
      services: 12,
      newMembers: 5,
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Attendance Reports</h1>
        <p className="text-muted-foreground">View detailed attendance analytics and trends</p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Attendance
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">246</div>
            <p className="text-xs text-secondary font-medium mt-1">+5% from last quarter</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Services
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">48</div>
            <p className="text-xs text-secondary font-medium mt-1">This quarter</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New Members
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">31</div>
            <p className="text-xs text-secondary font-medium mt-1">This quarter</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Attendance Rate
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">76%</div>
            <p className="text-xs text-secondary font-medium mt-1">+3% from last quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Monthly Breakdown</CardTitle>
          <CardDescription>Detailed attendance statistics by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.map((data, index) => (
              <div key={index} className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-foreground">{data.month}</p>
                  <p className="text-sm text-muted-foreground">{data.services} services</p>
                </div>
                <div className="flex gap-8 text-right">
                  <div>
                    <p className="font-bold text-lg text-primary">{data.avgAttendance}</p>
                    <p className="text-xs text-muted-foreground">Avg. Attendance</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-secondary">{data.newMembers}</p>
                    <p className="text-xs text-muted-foreground">New Members</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
