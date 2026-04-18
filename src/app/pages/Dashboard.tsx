import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Phone,
  Users,
  Radio,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../components/ui/button";
import { Link } from "react-router";

const stats = [
  {
    name: "Total Calls Today",
    value: "245,832",
    change: "+12.5%",
    icon: Phone,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    name: "Active Campaigns",
    value: "18",
    change: "+3",
    icon: Radio,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    name: "Total Contacts",
    value: "2.4M",
    change: "+8.2%",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    name: "Success Rate",
    value: "87.3%",
    change: "+2.1%",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
];

const callTrendData = [
  { date: "Apr 11", calls: 185000, successful: 162000 },
  { date: "Apr 12", calls: 198000, successful: 173000 },
  { date: "Apr 13", calls: 220000, successful: 192000 },
  { date: "Apr 14", calls: 210000, successful: 183000 },
  { date: "Apr 15", calls: 235000, successful: 205000 },
  { date: "Apr 16", calls: 242000, successful: 211000 },
  { date: "Apr 17", calls: 245832, successful: 214532 },
];

const campaignPerformance = [
  { name: "Voter Education", calls: 95000, answered: 83000, duration: 142 },
  { name: "Event Mobilization", calls: 67000, answered: 58000, duration: 98 },
  { name: "Poll Awareness", calls: 52000, answered: 45000, duration: 87 },
  { name: "Crisis Alert", calls: 31832, answered: 28532, duration: 65 },
];

const callStatusData = [
  { name: "Answered", value: 214532, color: "#10b981" },
  { name: "No Answer", value: 18300, color: "#f59e0b" },
  { name: "Failed", value: 13000, color: "#ef4444" },
];

const recentCampaigns = [
  {
    id: 1,
    name: "Voter Registration Drive - Phase 3",
    status: "active",
    calls: 45000,
    answered: 39200,
    startTime: "2 hours ago",
  },
  {
    id: 2,
    name: "Rally Invitation - Lusaka Province",
    status: "active",
    calls: 23500,
    answered: 20100,
    startTime: "4 hours ago",
  },
  {
    id: 3,
    name: "Policy Announcement - Healthcare",
    status: "completed",
    calls: 67000,
    answered: 58000,
    startTime: "Yesterday",
  },
  {
    id: 4,
    name: "Volunteer Mobilization",
    status: "scheduled",
    calls: 0,
    answered: 0,
    startTime: "Tomorrow at 9:00 AM",
  },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
           Voxis - Overview
          </p>
        </div>
        <Link to="/campaigns/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Radio className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Call Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Call Volume Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={callTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="calls"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Total Calls"
                />
                <Line
                  type="monotone"
                  dataKey="successful"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Successful"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Call Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Call Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={callStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {callStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="calls" fill="#3b82f6" name="Total Calls" />
              <Bar dataKey="answered" fill="#10b981" name="Answered" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Campaigns</CardTitle>
            <Link to="/campaigns">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      campaign.status === "active"
                        ? "bg-green-500"
                        : campaign.status === "completed"
                        ? "bg-gray-400"
                        : "bg-blue-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {campaign.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {campaign.status === "active" && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Started {campaign.startTime}
                        </span>
                      )}
                      {campaign.status === "completed" && (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Completed {campaign.startTime}
                        </span>
                      )}
                      {campaign.status === "scheduled" && (
                        <span className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Scheduled for {campaign.startTime}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {campaign.calls.toLocaleString()} calls
                  </p>
                  {campaign.answered > 0 && (
                    <p className="text-sm text-gray-500">
                      {((campaign.answered / campaign.calls) * 100).toFixed(1)}%
                      answered
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
