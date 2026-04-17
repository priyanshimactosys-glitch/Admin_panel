import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
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

const voiceMessages = [
  {
    id: 1,
    name: "Voter Registration - English",
    language: "English",
    duration: "45s",
    size: "1.2 MB",
    uploadDate: "Apr 15, 2026",
    category: "Voter Education",
    usageCount: 12,
    status: "active",
  },
  {
    id: 2,
    name: "Voter Registration - Bemba",
    language: "Bemba",
    duration: "48s",
    size: "1.3 MB",
    uploadDate: "Apr 15, 2026",
    category: "Voter Education",
    usageCount: 8,
    status: "active",
  },
  {
    id: 3,
    name: "Rally Invitation - Nyanja",
    language: "Nyanja",
    duration: "32s",
    size: "890 KB",
    uploadDate: "Apr 14, 2026",
    category: "Event Mobilization",
    usageCount: 5,
    status: "active",
  },
  {
    id: 4,
    name: "Healthcare Policy Announcement",
    language: "English",
    duration: "1m 25s",
    size: "2.1 MB",
    uploadDate: "Apr 13, 2026",
    category: "Information",
    usageCount: 3,
    status: "active",
  },
  {
    id: 5,
    name: "Youth Engagement Survey - Tonga",
    language: "Tonga",
    duration: "52s",
    size: "1.4 MB",
    uploadDate: "Apr 12, 2026",
    category: "Survey",
    usageCount: 2,
    status: "active",
  },
  {
    id: 6,
    name: "Poll Awareness - Multilingual",
    language: "Multiple",
    duration: "38s",
    size: "1.0 MB",
    uploadDate: "Apr 10, 2026",
    category: "Voter Education",
    usageCount: 15,
    status: "active",
  },
];

export default function VoiceLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<number | null>(null);

  const filteredMessages = voiceMessages.filter((message) =>
    message.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlayPause = (id: number) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Voice Message Library
          </h1>
          <p className="text-gray-600 mt-1">
            Manage pre-recorded voice messages for campaigns
          </p>
        </div>
        <Dialog>
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
                />
              </div>
              <div>
                <Label htmlFor="language">Language *</Label>
                <Select>
                  <SelectTrigger id="language" className="mt-1.5">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
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
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category" className="mt-1.5">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
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
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        MP3, WAV, or OGG (MAX. 10MB)
                      </p>
                    </div>
                    <input id="file-upload" type="file" className="hidden" />
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Upload
                </Button>
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search voice messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {voiceMessages.length}
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
                <p className="text-2xl font-semibold text-gray-900 mt-2">6</p>
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
                  6m 40s
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
                  8.8 MB
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Upload className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voice Messages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMessages.map((message) => (
          <Card key={message.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {message.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {message.uploadDate}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Audio Player */}
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePlayPause(message.id)}
                      className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {playingId === message.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <div className="h-1 bg-gray-300 rounded-full">
                        <div
                          className="h-1 bg-blue-600 rounded-full"
                          style={{
                            width: playingId === message.id ? "45%" : "0%",
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-600">
                          {playingId === message.id ? "0:12" : "0:00"}
                        </span>
                        <span className="text-xs text-gray-600">
                          {message.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Language:</span>
                    <Badge variant="secondary">{message.language}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="text-gray-900">{message.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">File Size:</span>
                    <span className="text-gray-900">{message.size}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Used in:</span>
                    <span className="text-gray-900">
                      {message.usageCount} campaigns
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
