import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Settings as SettingsIcon,
  Globe,
  Save,
} from "lucide-react";

import {
  getSettings,
  updateSettings,
  SettingsData,
} from "../../services/settings/settingsService";

const initialSettings: SettingsData = {
  system_name: "",
  organization: "",
  timezone: "Central Africa Time (CAT)",
  default_language: "English",
  date_format: "DD/MM/YYYY",
  country: "Zambia",
  currency: "ZMW (Zambian Kwacha)",
  default_caller_id: "Voxis System",
  default_retry_attempts: 3,
  default_call_timeout: 30,
  cost_per_call: 0.15,
  email_notifications: true,
  sms_notifications: false,
  notify_on_complete: true,
  notify_on_fail: true,
};

export default function Settings() {
  const [formData, setFormData] = useState<SettingsData>(initialSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await getSettings();

      if (res?.data) {
        setFormData({
          system_name: res.data.system_name || "",
          organization: res.data.organization || "",
          timezone: res.data.timezone || "Central Africa Time (CAT)",
          default_language: res.data.default_language || "English",
          date_format: res.data.date_format || "DD/MM/YYYY",
          country: res.data.country || "Zambia",
          currency: res.data.currency || "ZMW (Zambian Kwacha)",
          default_caller_id: res.data.default_caller_id || "Voxis System",
          default_retry_attempts: res.data.default_retry_attempts || 3,
          default_call_timeout: res.data.default_call_timeout || 30,
          cost_per_call: res.data.cost_per_call || 0.15,
          email_notifications: Boolean(res.data.email_notifications),
          sms_notifications: Boolean(res.data.sms_notifications),
          notify_on_complete: Boolean(res.data.notify_on_complete),
          notify_on_fail: Boolean(res.data.notify_on_fail),
        });
      }
    } catch (error) {
      console.error("Get Settings Error:", error);
      alert("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: keyof SettingsData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateSettings({
        system_name: formData.system_name,
        organization: formData.organization,
        timezone: formData.timezone,
        default_language: formData.default_language,
        date_format: formData.date_format,
        country: formData.country,
        currency: formData.currency,
        default_caller_id: formData.default_caller_id,
        default_retry_attempts: Number(formData.default_retry_attempts),
        default_call_timeout: Number(formData.default_call_timeout),
        cost_per_call: Number(formData.cost_per_call),
        email_notifications: formData.email_notifications,
        sms_notifications: formData.sms_notifications,
        notify_on_complete: formData.notify_on_complete,
        notify_on_fail: formData.notify_on_fail,
      });

      alert("Settings updated successfully");
      fetchSettings();
    } catch (error) {
      console.error("Update Settings Error:", error);
      alert("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure system preferences and settings
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving || loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading settings...</p>
      ) : (
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="calling">Calling</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {/* <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger> */}
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  General Settings
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="system-name">System Name</Label>
                  <Input
                    id="system-name"
                    value={formData.system_name}
                    onChange={(e) =>
                      handleChange("system_name", e.target.value)
                    }
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) =>
                      handleChange("organization", e.target.value)
                    }
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="timezone">Time Zone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => handleChange("timezone", value)}
                  >
                    <SelectTrigger id="timezone" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Central Africa Time (CAT)">
                        Central Africa Time (CAT)
                      </SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="East Africa Time (EAT)">
                        East Africa Time (EAT)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Default Language</Label>
                  <Select
                    value={formData.default_language}
                    onValueChange={(value) =>
                      handleChange("default_language", value)
                    }
                  >
                    <SelectTrigger id="language" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Bemba">Bemba</SelectItem>
                      <SelectItem value="Nyanja">Nyanja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select
                    value={formData.date_format}
                    onValueChange={(value) =>
                      handleChange("date_format", value)
                    }
                  >
                    <SelectTrigger id="date-format" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Regional Settings
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleChange("country", value)}
                  >
                    <SelectTrigger id="country" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zambia">Zambia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleChange("currency", value)}
                  >
                    <SelectTrigger id="currency" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ZMW (Zambian Kwacha)">
                        ZMW (Zambian Kwacha)
                      </SelectItem>
                      <SelectItem value="USD (US Dollar)">
                        USD (US Dollar)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calling" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Call Configuration</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="caller-id">Default Caller ID</Label>
                  <Input
                    id="caller-id"
                    value={formData.default_caller_id}
                    onChange={(e) =>
                      handleChange("default_caller_id", e.target.value)
                    }
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="retry-attempts">
                    Default Retry Attempts
                  </Label>
                  <Select
                    value={String(formData.default_retry_attempts)}
                    onValueChange={(value) =>
                      handleChange("default_retry_attempts", Number(value))
                    }
                  >
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
                    value={formData.default_call_timeout}
                    onChange={(e) =>
                      handleChange(
                        "default_call_timeout",
                        Number(e.target.value)
                      )
                    }
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="cost-per-call">Cost Per Call</Label>
                  <Input
                    id="cost-per-call"
                    type="number"
                    step="0.01"
                    value={formData.cost_per_call}
                    onChange={(e) =>
                      handleChange("cost_per_call", Number(e.target.value))
                    }
                    className="mt-1.5"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Enable email notifications
                    </p>
                  </div>
                  <Switch
                    checked={formData.email_notifications}
                    onCheckedChange={(checked) =>
                      handleChange("email_notifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Enable SMS notifications
                    </p>
                  </div>
                  <Switch
                    checked={formData.sms_notifications}
                    onCheckedChange={(checked) =>
                      handleChange("sms_notifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notify On Complete</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Notify when campaign completes
                    </p>
                  </div>
                  <Switch
                    checked={formData.notify_on_complete}
                    onCheckedChange={(checked) =>
                      handleChange("notify_on_complete", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notify On Fail</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Notify when campaign fails
                    </p>
                  </div>
                  <Switch
                    checked={formData.notify_on_fail}
                    onCheckedChange={(checked) =>
                      handleChange("notify_on_fail", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}