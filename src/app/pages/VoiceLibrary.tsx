/// <reference types="vite/client" />
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Search,
  Upload,
  Play,
  Pause,
  Download,
  Trash2,
  Mic,
  Clock,
  Languages,
  MoreVertical,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { toast } from "react-hot-toast";
import { getVoiceMessages, deleteVoiceMessage, uploadVoiceMessage, VoiceMessageItem } from "../../services/voice-library/voice-library.service";


type UploadFormState = {
  message_name: string;
  language: string;
  category: string;
  description: string;
  audio_file: File | null;
};

const initialForm: UploadFormState = {
  message_name: "",
  language: "",
  category: "",
  description: "",
  audio_file: null,
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatBytes = (bytes?: number) => {
  if (!bytes || Number.isNaN(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getAudioSrc = (message: VoiceMessageItem) => {
  return (
    message.audio_url ||
    message.file_url ||
    message.audio_file ||
    ""
  );
};

export default function VoiceLibrary() {
  const [messages, setMessages] = useState<VoiceMessageItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<number | string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);

  const [form, setForm] = useState<UploadFormState>(initialForm);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await getVoiceMessages();
      const list = response?.data || [];
      setMessages(list);
    } catch (error) {
      console.error("GET voice messages error:", error);
      toast.error("Failed to fetch voice messages");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, []);
console.log('==>messages',messages)
  const filteredMessages = useMemo(() => {
    return messages.filter((message) =>
      (message.message_name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [messages, searchQuery]);
console.log('==>filteredMessages',filteredMessages)
  const handlePlayPause = (id: number | string) => {
    setPlayingId((prev) => (prev === id ? null : id));
  };

  const handleChange = (
    key: keyof UploadFormState,
    value: string | File | null
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
  };

  const handleUpload = async () => {
    if (!form.message_name.trim()) {
      toast.error("Message name is required");
      return;
    }

    if (!form.language.trim()) {
      toast.error("Language is required");
      return;
    }

    if (!form.category.trim()) {
      toast.error("Category is required");
      return;
    }

    if (!form.audio_file) {
      toast.error("Audio file is required");
      return;
    }

    try {
      setUploading(true);

      await uploadVoiceMessage({
        message_name: form.message_name,
        lang: form.language,
        category: form.category,
        description: form.description,
        audio_file: form.audio_file,
      });

      toast.success("Voice message uploaded successfully");
      setIsDialogOpen(false);
      resetForm();
      fetchMessages();
    } catch (error) {
      console.error("POST voice message error:", error);
      toast.error("Failed to upload voice message");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      setDeletingId(id);
      await deleteVoiceMessage(id);
      toast.success("Voice message deleted");
      fetchMessages();
    } catch (error) {
      console.error("DELETE voice message error:", error);
      toast.error("Failed to delete voice message");
    } finally {
      setDeletingId(null);
    }
  };

  const totalMessages = messages.length;

  const totalLanguages = new Set(
    messages.map((item) => (item.lang || "").trim()).filter(Boolean)
  ).size;

  const totalStorage = messages.reduce((sum, item) => {
    const raw = item.size || "";
    const lower = raw.toLowerCase().trim();

    if (lower.endsWith("kb")) {
      return sum + parseFloat(lower.replace("kb", "").trim()) / 1024;
    }
    if (lower.endsWith("mb")) {
      return sum + parseFloat(lower.replace("mb", "").trim());
    }
    return sum;
  }, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Voice Message Library
          </h1>
          <p className="text-gray-600 mt-1">
            Manage pre-recorded voice messages for campaigns
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload Message
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload Voice Message</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="message-name">Message Name *</Label>
                <Input
                  id="message-name"
                  placeholder="e.g., Voter Registration - English"
                  className="mt-1.5"
                  value={form.message_name}
                  onChange={(e) =>
                    handleChange("message_name", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="language">Language *</Label>
                <Select
                  value={form.language}
                  onValueChange={(value) => handleChange("language", value)}
                >
                  <SelectTrigger id="language" className="mt-1.5">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="bemba">Bemba</SelectItem>
                    <SelectItem value="nyanja">Nyanja</SelectItem>
                    <SelectItem value="tonga">Tonga</SelectItem>
                    <SelectItem value="lozi">Lozi</SelectItem>
                    <SelectItem value="lunda">Lunda</SelectItem>
                    <SelectItem value="multiple">Multiple Languages</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => handleChange("category", value)}
                >
                  <SelectTrigger id="category" className="mt-1.5">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alert">Alert</SelectItem>
                    <SelectItem value="education">Voter Education</SelectItem>
                    <SelectItem value="mobilization">
                      Event Mobilization
                    </SelectItem>
                    <SelectItem value="information">Information</SelectItem>
                    <SelectItem value="survey">Survey/Poll</SelectItem>
                    <SelectItem value="crisis">
                      Crisis Communication
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description..."
                  rows={3}
                  className="mt-1.5"
                  value={form.description}
                  onChange={(e) =>
                    handleChange("description", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="file-upload">Audio File *</Label>
                <div className="mt-1.5 flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 text-center">
                        <span className="font-semibold">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        MP3, WAV, or OGG
                      </p>
                      {form.audio_file && (
                        <p className="text-xs text-blue-600 mt-2 font-medium">
                          {form.audio_file.name}
                        </p>
                      )}
                    </div>

                    <input
                      id="file-upload"
                      type="file"
                      accept=".mp3,.wav,.ogg,audio/*"
                      className="hidden"
                      onChange={(e) =>
                        handleChange(
                          "audio_file",
                          e.target.files?.[0] || null
                        )
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handleUpload}
                  disabled={uploading}
                  type="button"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="flex-1"
                  type="button"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  disabled={uploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search voice messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {totalMessages}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Mic className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Languages</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {totalLanguages}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Languages className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Duration</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  --
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {totalStorage.toFixed(1)} MB
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Upload className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-gray-500">
            No voice messages found
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMessages.map((message, index) => {
            const itemId = message._id || message.id || index;
            const audioSrc = getAudioSrc(message);

            return (
              <Card key={itemId} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {message.message_name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(message.created_date || message.uploadDate)}
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          {/* <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button> */}
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          {audioSrc ? (
                            <DropdownMenuItem asChild>
                              <a href={audioSrc} download>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </a>
                            </DropdownMenuItem>
                          ) : null}

                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(itemId)}
                            disabled={deletingId === itemId}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {deletingId === itemId ? "Deleting..." : "Delete"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePlayPause(itemId)}
                          className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={!message?.audio_file}
                        >
                          {playingId === itemId ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </Button>

                        <div className="flex-1">
                          {message?.audio_file ? (
                            <audio
                              controls
                              className="w-full"
                              src={import.meta.env.VITE_REACT_UPLOAD_URL + "/" + message.audio_file}
                              preload="none"
                            />
                          ) : (
                            <p className="text-xs text-gray-500">
                              Audio preview not available
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm gap-3">
                        <span className="text-gray-600">Language:</span>
                        <Badge variant="secondary">{message.lang}</Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm gap-3">
                        <span className="text-gray-600">Category:</span>
                        <span className="text-gray-900 capitalize">
                          {message.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm gap-3">
                        <span className="text-gray-600">File Size:</span>
                        <span className="text-gray-900">
                          {message.file_size || "-"}
                        </span>
                      </div>

                      {/* <div className="flex items-center justify-between text-sm gap-3">
                        <span className="text-gray-600">Status:</span>
                        <span className="text-gray-900 capitalize">
                          {message.status || "active"}
                        </span>
                      </div> */}
                    </div>

                    {message.description ? (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {message.description}
                      </p>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}