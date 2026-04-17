import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Search,
  UserPlus,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Users as UsersIcon,
  Lock,
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

const users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@nvbs.zm",
    role: "Super Admin",
    status: "active",
    lastLogin: "Apr 17, 2026 10:32 AM",
    campaigns: 24,
  },
  {
    id: 2,
    name: "Campaign Manager",
    email: "campaign@nvbs.zm",
    role: "Campaign Manager",
    status: "active",
    lastLogin: "Apr 17, 2026 09:15 AM",
    campaigns: 18,
  },
  {
    id: 3,
    name: "John Mwale",
    email: "john.mwale@nvbs.zm",
    role: "Operator",
    status: "active",
    lastLogin: "Apr 17, 2026 08:45 AM",
    campaigns: 8,
  },
  {
    id: 4,
    name: "Grace Phiri",
    email: "grace.phiri@nvbs.zm",
    role: "Analyst",
    status: "active",
    lastLogin: "Apr 16, 2026 03:22 PM",
    campaigns: 0,
  },
  {
    id: 5,
    name: "Peter Banda",
    email: "peter.banda@nvbs.zm",
    role: "Operator",
    status: "inactive",
    lastLogin: "Apr 10, 2026 11:05 AM",
    campaigns: 12,
  },
];

const roles = [
  {
    name: "Super Admin",
    description: "Full system access and control",
    permissions: 25,
    users: 1,
  },
  {
    name: "Campaign Manager",
    description: "Create and manage campaigns",
    permissions: 18,
    users: 1,
  },
  {
    name: "Operator",
    description: "Monitor and execute campaigns",
    permissions: 12,
    users: 2,
  },
  {
    name: "Analyst",
    description: "View analytics and reports",
    permissions: 8,
    users: 1,
  },
];

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-red-100 text-red-700";
      case "Campaign Manager":
        return "bg-blue-100 text-blue-700";
      case "Operator":
        return "bg-green-100 text-green-700";
      case "Analyst":
        return "bg-purple-100 text-purple-700";
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
            User Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage system users and access control
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="user-name">Full Name *</Label>
                <Input
                  id="user-name"
                  placeholder="e.g., John Mwanza"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="user-email">Email Address *</Label>
                <Input
                  id="user-email"
                  type="email"
                  placeholder="e.g., john@nvbs.zm"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="user-role">Role *</Label>
                <Select>
                  <SelectTrigger id="user-role" className="mt-1.5">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                    <SelectItem value="campaign-manager">
                      Campaign Manager
                    </SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="user-password">Temporary Password *</Label>
                <Input
                  id="user-password"
                  type="password"
                  placeholder="••••••••"
                  className="mt-1.5"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Create User
                </Button>
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {users.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {users.filter((u) => u.status === "active").length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">User Roles</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {roles.length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Users</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {users.filter((u) => u.status === "inactive").length}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <UsersIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roles Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((role, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getRoleColor(role.name)}>
                    {role.name}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {role.description}
                </p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Permissions:</span>
                    <span className="font-medium text-gray-900">
                      {role.permissions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Users:</span>
                    <span className="font-medium text-gray-900">
                      {role.users}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Last Login
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Campaigns
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        className={
                          user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-700">{user.lastLogin}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-700">{user.campaigns}</p>
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
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Lock className="w-4 h-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          {user.status === "active" ? (
                            <DropdownMenuItem>
                              <Shield className="w-4 h-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <Shield className="w-4 h-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
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
    </div>
  );
}
