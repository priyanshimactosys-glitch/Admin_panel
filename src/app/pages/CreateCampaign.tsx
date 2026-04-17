import { useState } from "react";
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
  ArrowLeft,
  Upload,
  Users,
  Calendar,
  Radio,
  Settings,
  Save,
} from "lucide-react";
import { Link } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function CreateCampaign() {
  const [campaignType, setCampaignType] = useState("broadcast");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/campaigns">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Create New Campaign
          </h1>
          <p className="text-gray-600 mt-1">
            Configure and launch a voice broadcasting campaign
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="campaign-name">Campaign Name *</Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g., Voter Registration Drive - Phase 3"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="campaign-type">Campaign Type *</Label>
                <Select defaultValue="education">
                  <SelectTrigger id="campaign-type" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">Voter Education</SelectItem>
                    <SelectItem value="mobilization">
                      Event Mobilization
                    </SelectItem>
                    <SelectItem value="information">
                      Information Broadcast
                    </SelectItem>
                    <SelectItem value="survey">Survey/Poll</SelectItem>
                    <SelectItem value="crisis">Crisis Communication</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of this campaign..."
                  rows={3}
                  className="mt-1.5"
                />
              </div>
            </CardContent>
          </Card>

          {/* Voice Message */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Voice Message Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={campaignType}
                onValueChange={setCampaignType}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="broadcast" id="broadcast" />
                  <Label htmlFor="broadcast">
                    Pre-recorded Voice Broadcast
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ivr" id="ivr" />
                  <Label htmlFor="ivr">
                    Interactive Voice Response (IVR)
                  </Label>
                </div>
              </RadioGroup>

              {campaignType === "broadcast" && (
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="voice-file">Select Voice Message *</Label>
                    <Select>
                      <SelectTrigger id="voice-file" className="mt-1.5">
                        <SelectValue placeholder="Choose from library or upload new" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="msg1">
                          Voter Registration - English
                        </SelectItem>
                        <SelectItem value="msg2">
                          Voter Registration - Bemba
                        </SelectItem>
                        <SelectItem value="msg3">
                          Rally Invitation - Nyanja
                        </SelectItem>
                        <SelectItem value="upload">
                          + Upload New Message
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Languages</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {["English", "Bemba", "Nyanja", "Tonga", "Lozi", "Lunda"].map(
                        (lang) => (
                          <div key={lang} className="flex items-center space-x-2">
                            <Checkbox id={lang} />
                            <Label
                              htmlFor={lang}
                              className="text-sm font-normal"
                            >
                              {lang}
                            </Label>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {campaignType === "ivr" && (
                <div className="space-y-4 mt-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      IVR campaigns allow recipients to interact with options
                      using their keypad. Configure your IVR flow in the next
                      step.
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Configure IVR Flow
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Target Audience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Target Audience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contact-list">Contact List *</Label>
                <Select>
                  <SelectTrigger id="contact-list" className="mt-1.5">
                    <SelectValue placeholder="Select contact list" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All Contacts (2.4M)
                    </SelectItem>
                    <SelectItem value="lusaka">
                      Lusaka Province (450K)
                    </SelectItem>
                    <SelectItem value="copperbelt">
                      Copperbelt Province (380K)
                    </SelectItem>
                    <SelectItem value="youth">
                      Youth Segment (18-35 years) (820K)
                    </SelectItem>
                    <SelectItem value="custom">
                      + Create Custom Segment
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="province">Filter by Province</Label>
                  <Select>
                    <SelectTrigger id="province" className="mt-1.5">
                      <SelectValue placeholder="All Provinces" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Provinces</SelectItem>
                      <SelectItem value="lusaka">Lusaka</SelectItem>
                      <SelectItem value="copperbelt">Copperbelt</SelectItem>
                      <SelectItem value="southern">Southern</SelectItem>
                      <SelectItem value="eastern">Eastern</SelectItem>
                      <SelectItem value="western">Western</SelectItem>
                      <SelectItem value="northern">Northern</SelectItem>
                      <SelectItem value="northwestern">
                        North-Western
                      </SelectItem>
                      <SelectItem value="central">Central</SelectItem>
                      <SelectItem value="luapula">Luapula</SelectItem>
                      <SelectItem value="muchinga">Muchinga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="age-group">Age Group</Label>
                  <Select>
                    <SelectTrigger id="age-group" className="mt-1.5">
                      <SelectValue placeholder="All Ages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ages</SelectItem>
                      <SelectItem value="18-25">18-25 years</SelectItem>
                      <SelectItem value="26-35">26-35 years</SelectItem>
                      <SelectItem value="36-50">36-50 years</SelectItem>
                      <SelectItem value="51+">51+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Estimated Recipients
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Based on selected filters
                    </p>
                  </div>
                  <p className="text-2xl font-semibold text-blue-600">
                    450,000
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Campaign Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup defaultValue="immediate">
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
                  <Label htmlFor="start-date">Start Date & Time</Label>
                  <Input
                    id="start-date"
                    type="datetime-local"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date & Time (Optional)</Label>
                  <Input
                    id="end-date"
                    type="datetime-local"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
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
                  <Label htmlFor="retry-attempts">Retry Attempts</Label>
                  <Select defaultValue="3">
                    <SelectTrigger id="retry-attempts" className="mt-1.5">
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
                  <Label htmlFor="call-timeout">Call Timeout (seconds)</Label>
                  <Input
                    id="call-timeout"
                    type="number"
                    defaultValue="30"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="caller-id">Caller ID Display</Label>
                <Input
                  id="caller-id"
                  placeholder="e.g., Voxis System"
                  className="mt-1.5"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="record-calls" />
                  <Label htmlFor="record-calls" className="text-sm font-normal">
                    Record calls for quality assurance
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="opt-out" defaultChecked />
                  <Label htmlFor="opt-out" className="text-sm font-normal">
                    Allow recipients to opt-out
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sms-followup" />
                  <Label htmlFor="sms-followup" className="text-sm font-normal">
                    Send SMS follow-up to answered calls
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Radio className="w-4 h-4 mr-2" />
              Launch Campaign
            </Button>
            <Button variant="outline" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
          </div>
        </div>

        {/* Sidebar - Campaign Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Campaign Type</p>
                <p className="font-medium text-gray-900 mt-1">
                  Voter Education
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Message Type</p>
                <p className="font-medium text-gray-900 mt-1">
                  {campaignType === "broadcast"
                    ? "Pre-recorded Broadcast"
                    : "Interactive IVR"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Target Audience</p>
                <p className="font-medium text-gray-900 mt-1">450,000</p>
                <p className="text-xs text-gray-500 mt-0.5">recipients</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Duration</p>
                <p className="font-medium text-gray-900 mt-1">~8 hours</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Based on call volume
                </p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">Estimated Cost</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  K 67,500
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  K 0.15 per call
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pre-launch Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-600" />
                </div>
                <span className="text-sm text-gray-700">
                  Campaign name set
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                </div>
                <span className="text-sm text-gray-700">
                  Voice message selected
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                </div>
                <span className="text-sm text-gray-700">
                  Target audience defined
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                </div>
                <span className="text-sm text-gray-700">Schedule configured</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
