import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Upload,
  Users,
  Calendar,
  Radio,
  Settings,
  Save,
  Loader2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";

import {
  createCampaign,
  updateCampaign,
  getCampaignById,
  saveCampaignAsDraft,
  launchCampaign,
  type CreateCampaignPayload,
} from "../../services/campaign/campaignService";
import { getVoiceMessages } from "../../services/voice-library/voice-library.service";
import { getContactLists } from "../../services/contact/contactService";

const languagesList = ["English", "Bemba", "Nyanja", "Tonga", "Lozi", "Lunda"];

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [voiceMessages, setVoiceMessages] = useState<any[]>([]);
  const [contactLists, setContactLists] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    campaign_name: "",
    campaign_type: "Voter Education",
    description: "",
    message_type: "broadcast",
    voice_message_id: "",
    voice_message_name: "",
    languages: [] as string[],
    contact_list_id: "",
    contact_list_name: "",
    filter_province: "All Provinces",
    filter_age_group: "All Ages",
    schedule_type: "immediate",
    start_date: "",
    end_date: "",
    retry_attempts: 3,
    call_timeout: 30,
    caller_id: "Voxis System",
    record_calls: false,
    allow_opt_out: true,
    sms_followup: false,
    cost_per_call: 0.15,
    estimated_recipients: 0,
  });
  useEffect(() => {
    fetchCampaignDetails();
    fetchDropdownData();
  }, [id]);

  const fetchDropdownData = async () => {
    try {
      const [voiceRes, contactRes] = await Promise.all([
        getVoiceMessages(),
        getContactLists(),
      ]);

      const voiceData = Array.isArray(voiceRes)
        ? voiceRes
        : voiceRes?.data || [];
      const contactData = Array.isArray(contactRes)
        ? contactRes
        : contactRes?.data || [];

      setVoiceMessages(voiceData);
      setContactLists(contactData);
    } catch (error) {
      console.error("Failed to fetch dropdown data:", error);
    }
  };
  const fetchCampaignDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await getCampaignById(id);
      const campaign = response?.data;

      if (campaign) {
        setFormData({
          campaign_name: campaign.campaign_name || "",
          campaign_type: campaign.campaign_type || "education",
          description: campaign.description || "",
          message_type: campaign.message_type || "broadcast",
          voice_message_id: campaign.voice_message_id || "",
          voice_message_name: campaign.voice_message_name || "",
          languages: campaign.languages || [],
          contact_list_id: campaign.contact_list_id || "",
          contact_list_name: campaign.contact_list_name || "",
          filter_province: campaign.filter_province || "all",
          filter_age_group: campaign.filter_age_group || "all",
          schedule_type: campaign.schedule_type || "immediate",
          start_date: campaign.start_date
            ? campaign.start_date.slice(0, 16)
            : "",
          end_date: campaign.end_date ? campaign.end_date.slice(0, 16) : "",
          retry_attempts: campaign.retry_attempts || 3,
          call_timeout: campaign.call_timeout || 30,
          caller_id: campaign.caller_id || "",
          record_calls: campaign.record_calls || false,
          allow_opt_out: campaign.allow_opt_out ?? true,
          sms_followup: campaign.sms_followup || false,
          cost_per_call: campaign.cost_per_call || 0.15,
          estimated_recipients: campaign.estimated_recipients || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignDetails();
  }, [id]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLanguageToggle = (lang: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      languages: checked
        ? [...prev.languages, lang]
        : prev.languages.filter((item) => item !== lang),
    }));
  };

  const buildPayload = () => ({
    campaign_name: formData.campaign_name,
    campaign_type: formData.campaign_type, // "Voter Education"
    description: formData.description,
    message_type:
      formData.message_type === "broadcast"
        ? "Pre-recorded Broadcast"
        : "Interactive Voice Response",
    voice_message_id: formData.voice_message_id || null,
    languages: formData.languages,
    contact_list_id: formData.contact_list_id || null,
    filter_province: formData.filter_province || "All Provinces",
    filter_age_group: formData.filter_age_group || "All Ages",
    schedule_type:
      formData.schedule_type === "immediate"
        ? "Start Immediately"
        : "Schedule for Later",
    start_date: formData.start_date || null,
    end_date: formData.end_date || null,
    retry_attempts: Number(formData.retry_attempts),
    call_timeout: Number(formData.call_timeout),
    caller_id: formData.caller_id || "Voxis System",
    record_calls: formData.record_calls,
    allow_opt_out: formData.allow_opt_out,
    sms_followup: formData.sms_followup,
    cost_per_call: Number(formData.cost_per_call || 0.15),
  });
