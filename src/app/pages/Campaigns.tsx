import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Search,
  Filter,
  Radio,
  Play,
  Pause,
  Square,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
} from "lucide-react";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const campaigns = [
  {
    id: 1,
    name: "Voter Registration Drive - Phase 3",
    status: "active",
    type: "Voter Education",
    language: "English, Bemba",
    totalCalls: 45000,
    answered: 39200,
    failed: 3800,
    pending: 2000,
    startDate: "Apr 17, 2026 08:00",
    endDate: "Apr 17, 2026 18:00",
    progress: 87,
  },
  {
    id: 2,
    name: "Rally Invitation - Lusaka Province",
    status: "active",
    type: "Event Mobilization",
    language: "Nyanja, English",
    totalCalls: 23500,
    answered: 20100,
    failed: 1400,
    pending: 2000,
    startDate: "Apr 17, 2026 06:00",
    endDate: "Apr 17, 2026 16:00",
    progress: 91,
  },
  {
    id: 3,
    name: "Policy Announcement - Healthcare",
    status: "completed",
    type: "Information",
    language: "English, Tonga",
    totalCalls: 67000,
    answered: 58000,
    failed: 9000,
    pending: 0,
    startDate: "Apr 16, 2026 09:00",
    endDate: "Apr 16, 2026 19:00",
    progress: 100,
  },
  {
    id: 4,
    name: "Volunteer Mobilization - Copperbelt",
    status: "scheduled",
    type: "Mobilization",
    language: "Bemba",
    totalCalls: 15000,
    answered: 0,
    failed: 0,
    pending: 15000,
    startDate: "Apr 18, 2026 09:00",
    endDate: "Apr 18, 2026 17:00",
    progress: 0,
  },
  {
    id: 5,
    name: "Poll Awareness - Nationwide",
    status: "paused",
    type: "Voter Education",
    language: "All Languages",
    totalCalls: 150000,
    answered: 95000,
    failed: 8000,
    pending: 47000,
    startDate: "Apr 15, 2026 07:00",
    endDate: "Apr 20, 2026 20:00",
    progress: 63,
  },
  {
    id: 6,
    name: "Youth Engagement Initiative",
    status: "completed",
    type: "Survey",
    language: "English, Nyanja",
    totalCalls: 32000,
    answered: 27500,
    failed: 4500,
    pending: 0,
    startDate: "Apr 14, 2026 10:00",
    endDate: "Apr 14, 2026 18:00",
    progress: 100,
  },
];

export default function Campaigns() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "paused":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Campaign Management
          </h1>
          <p className="text-gray-600 mt-1">
            Create, monitor, and manage voice broadcasting campaigns
          </p>
        </div>
        <Link to="/campaigns/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Radio className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Campaigns ({filteredCampaigns.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Campaign
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Progress
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Calls
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Success Rate
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Schedule
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {campaign.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {campaign.type} • {campaign.language}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        className={`${getStatusColor(
                          campaign.status
                        )} capitalize`}
                      >
                        {campaign.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-24">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${campaign.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {campaign.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {campaign.totalCalls.toLocaleString()}
                        </p>
                        <p className="text-gray-500">
                          {campaign.answered.toLocaleString()} answered
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-medium text-gray-900">
                        {campaign.totalCalls > 0
                          ? (
                              (campaign.answered / campaign.totalCalls) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{campaign.startDate}</p>
                        <p className="text-gray-500">{campaign.endDate}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {campaign.status === "active" && (
                          <Button variant="outline" size="sm">
                            <Pause className="w-3 h-3" />
                          </Button>
                        )}
                        {campaign.status === "paused" && (
                          <Button variant="outline" size="sm">
                            <Play className="w-3 h-3" />
                          </Button>
                        )}
                        {campaign.status === "scheduled" && (
                          <Button variant="outline" size="sm">
                            <Play className="w-3 h-3" />
                          </Button>
                        )}
                        {(campaign.status === "active" ||
                          campaign.status === "paused") && (
                          <Button variant="outline" size="sm">
                            <Square className="w-3 h-3" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Export Report
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
