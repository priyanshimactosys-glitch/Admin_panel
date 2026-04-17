import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Search,
  Upload,
  Download,
  Users,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const contactLists = [
  {
    id: 1,
    name: "All Zambian Citizens",
    count: 2400000,
    lastUpdated: "Apr 17, 2026",
    status: "active",
    source: "National Database",
  },
  {
    id: 2,
    name: "Lusaka Province",
    count: 450000,
    lastUpdated: "Apr 17, 2026",
    status: "active",
    source: "Regional Filter",
  },
  {
    id: 3,
    name: "Copperbelt Province",
    count: 380000,
    lastUpdated: "Apr 17, 2026",
    status: "active",
    source: "Regional Filter",
  },
  {
    id: 4,
    name: "Youth Segment (18-35)",
    count: 820000,
    lastUpdated: "Apr 16, 2026",
    status: "active",
    source: "Age Filter",
  },
  {
    id: 5,
    name: "First-Time Voters",
    count: 185000,
    lastUpdated: "Apr 15, 2026",
    status: "active",
    source: "Custom Segment",
  },
  {
    id: 6,
    name: "Rally Attendees - March",
    count: 52000,
    lastUpdated: "Apr 10, 2026",
    status: "active",
    source: "Event Import",
  },
];

const recentContacts = [
  {
    id: 1,
    phone: "+260 97 123 4567",
    name: "John Mwanza",
    province: "Lusaka",
    age: 32,
    status: "active",
    lastContact: "Apr 17, 2026",
  },
  {
    id: 2,
    phone: "+260 96 234 5678",
    name: "Grace Banda",
    province: "Copperbelt",
    age: 28,
    status: "active",
    lastContact: "Apr 17, 2026",
  },
  {
    id: 3,
    phone: "+260 95 345 6789",
    name: "Peter Phiri",
    province: "Southern",
    age: 45,
    status: "active",
    lastContact: "Apr 16, 2026",
  },
  {
    id: 4,
    phone: "+260 97 456 7890",
    name: "Mary Tembo",
    province: "Eastern",
    age: 35,
    status: "opted-out",
    lastContact: "Apr 15, 2026",
  },
  {
    id: 5,
    phone: "+260 96 567 8901",
    name: "Joseph Kabwe",
    province: "Western",
    age: 52,
    status: "active",
    lastContact: "Apr 14, 2026",
  },
];

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("lists");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Contact Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage contact lists and audience segments
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Import Contacts</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="import-source">Import Source</Label>
                  <Select>
                    <SelectTrigger id="import-source" className="mt-1.5">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV File</SelectItem>
                      <SelectItem value="excel">Excel File</SelectItem>
                      <SelectItem value="database">Database Integration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="file-import">File Upload</Label>
                  <div className="mt-1.5 flex items-center justify-center w-full">
                    <label
                      htmlFor="file-import"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          CSV or XLSX (MAX. 50MB)
                        </p>
                      </div>
                      <input id="file-import" type="file" className="hidden" />
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Import
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create List
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Contacts</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  2.4M
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contact Lists</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {contactLists.length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Filter className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Contacts</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  2.35M
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <UserPlus className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Opted Out</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  48K
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="lists">Contact Lists</TabsTrigger>
          <TabsTrigger value="contacts">All Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="lists" className="space-y-6 mt-6">
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search contact lists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Lists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactLists.map((list) => (
              <Card key={list.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {list.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {list.source}
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
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-blue-600">
                        {list.count.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">contacts</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className="bg-green-100 text-green-700 capitalize">
                          {list.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="text-gray-900">{list.lastUpdated}</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6 mt-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by name or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Provinces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Provinces</SelectItem>
                    <SelectItem value="lusaka">Lusaka</SelectItem>
                    <SelectItem value="copperbelt">Copperbelt</SelectItem>
                    <SelectItem value="southern">Southern</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="opted-out">Opted Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Contacts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                        Contact
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                        Phone
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                        Province
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                        Age
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                        Last Contact
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentContacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900">
                            {contact.name}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-700">
                            {contact.phone}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-700">
                            {contact.province}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-700">{contact.age}</p>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            className={
                              contact.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }
                          >
                            {contact.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-700">
                            {contact.lastContact}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
