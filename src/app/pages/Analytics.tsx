import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  Calendar,
  TrendingUp,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const dailyCallData = [
  { date: "Apr 11", total: 185000, answered: 162000, failed: 23000 },
  { date: "Apr 12", total: 198000, answered: 173000, failed: 25000 },
  { date: "Apr 13", total: 220000, answered: 192000, failed: 28000 },
  { date: "Apr 14", total: 210000, answered: 183000, failed: 27000 },
  { date: "Apr 15", total: 235000, answered: 205000, failed: 30000 },
  { date: "Apr 16", total: 242000, answered: 211000, failed: 31000 },
  { date: "Apr 17", total: 245832, answered: 214532, failed: 31300 },
];

const hourlyDistribution = [
  { hour: "6 AM", calls: 12500 },
  { hour: "8 AM", calls: 28000 },
  { hour: "10 AM", calls: 42000 },
  { hour: "12 PM", calls: 38000 },
  { hour: "2 PM", calls: 45000 },
  { hour: "4 PM", calls: 52000 },
  { hour: "6 PM", calls: 28000 },
];

const provincePerformance = [
  { province: "Lusaka", calls: 67000, answered: 58000, rate: 86.6 },
  { province: "Copperbelt", calls: 52000, answered: 45000, rate: 86.5 },
  { province: "Southern", calls: 38000, answered: 32500, rate: 85.5 },
  { province: "Eastern", calls: 28000, answered: 24000, rate: 85.7 },
  { province: "Western", calls: 22000, answered: 18500, rate: 84.1 },
  { province: "Northern", calls: 18500, answered: 15800, rate: 85.4 },
];

const languageDistribution = [
  { name: "English", value: 38, color: "#3b82f6" },
  { name: "Bemba", value: 28, color: "#10b981" },
  { name: "Nyanja", value: 18, color: "#f59e0b" },
  { name: "Tonga", value: 10, color: "#ef4444" },
  { name: "Others", value: 6, color: "#8b5cf6" },
];

const callOutcomes = [
  { outcome: "Answered", count: 214532, percentage: 87.3 },
  { outcome: "No Answer", count: 18300, percentage: 7.4 },
  { outcome: "Busy", count: 8500, percentage: 3.5 },
  { outcome: "Failed", count: 4500, percentage: 1.8 },
];

export default function Analytics() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Analytics & Reporting
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="7days">
            <SelectTrigger className="w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Calls (7 days)</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  1.54M
                </p>
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +18.2%
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Answered Calls</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  1.34M
                </p>
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +15.8%
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  87.3%
                </p>
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +2.1%
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Call Duration</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  42s
                </p>
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +5s
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call Volume Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Call Volume Trends (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={dailyCallData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAnswered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorTotal)"
                name="Total Calls"
              />
              <Area
                type="monotone"
                dataKey="answered"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorAnswered)"
                name="Answered"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Call Times (Today)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#3b82f6" name="Calls" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Language Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Language Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={languageDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {languageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Province Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Province</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={provincePerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="province" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="calls" fill="#3b82f6" name="Total Calls" />
              <Bar dataKey="answered" fill="#10b981" name="Answered" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Call Outcomes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Call Outcomes Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Outcome
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                    Count
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                    Percentage
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody>
                {callOutcomes.map((outcome, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {outcome.outcome === "Answered" && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        {outcome.outcome === "No Answer" && (
                          <XCircle className="w-5 h-5 text-orange-600" />
                        )}
                        {outcome.outcome === "Busy" && (
                          <Phone className="w-5 h-5 text-yellow-600" />
                        )}
                        {outcome.outcome === "Failed" && (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-medium text-gray-900">
                          {outcome.outcome}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-medium text-gray-900">
                        {outcome.count.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-medium text-gray-900">
                        {outcome.percentage}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                          <div
                            className={`h-2 rounded-full ${
                              outcome.outcome === "Answered"
                                ? "bg-green-600"
                                : outcome.outcome === "No Answer"
                                ? "bg-orange-600"
                                : outcome.outcome === "Busy"
                                ? "bg-yellow-600"
                                : "bg-red-600"
                            }`}
                            style={{ width: `${outcome.percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
