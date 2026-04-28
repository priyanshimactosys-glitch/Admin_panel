import { useEffect, useMemo, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
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

import {
  getCampaigns,
  launchCampaign,
  pauseCampaign,
  changeCampaignStatus,
  deleteCampaign,
  type CampaignItem,
} from "../../services/campaign/campaignService";
import ConfirmDialog from "../components/common/ConfirmDialog";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CampaignItem | null>(null);
  const navigate = useNavigate();

  const fetchCampaigns = async () => {
    try {
      setLoading(true);

      const response = await getCampaigns({
        page: 1,
        limit: 100,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: searchQuery || undefined,
      });

      setCampaigns(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCampaigns();
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const name = campaign.campaign_name || "";
      const status = campaign.status || "";

      const matchesSearch = name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchQuery, statusFilter]);

  const getCampaignId = (campaign: CampaignItem) => {
    return campaign._id || campaign.id;
  };

  const getLanguageText = (languages?: string[]) => {
    if (!languages || languages.length === 0) return "N/A";
    return languages.join(", ");
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "paused":
        return "bg-yellow-100 text-yellow-700";
      case "draft":
        return "bg-purple-100 text-purple-700";
      case "cancelled":
      case "stopped":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleLaunch = async (campaign: CampaignItem) => {
    const id = getCampaignId(campaign);
    if (!id) return;

    try {
      setActionLoadingId(id);
      await launchCampaign(id);
      await fetchCampaigns();
    } catch (error) {
      console.error("Failed to launch campaign:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePause = async (campaign: CampaignItem) => {
    const id = getCampaignId(campaign);
    if (!id) return;

    try {
      setActionLoadingId(id);
      await pauseCampaign(id);
      await fetchCampaigns();
    } catch (error) {
      console.error("Failed to pause campaign:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleStop = async (campaign: CampaignItem) => {
    const id = getCampaignId(campaign);
    if (!id) return;

    try {
      setActionLoadingId(id);
      await changeCampaignStatus(id, "completed");
      await fetchCampaigns();
    } catch (error) {
      console.error("Failed to stop campaign:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const id = getCampaignId(deleteTarget);
    if (!id) return;

    try {
      setActionLoadingId(id);
      await deleteCampaign(id);
      setDeleteTarget(null);
      await fetchCampaigns();
    } catch (error) {
      console.error("Failed to delete campaign:", error);
    } finally {
      setActionLoadingId(null);
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
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns ({filteredCampaigns.length})</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Loading campaigns...
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              No campaigns found.
            </div>
          ) : (
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
                  {filteredCampaigns.map((campaign) => {
                    const campaignId = getCampaignId(campaign);
                    const status = campaign.status?.toLowerCase() || "";
                    const isActionLoading = actionLoadingId === campaignId;

                    const totalCalls = campaign.total_calls || 0;
                    const answeredCalls = campaign.answered_calls || 0;
                    const progress = campaign.progress || 0;
                    const successRate =
                      campaign.success_rate ??
                      (totalCalls > 0
                        ? Number(((answeredCalls / totalCalls) * 100).toFixed(1))
                        : 0);

                    return (
                      <tr
                        key={campaignId}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {campaign.campaign_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {campaign.campaign_type || "N/A"} •{" "}
                              {getLanguageText(campaign.languages)}
                            </p>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <Badge
                            className={`${getStatusColor(
                              campaign.status
                            )} capitalize`}
                          >
                            {campaign.status || "N/A"}
                          </Badge>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-24">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">
                              {progress}%
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">
                              {totalCalls.toLocaleString()}
                            </p>
                            <p className="text-gray-500">
                              {answeredCalls.toLocaleString()} answered
                            </p>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <p className="text-sm font-medium text-gray-900">
                            {successRate}%
                          </p>
                        </td>

                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <p className="text-gray-900">
                              {/* {formatDate(campaign.start_date)}
                            </p>
                            <p className="text-gray-500">
                              {formatDate(campaign.end_date)} */}
                              {campaign.schedule_type}
                            </p>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {status === "active" && (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isActionLoading}
                                onClick={() => handlePause(campaign)}
                              >
                                {isActionLoading ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Pause className="w-3 h-3" />
                                )}
                              </Button>
                            )}

                            {(status === "paused" ||
                              status === "scheduled" ||
                              status === "draft") && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={isActionLoading}
                                  onClick={() => handleLaunch(campaign)}
                                >
                                  {isActionLoading ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Play className="w-3 h-3" />
                                  )}
                                </Button>
                              )}

                            {(status === "active" || status === "paused") && (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isActionLoading}
                                onClick={() => handleStop(campaign)}
                              >
                                {isActionLoading ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Square className="w-3 h-3" />
                                )}
                              </Button>
                            )}

                            <div className="relative inline-block">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setOpenActionId(openActionId === campaignId ? null : campaignId)
                                }
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>

                              {openActionId === campaignId && (
                                <div className="relative inline-block">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setOpenActionId(openActionId === campaignId ? null : campaignId)
                                    }
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>

                                  {openActionId === campaignId && (
                                    <div className="absolute right-0 top-9 z-[99999] w-40 rounded-lg border border-gray-200 bg-white shadow-xl">
                                      <button
                                        type="button"
                                        className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => {
                                          setOpenActionId(null);
                                          navigate(`/campaigns/view/${campaignId}`);
                                        }}
                                      >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Details
                                      </button>

                                      {!["active", "completed"].includes(status) ? (
                                        <button
                                          type="button"
                                          className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                          onClick={() => {
                                            setOpenActionId(null);
                                            navigate(`/campaigns/edit/${campaignId}`);
                                          }}
                                        >
                                          <Edit className="w-4 h-4 mr-2" />
                                          Edit
                                        </button>
                                      ) : (
                                        <div
                                          className="flex w-full items-center px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                                          title="Active or completed campaigns cannot be edited"
                                        >
                                          <Edit className="w-4 h-4 mr-2" />
                                          Edit
                                        </div>
                                      )}

                                      <button
                                        type="button"
                                        className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                        onClick={() => {
                                          setOpenActionId(null);
                                          setDeleteTarget(campaign);
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Campaign?"
        description={`Are you sure you want to delete "${deleteTarget?.campaign_name || "this campaign"
          }"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
        loading={Boolean(actionLoadingId)}
        onConfirm={handleDelete}
      />
    </div>
  );
}