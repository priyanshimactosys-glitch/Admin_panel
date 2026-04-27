import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Phone,
  Users,
  Radio,
  TrendingUp,
  Clock,
  CheckCircle,
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
import { getDashboard } from "../../services/dashboard/dashboardService";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getDashboard  ();
      setDashboard(res?.data);
    } catch (error) {
      console.error("Dashboard API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboard();
  }, []);

  const statsData = dashboard?.stats || {
    total_calls_today: 0,
    active_campaigns: 0,
    total_contacts: 0,
    success_rate: 0,
  };

  const stats = [
    {
      name: "Total Calls Today",
      value: statsData.total_calls_today?.toLocaleString() || "0",
      change: "",
      icon: Phone,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Active Campaigns",
      value: statsData.active_campaigns?.toLocaleString() || "0",
      change: "",
      icon: Radio,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "Total Contacts",
      value: statsData.total_contacts?.toLocaleString() || "0",
      change: "",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      name: "Success Rate",
      value: `${statsData.success_rate || 0}%`,
      change: "",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const recentCampaigns = dashboard?.recent_campaigns || [];
  const topPerformance = dashboard?.top_performance || [];

  const callStatusData = useMemo(
    () => [
      {
        name: "Success",
        value: statsData.success_rate || 0,
        color: "#10b981",
      },
      {
        name: "Remaining",
        value: Math.max(100 - (statsData.success_rate || 0), 0),
        color: "#e5e7eb",
      },
    ],
    [statsData.success_rate]
  );

  const callTrendData = [
    {
      date: "Today",
      calls: statsData.total_calls_today || 0,
      successful:
        ((statsData.total_calls_today || 0) * (statsData.success_rate || 0)) /
        100,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Voxis - Overview</p>
        </div>

        <Link to="/campaigns/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Radio className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading dashboard...</p>
      ) : (
        <>
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
                    </div>

                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Call Volume Trends</CardTitle>
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

            <Card>
              <CardHeader>
                <CardTitle>Success Rate</CardTitle>
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

          <Card>
            <CardHeader>
              <CardTitle>Top Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {topPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="calls" fill="#3b82f6" name="Total Calls" />
                    <Bar dataKey="answered" fill="#10b981" name="Answered" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-gray-500">
                  No top performance data found.
                </p>
              )}
            </CardContent>
          </Card>

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
              {recentCampaigns.length > 0 ? (
                <div className="space-y-4">
                  {recentCampaigns.map((campaign: any, index: number) => (
                    <div
                      key={campaign.id || campaign._id || index}
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
                            {campaign.campaign_name || campaign.title || "Untitled"}
                          </p>

                          <p className="text-sm text-gray-500">
                            {campaign.status === "active" && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Active
                              </span>
                            )}

                            {campaign.status === "completed" && (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Completed
                              </span>
                            )}

                            {campaign.status !== "active" &&
                              campaign.status !== "completed" && (
                                <span className="flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {campaign.status || "Scheduled"}
                                </span>
                              )}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {(campaign.total_calls || 0).toLocaleString()} calls
                        </p>

                        {campaign.answered_calls > 0 && campaign.total_calls > 0 && (
                          <p className="text-sm text-gray-500">
                            {(
                              (campaign.answered_calls / campaign.total_calls) *
                              100
                            ).toFixed(1)}
                            % answered
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No recent campaigns found.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}