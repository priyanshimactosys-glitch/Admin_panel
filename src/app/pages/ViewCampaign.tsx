import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Edit,
  Loader2,
  Radio,
  Users,
  Calendar,
  Settings,
  Phone,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

import {
  getCampaignById,
  type CampaignItem,
} from "../../services/campaign/campaignService";

export default function ViewCampaign() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<CampaignItem | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCampaign = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await getCampaignById(id);
      setCampaign(response?.data || null);
    } catch (error) {
      console.error("Failed to fetch campaign:", error);
      setCampaign(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const status = campaign?.status?.toLowerCase() || "";
  const canEdit = !["active", "completed"].includes(status);

  const getStatusColor = (status?: string) => {
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
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "N/A";

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "N/A";

    return parsed.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const successRate = useMemo(() => {
    const totalCalls = campaign?.total_calls || 0;
    const answeredCalls = campaign?.answered_calls || 0;

    if (campaign?.success_rate !== undefined) return campaign.success_rate;
    if (!totalCalls) return 0;

    return Number(((answeredCalls / totalCalls) * 100).toFixed(1));
  }, [campaign]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-gray-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading campaign details...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-6">
        <Link to="/campaigns">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>

        <div className="mt-10 text-center text-gray-500">
          Campaign not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/campaigns">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-gray-900">
                {campaign.campaign_name}
              </h1>

              <Badge className={`${getStatusColor(campaign.status)} capitalize`}>
                {campaign.status || "N/A"}
              </Badge>
            </div>

            <p className="mt-1 text-gray-600">
              {campaign.campaign_type || "N/A"}
            </p>
          </div>
        </div>

        <Button
          disabled={!canEdit}
          onClick={() => navigate(`/campaigns/edit/${campaign._id || campaign.id}`)}
          className="bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          title={
            canEdit
              ? "Edit campaign"
              : "Active or completed campaigns cannot be edited"
          }
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Total Calls</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {(campaign.total_calls || 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Answered</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {(campaign.answered_calls || 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Success Rate</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {successRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Progress</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {campaign.progress || 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5" />
                Campaign Information
              </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Info label="Campaign Name" value={campaign.campaign_name} />
              <Info label="Campaign Type" value={campaign.campaign_type} />
              <Info label="Message Type" value={campaign.message_type} />
              <Info
                label="Languages"
                value={
                  campaign.languages?.length
                    ? campaign.languages.join(", ")
                    : "N/A"
                }
              />
              <Info
                label="Voice Message"
                value={campaign.voice_message_name || campaign.voice_message_id || "N/A"}
              />
              <Info label="Caller ID" value={campaign.caller_id || "N/A"} />

              <div className="md:col-span-2">
                <Info
                  label="Description"
                  value={campaign.description || "N/A"}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Target Audience
              </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Info
                label="Contact List"
                value={campaign.contact_list_name || campaign.contact_list_id || "N/A"}
              />
              <Info
                label="Estimated Recipients"
                value={(campaign.estimated_recipients || 0).toLocaleString()}
              />
              <Info
                label="Province"
                value={campaign.filter_province || "All Provinces"}
              />
              <Info
                label="Age Group"
                value={campaign.filter_age_group || "All Ages"}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Call Performance
              </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <Info
                label="Failed"
                value={(campaign.failed || 0).toLocaleString()}
              />
              <Info
                label="No Answer"
                value={(campaign.no_answer || 0).toLocaleString()}
              />
              <Info label="Busy" value={(campaign.busy || 0).toLocaleString()} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Info label="Schedule Type" value={campaign.schedule_type || "N/A"} />
              <Info label="Start Date" value={formatDate(campaign.start_date)} />
              <Info label="End Date" value={formatDate(campaign.end_date)} />
              <Info label="Launched At" value={formatDate(campaign.launched_at)} />
              <Info
                label="Completed At"
                value={formatDate(campaign.completed_at)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Info
                label="Retry Attempts"
                value={`${campaign.retry_attempts || 0}`}
              />
              <Info
                label="Call Timeout"
                value={`${campaign.call_timeout || 0} seconds`}
              />
              <Info
                label="Record Calls"
                value={campaign.record_calls ? "Yes" : "No"}
              />
              <Info
                label="Allow Opt-out"
                value={campaign.allow_opt_out ? "Yes" : "No"}
              />
              <Info
                label="SMS Follow-up"
                value={campaign.sms_followup ? "Yes" : "No"}
              />
              <Info
                label="Cost Per Call"
                value={`K ${campaign.cost_per_call || 0}`}
              />
              <Info
                label="Estimated Cost"
                value={`K ${(campaign.estimated_cost || 0).toLocaleString()}`}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 font-medium text-gray-900">{value || "N/A"}</p>
    </div>
  );
}