const buildDraftPayload = () => ({
  campaign_name: formData.campaign_name,
  campaign_type: formData.campaign_type,
  description: formData.description,
  languages: formData.languages,
  schedule_type:
    formData.schedule_type === "immediate"
      ? "Start Immediately"
      : "Schedule for Later",
  start_date: formData.start_date || null,
  end_date: formData.end_date || null,
});
 const handleSaveDraft = async () => {
  if (!formData.campaign_name.trim()) {
    alert("Campaign name is required");
    return;
  }

  try {
    setSubmitLoading(true);

    const draftPayload = buildDraftPayload();

    if (isEditMode && id) {
      await updateCampaign(id, {
        ...draftPayload,
        status: "draft",
      });
    } else {
      await saveCampaignAsDraft(draftPayload);
    }

    navigate("/campaigns");
  } catch (error) {
    console.error("Failed to save draft:", error);
    alert("Failed to save draft");
  } finally {
    setSubmitLoading(false);
  }
};

  const handleSubmit = async () => {
    if (!formData.campaign_name.trim()) {
      alert("Campaign name is required");
      return;
    }

    if (formData.languages.length === 0) {
      alert("Please select at least one language");
      return;
    }

    try {
      setSubmitLoading(true);

      if (isEditMode && id) {
        await updateCampaign(id, buildPayload());
        navigate("/campaigns");
      } else {
        const response = await createCampaign(buildPayload());
        const campaignId = response?.data?._id || response?.data?.id;

        if (campaignId) {
          await launchCampaign(campaignId);
        }

        navigate("/campaigns");
      }
    } catch (error) {
      console.error("Failed to save campaign:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const estimatedRecipients = useMemo(() => {
    if (formData.contact_list_id === "lusaka") return 450000;
    if (formData.contact_list_id === "copperbelt") return 380000;
    if (formData.contact_list_id === "youth") return 820000;
    if (formData.contact_list_id === "all") return 2400000;
    return 0;
  }, [formData.contact_list_id]);

  const estimatedCost = estimatedRecipients * Number(formData.cost_per_call || 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-gray-500">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        Loading campaign...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/campaigns">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            {isEditMode ? "Edit Campaign" : "Create New Campaign"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? "Update campaign details and settings"
              : "Configure and launch a voice broadcasting campaign"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Label>Campaign Name *</Label>
                <Input
                  value={formData.campaign_name}
                  onChange={(e) =>
                    handleChange("campaign_name", e.target.value)
                  }
                  placeholder="e.g., Voter Registration Drive - Phase 3"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Campaign Type *</Label>
                <Select
                  value={formData.campaign_type}
                  onValueChange={(value) =>
                    handleChange("campaign_type", value)
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Voter Education">Voter Education</SelectItem>
                    <SelectItem value="Event Mobilization">Event Mobilization</SelectItem>
                    <SelectItem value="Information Broadcast">Information Broadcast</SelectItem>
                    <SelectItem value="Survey/Poll">Survey/Poll</SelectItem>
                    <SelectItem value="Crisis Communication">Crisis Communication</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Brief description of this campaign..."
                  rows={3}
                  className="mt-1.5"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Voice Message Configuration
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <RadioGroup
                value={formData.message_type}
                onValueChange={(value) => handleChange("message_type", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="broadcast" id="broadcast" />
                  <Label htmlFor="broadcast">
                    Pre-recorded Voice Broadcast
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ivr" id="ivr" />
                  <Label htmlFor="ivr">Interactive Voice Response (IVR)</Label>
                </div>
              </RadioGroup>

              {formData.message_type === "broadcast" && (
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Select Voice Message *</Label>
                    <Select
                      value={formData.voice_message_id}
                      onValueChange={(value) => {
                        const selected = voiceMessages.find(
                          (item) => (item._id || item.id) === value
                        );

                        handleChange("voice_message_id", value);
                        handleChange("voice_message_name", selected?.message_name || "");
                      }}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Choose from library" />
                      </SelectTrigger>

                      <SelectContent>
                        {voiceMessages.map((voice) => {
                          const voiceId = voice._id || voice.id;

                          return (
                            <SelectItem key={voiceId} value={voiceId}>
                              {voice.message_name} {voice.lang ? `- ${voice.lang}` : ""}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Languages</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {languagesList.map((lang) => (
                        <div key={lang} className="flex items-center space-x-2">
                          <Checkbox
                            id={lang}
                            checked={formData.languages.includes(lang)}
                            onCheckedChange={(checked) =>
                              handleLanguageToggle(lang, Boolean(checked))
                            }
                          />
                          <Label htmlFor={lang} className="text-sm font-normal">
                            {lang}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Target Audience
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Label>Contact List *</Label>
                <Select
                  value={formData.contact_list_id}
                  onValueChange={(value) => {
                    const selected = contactLists.find(
                      (item) => (item._id || item.id) === value
                    );

                    handleChange("contact_list_id", value);
                    handleChange("contact_list_name", selected?.list_name || selected?.name || "");
                  }}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select contact list" />
                  </SelectTrigger>

                  <SelectContent>
                    {contactLists.map((list) => {
                      const listId = list._id || list.id;

                      return (
                        <SelectItem key={listId} value={listId}>
                          {list.list_name || list.name}
                          {list.total_contacts || list.contact_count
                            ? ` (${list.total_contacts || list.contact_count})`
                            : ""}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Filter by Province</Label>
                  <Select
                    value={formData.filter_province}
                    onValueChange={(value) =>
                      handleChange("filter_province", value)
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="All Provinces" />
                    </SelectTrigger>
                    <SelectContent>
                     <SelectItem value="All Provinces">All Provinces</SelectItem>
<SelectItem value="Lusaka">Lusaka</SelectItem>
<SelectItem value="Copperbelt">Copperbelt</SelectItem>
<SelectItem value="Southern">Southern</SelectItem>
<SelectItem value="Eastern">Eastern</SelectItem>
<SelectItem value="Western">Western</SelectItem>
<SelectItem value="Northern">Northern</SelectItem>
<SelectItem value="North-Western">North-Western</SelectItem>
<SelectItem value="Central">Central</SelectItem>
<SelectItem value="Luapula">Luapula</SelectItem>
<SelectItem value="Muchinga">Muchinga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Age Group</Label>
                  <Select
                    value={formData.filter_age_group}
                    onValueChange={(value) =>
                      handleChange("filter_age_group", value)
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="All Ages" />
                    </SelectTrigger>
                    <SelectContent>
                     <SelectItem value="All Ages">All Ages</SelectItem>
<SelectItem value="18-25 years">18-25 years</SelectItem>
<SelectItem value="26-35 years">26-35 years</SelectItem>
<SelectItem value="36-50 years">36-50 years</SelectItem>
<SelectItem value="51+ years">51+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Campaign Schedule
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <RadioGroup
                value={formData.schedule_type}
                onValueChange={(value) => handleChange("schedule_type", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="immediate" id="immediate" />
                  <Label htmlFor="immediate">Start Immediately</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="scheduled" id="scheduled" />
                  <Label htmlFor="scheduled">Schedule for Later</Label>
                </div>
              </RadioGroup>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => handleChange("start_date", e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>End Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => handleChange("end_date", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Advanced Settings
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Retry Attempts</Label>
                  <Select
                    value={String(formData.retry_attempts)}
                    onValueChange={(value) =>
                      handleChange("retry_attempts", Number(value))
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 attempt</SelectItem>
                      <SelectItem value="2">2 attempts</SelectItem>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Call Timeout (seconds)</Label>
                  <Input
                    type="number"
                    value={formData.call_timeout}
                    onChange={(e) =>
                      handleChange("call_timeout", Number(e.target.value))
                    }
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label>Caller ID Display</Label>
                <Input
                  value={formData.caller_id}
                  onChange={(e) => handleChange("caller_id", e.target.value)}
                  placeholder="e.g., Voxis System"
                  className="mt-1.5"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.record_calls}
                    onCheckedChange={(checked) =>
                      handleChange("record_calls", Boolean(checked))
                    }
                  />
                  <Label className="text-sm font-normal">
                    Record calls for quality assurance
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.allow_opt_out}
                    onCheckedChange={(checked) =>
                      handleChange("allow_opt_out", Boolean(checked))
                    }
                  />
                  <Label className="text-sm font-normal">
                    Allow recipients to opt-out
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.sms_followup}
                    onCheckedChange={(checked) =>
                      handleChange("sms_followup", Boolean(checked))
                    }
                  />
                  <Label className="text-sm font-normal">
                    Send SMS follow-up to answered calls
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={submitLoading}
              onClick={handleSubmit}
            >
              {submitLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Radio className="w-4 h-4 mr-2" />
              )}
              {isEditMode ? "Update Campaign" : "Launch Campaign"}
            </Button>

            <Button
              variant="outline"
              className="flex-1"
              disabled={submitLoading}
              onClick={handleSaveDraft}
            >
              {submitLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save as Draft
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Campaign Type</p>
                <p className="font-medium text-gray-900 mt-1">
                  {formData.campaign_type}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Message Type</p>
                <p className="font-medium text-gray-900 mt-1">
                  {formData.message_type === "broadcast"
                    ? "Pre-recorded Broadcast"
                    : "Interactive IVR"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Target Audience</p>
                <p className="font-medium text-gray-900 mt-1">
                  {estimatedRecipients.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">recipients</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">Estimated Cost</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  K {estimatedCost.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  K {formData.cost_per_call} per call
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}