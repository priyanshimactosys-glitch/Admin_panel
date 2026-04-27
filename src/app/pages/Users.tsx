import { useEffect, useState } from "react";
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

import {
  createUser,
  deleteUser,
  getUserStats,
  getUsers,
  updateUser,
  UserItem,
  UserRoleType,
} from "../../services/user/userService";

const roleDescriptions: Record<string, string> = {
  "Super Admin": "Full system access and control",
  "Campaign Manager": "Create and manage campaigns",
  Operator: "Monitor and execute campaigns",
  Analyst: "View analytics and reports",
};

const initialForm = {
  first_name: "",
  mob: "",
  email: "",
  password: "",
  role_type: "" as UserRoleType | "",
};

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [formData, setFormData] = useState(initialForm);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [editForm, setEditForm] = useState({
    first_name: "",
    mob: "",
    email: "",
    password: "",
    role_type: "" as UserRoleType | "",
    status: 1,
  });
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const openEditModal = (user: UserItem) => {
    setSelectedUser(user);
    setEditForm({
      first_name: user.first_name || "",
      mob: user.mob || "",
      email: user.email || "",
      password: "",
      role_type: user.role_type || "",
      status: user.status,
    });
    setEditOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      setUpdating(true);

      const payload: any = {
        first_name: editForm.first_name,
        mob: editForm.mob,
        email: editForm.email,
        role_type: editForm.role_type as UserRoleType,
        status: editForm.status,
      };

      if (editForm.password) {
        payload.password = editForm.password;
      }

      await updateUser(selectedUser.id || selectedUser._id, payload);

      setEditOpen(false);
      setSelectedUser(null);
      fetchData();
    } catch (error) {
      console.error("Update User Error:", error);
      alert("Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  const openDeleteModal = (user: UserItem) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setDeleting(true);
      await deleteUser(selectedUser.id || selectedUser._id);

      setDeleteOpen(false);
      setSelectedUser(null);
      fetchData();
    } catch (error) {
      console.error("Delete User Error:", error);
      alert("Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };
  const fetchData = async () => {
    try {
      setLoading(true);

      const [usersRes, statsRes] = await Promise.all([
        getUsers({ page: 1, limit: 10 }),
        getUserStats(),
      ]);

      setUsers(usersRes?.data || []);
      setStats(statsRes?.data || null);
    } catch (error) {
      console.error("Users API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roles = stats?.roles_permissions || [];

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

  const formatStatus = (status: number) => {
    return status === 1 ? "active" : "inactive";
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleString();
  };

  const handleCreateUser = async () => {
    if (
      !formData.first_name ||
      !formData.mob ||
      !formData.email ||
      !formData.password ||
      !formData.role_type
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setCreating(true);

      await createUser({
        first_name: formData.first_name,
        mob: formData.mob,
        email: formData.email,
        password: formData.password,
        role_type: formData.role_type,
      });

      setFormData(initialForm);
      setOpen(false);
      fetchData();
    } catch (error) {
      console.error("Create User Error:", error);
      alert("Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (user: UserItem) => {
    try {
      await updateUser(user.id || user._id, {
        status: user.status === 1 ? 0 : 1,
      });

      fetchData();
    } catch (error) {
      console.error("Update Status Error:", error);
      alert("Failed to update user status");
    }
  };

  const handleDeleteUser = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await deleteUser(id);
      fetchData();
    } catch (error) {
      console.error("Delete User Error:", error);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            User Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage system users and access control
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
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
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  placeholder="e.g., John Mwanza"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="user-mob">Mobile Number *</Label>
                <Input
                  id="user-mob"
                  value={formData.mob}
                  onChange={(e) =>
                    setFormData({ ...formData, mob: e.target.value })
                  }
                  placeholder="e.g., 0977654321"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="user-email">Email Address *</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="e.g., john@voxis.zm"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="user-role">Role *</Label>
                <Select
                  value={formData.role_type}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      role_type: value as UserRoleType,
                    })
                  }
                >
                  <SelectTrigger id="user-role" className="mt-1.5">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Campaign Manager">
                      Campaign Manager
                    </SelectItem>
                    <SelectItem value="Operator">Operator</SelectItem>
                    <SelectItem value="Analyst">Analyst</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="user-password">Temporary Password *</Label>
                <Input
                  id="user-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="mt-1.5"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreateUser}
                  disabled={creating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {creating ? "Creating..." : "Create User"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {stats?.total_users || 0}
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
                  {stats?.active_users || 0}
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
                  {stats?.user_roles || 0}
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
                  {stats?.inactive_users || 0}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <UsersIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((role: any, index: number) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getRoleColor(role.role)}>
                    {role.role}
                  </Badge>
                  {/* <Button variant="ghost" size="sm">
                    <Edit className="w-3 h-3" />
                  </Button> */}
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {roleDescriptions[role.role] || "System role"}
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
          {loading ? (
            <p className="text-sm text-gray-500">Loading users...</p>
          ) : (
            <div className="overflow-x-auto overflow-y-visible">
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
                      Actionsddd
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id || user._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.first_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <Badge className={getRoleColor(user.role_type)}>
                          {user.role_type}
                        </Badge>
                      </td>

                      <td className="py-4 px-4">
                        <Badge
                          className={
                            user.status === 1
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {formatStatus(user.status)}
                        </Badge>
                      </td>

                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-700">
                          {formatDate(user.last_login)}
                        </p>
                      </td>

                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-700">
                          {user.campaigns_count || 0}
                        </p>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="relative flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setOpenMenuId(openMenuId === (user.id || user._id) ? null : user.id || user._id)
                            }
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>

                          {openMenuId === (user.id || user._id) && (
                            <div className="absolute right-0 top-9 z-[9999] w-44 rounded-md border border-gray-200 bg-white shadow-lg">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  openEditModal(user);
                                }}
                                className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit User
                              </button>

                          

                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  handleToggleStatus(user);
                                }}
                                className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Shield className="w-4 h-4 mr-2" />
                                {user.status === 1 ? "Deactivate" : "Activate"}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  openDeleteModal(user);
                                }}
                                className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete User
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-6 text-center text-sm text-gray-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label>Full Name *</Label>
              <Input
                value={editForm.first_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, first_name: e.target.value })
                }
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Mobile Number *</Label>
              <Input
                value={editForm.mob}
                onChange={(e) =>
                  setEditForm({ ...editForm, mob: e.target.value })
                }
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Email Address *</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Role *</Label>
              <Select
                value={editForm.role_type}
                onValueChange={(value) =>
                  setEditForm({
                    ...editForm,
                    role_type: value as UserRoleType,
                  })
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Campaign Manager">
                    Campaign Manager
                  </SelectItem>
                  <SelectItem value="Operator">Operator</SelectItem>
                  <SelectItem value="Analyst">Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status *</Label>
              <Select
                value={String(editForm.status)}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, status: Number(value) })
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="0">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={editForm.password}
                onChange={(e) =>
                  setEditForm({ ...editForm, password: e.target.value })
                }
                placeholder="Leave blank to keep old password"
                className="mt-1.5"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleUpdateUser}
                disabled={updating}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {updating ? "Updating..." : "Update User"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {selectedUser?.first_name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex gap-3 pt-4">
              <Button
                variant="destructive"
                onClick={confirmDeleteUser}
                disabled={deleting}
                className="flex-1"
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>

              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}