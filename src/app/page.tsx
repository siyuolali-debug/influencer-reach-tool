import { BarChart2, Users, Mail, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Contacts',
      value: '1,248',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Emails Sent',
      value: '864',
      icon: Mail,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Response Rate',
      value: '42%',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Active Campaigns',
      value: '12',
      icon: BarChart2,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
        </div>
        <Button>Start New Campaign</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className={`p-2 rounded-full ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email sent to @username</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date().toLocaleString()}
                    </p>
                  </div>
                  <div className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-600">
                    Sent
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <p className="text-sm flex-1">Review campaign results</p>
                  <span className="text-xs text-muted-foreground">Today</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
