import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Download, Calendar, TrendingUp, Phone, CheckCircle, XCircle, Clock } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";

import {
  getAnalyticsSummary,
  getCallVolumeTrend,
  getLanguageDistribution,
  getProvincePerformance,
  getCallOutcomesBreakdown,
  AnalyticsSummaryData,
  CallTrendItem,
  LanguageDistributionItem,
  ProvincePerformanceItem,
  CallOutcomeItem
} from "../../services/analytics/analytics.service";

export default function Analytics() {
  const [days, setDays] = useState<string>("7");
  const [summary, setSummary] = useState<AnalyticsSummaryData | null>(null);
  const [trend, setTrend] = useState<CallTrendItem[]>([]);
  const [languages, setLanguages] = useState<LanguageDistributionItem[]>([]);
  const [provinces, setProvinces] = useState<ProvincePerformanceItem[]>([]);
  const [outcomes, setOutcomes] = useState<CallOutcomeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const params = { days };
        const [resSum, resTrend, resLang, resProv, resOut] = await Promise.all([
          getAnalyticsSummary(params),
          getCallVolumeTrend(params),
          getLanguageDistribution(params),
          getProvincePerformance(params),
          getCallOutcomesBreakdown(params),
        ]);

        setSummary(resSum.data);
        setTrend(resTrend.data);
        setLanguages(resLang.data);
        setProvinces(resProv.data);
        setOutcomes(resOut.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [days]);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (loading && !summary) return <div className="p-10 text-center">Loading Analytics...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Analytics & Reporting</h1>
          <p className="text-gray-600 mt-1">Live performance metrics for the last {days} days</p>
        </div>
        <div className="flex gap-2">
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Today</SelectItem>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title={`Total Calls (${days}d)`} value={summary?.total_calls.toLocaleString()} icon={<Phone className="text-blue-600" />} bgColor="bg-blue-100" />
        <MetricCard title="Answered Calls" value={summary?.answered_calls.toLocaleString()} icon={<CheckCircle className="text-green-600" />} bgColor="bg-green-100" />
        <MetricCard title="Success Rate" value={`${summary?.success_rate}%`} icon={<TrendingUp className="text-purple-600" />} bgColor="bg-purple-100" />
        <MetricCard title="Avg. Duration" value={`${summary?.avg_call_duration}s`} icon={<Clock className="text-orange-600" />} bgColor="bg-orange-100" />
      </div>

      {/* Call Volume Trends */}
      <Card>
        <CardHeader><CardTitle>Call Volume Trends</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" /> {/* Backend sends date in _id */}
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="total_calls" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} name="Total Calls" />
              <Area type="monotone" dataKey="answered" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="Answered" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Province Performance */}
        <Card>
          <CardHeader><CardTitle>Performance by Province</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={provinces}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_calls" fill="#3b82f6" name="Calls" />
                <Bar dataKey="answered" fill="#10b981" name="Answered" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Language Distribution */}
        <Card>
          <CardHeader><CardTitle>Language Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={languages} cx="50%" cy="50%" label={({ _id, percentage }) => `${_id}`} outerRadius={80} dataKey="total_calls" nameKey="_id">
                  {languages.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Call Outcomes Table */}
      <Card>
        <CardHeader><CardTitle>Call Outcomes Breakdown</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm font-medium text-gray-700">
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4 text-right">Count</th>
                <th className="py-3 px-4 text-right">Percentage</th>
                <th className="py-3 px-4">Progress</th>
              </tr>
            </thead>
            <tbody>
              {outcomes.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium">{item.outcome}</td>
                  <td className="py-4 px-4 text-right">{item.count.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right">{item.percentage}%</td>
                  <td className="py-4 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Component for Metric Cards
function MetricCard({ title, value, icon, bgColor }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{value || "0"}</p>
          </div>
          <div className={`${bgColor} p-3 rounded-lg`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}