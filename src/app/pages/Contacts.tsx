import { useEffect, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

import {
  ContactItem,
  ContactListItem,
  createContactList,
  deleteContact,
  deleteContactList,
  getContactLists,
  getContactStats,
  getContactsInList,
  importContactsIntoList,
  updateContactList,
  updateContact,
} from "../../services/contact/contactService";
import ConfirmDialog from "../components/common/ConfirmDialog";

const initialListForm = {
  list_name: "",
  description: "",
  list_type: "National Database",
  province: null as string | null,
};

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("lists");

  const [contactLists, setContactLists] = useState<ContactListItem[]>([]);
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [stats, setStats] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const [listForm, setListForm] = useState(initialListForm);
  const [selectedListId, setSelectedListId] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editOpen, setEditOpen] = useState(false);
  const [editingList, setEditingList] = useState<ContactListItem | null>(null);

  const [contactEditOpen, setContactEditOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactItem | null>(null);

  const [contactForm, setContactForm] = useState({
    name: "",
    mob: "",
    province: "",
    status: "active",
  });
  const [deleteListTarget, setDeleteListTarget] =
    useState<ContactListItem | null>(null);

  const [removeContactTarget, setRemoveContactTarget] =
    useState<ContactItem | null>(null);

  const [confirmLoading, setConfirmLoading] = useState(false);


  const openContactEdit = (contact: ContactItem) => {
    setEditingContact(contact);
    setContactForm({
      name: contact.name || getContactName(contact),
      mob: contact.mob || contact.phone || "",
      province: contact.province || "",
      status: String(contact.status || "active"),
    });
    setContactEditOpen(true);
  };

  const handleUpdateContact = async () => {
    if (!editingContact) return;

    try {
      await updateContact(getContactId(editingContact), {
        name: contactForm.name,
        mob: contactForm.mob,
        province: contactForm.province,
        status: contactForm.status,
      });

      setContactEditOpen(false);
      setEditingContact(null);

      if (selectedListId) {
        fetchContactsByList(selectedListId);
      }
    } catch (error) {
      console.error("Update Contact Error:", error);
      alert("Failed to update contact");
    }
  };

  const fetchData = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const [listsRes, statsRes] = await Promise.all([
        getContactLists({ page: pageNumber, limit: 9 }),
        getContactStats(),
      ]);

      const lists = listsRes?.data || [];

      setContactLists(lists);
      setStats(statsRes?.data || null);

      setPage(listsRes?.page || 1);
      setTotalPages(listsRes?.totalPages || 1);

    } catch (error) {
      console.error("Contacts API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const openEdit = (list: ContactListItem) => {
    setEditingList(list);
    setListForm({
      list_name: list.list_name || "",
      description: list.description || "",
      list_type: list.list_type || "National Database",
      province: list.province || null,
    });
    setEditOpen(true);
  };

  const handleUpdateList = async () => {
    if (!editingList) return;

    try {
      await updateContactList(editingList.id || editingList._id, listForm);

      setEditOpen(false);
      setEditingList(null);
      fetchData(page);
    } catch (error) {
      console.error("Update List Error:", error);
      alert("Failed to update list");
    }
  };
  const fetchContactsByList = async (listId: string) => {
    try {
      setSelectedListId(listId);
      const res = await getContactsInList(listId, {
        page: 1,
        limit: 20,
      });
      setContacts(res?.data || []);
      setActiveTab("contacts");
    } catch (error) {
      console.error("Get Contacts In List Error:", error);
      alert("Failed to load contacts");
    }
  };

  const handleCreateList = async () => {
    if (!listForm.list_name) {
      alert("Please enter list name");
      return;
    }

    try {
      await createContactList(listForm);
      setListForm(initialListForm);
      setCreateOpen(false);
      fetchData();
    } catch (error) {
      console.error("Create List Error:", error);
      alert("Failed to create contact list");
    }
  };

  const handleImport = async () => {
    if (!selectedListId || !importFile) {
      alert("Please select list and file");
      return;
    }

    try {
      await importContactsIntoList(selectedListId, importFile);
      setImportFile(null);
      setImportOpen(false);
      fetchData();
    } catch (error) {
      console.error("Import Contacts Error:", error);
      alert("Failed to import contacts");
    }
  };

  const handleDeleteList = async () => {
    if (!deleteListTarget) return;

    const id = getListId(deleteListTarget);
    if (!id) return;

    try {
      setConfirmLoading(true);
      await deleteContactList(id);
      setDeleteListTarget(null);
      fetchData(page);
    } catch (error) {
      console.error("Delete List Error:", error);
      alert("Failed to delete list");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!removeContactTarget) return;

    const id = getContactId(removeContactTarget);
    if (!id) return;

    try {
      setConfirmLoading(true);
      await deleteContact(id);
      setRemoveContactTarget(null);

      if (selectedListId) {
        fetchContactsByList(selectedListId);
      }
    } catch (error) {
      console.error("Delete Contact Error:", error);
      alert("Failed to remove contact");
    } finally {
      setConfirmLoading(false);
    }
  };

  const filteredLists = contactLists.filter((list) =>
    (list.list_name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter((contact) => {
    const name = contact.name || `${contact.first_name || ""} ${contact.last_name || ""}`;
    const phone = contact.phone || contact.mob || "";

    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getContactName = (contact: ContactItem) => {
    return (
      contact.name ||
      `${contact.first_name || ""} ${contact.last_name || ""}`.trim() ||
      "N/A"
    );
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const getListId = (list: ContactListItem) => list.id || list._id;
  const getContactId = (contact: ContactItem) => contact.id || contact._id;

  return (
    <div className="p-6 space-y-6">
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
          <Dialog open={importOpen} onOpenChange={setImportOpen}>
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
                  <Label>Select Contact List</Label>
                  <Select
                    value={selectedListId}
                    onValueChange={setSelectedListId}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select list" />
                    </SelectTrigger>
                    <SelectContent>
                      {contactLists.map((list) => (
                        <SelectItem key={getListId(list)} value={getListId(list)}>
                          {list.list_name}
                        </SelectItem>
                      ))}
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
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        CSV or XLSX
                      </p>
                      <p className="text-xs text-gray-500">
                        {importFile?.name || "MAX. 50MB"}
                      </p>

                      <input
                        id="file-import"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        className="hidden"
                        onChange={(e) =>
                          setImportFile(e.target.files?.[0] || null)
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleImport}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Import
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setImportOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create List
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Contact List</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <Label>List Name *</Label>
                  <Input
                    value={listForm.list_name}
                    onChange={(e) =>
                      setListForm({ ...listForm, list_name: e.target.value })
                    }
                    placeholder="e.g., Lusaka Province"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Input
                    value={listForm.description}
                    onChange={(e) =>
                      setListForm({ ...listForm, description: e.target.value })
                    }
                    placeholder="Optional description"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>List Type *</Label>
                  <Select
                    value={listForm.list_type}
                    onValueChange={(value) =>
                      setListForm({ ...listForm, list_type: value })
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select list type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="National Database">National Database</SelectItem>
                      <SelectItem value="Regional Filter">Regional Filter</SelectItem>
                      <SelectItem value="Age Filter">Age Filter</SelectItem>
                      <SelectItem value="Custom Segment">Custom Segment</SelectItem>
                      <SelectItem value="Event Import">Event Import</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Province</Label>
                  <Select
                    value={listForm.province || "null"}
                    onValueChange={(value) =>
                      setListForm({
                        ...listForm,
                        province: value === "null" ? null : value,
                      })
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">None</SelectItem>
                      <SelectItem value="Lusaka">Lusaka</SelectItem>
                      <SelectItem value="Copperbelt">Copperbelt</SelectItem>
                      <SelectItem value="Southern">Southern</SelectItem>
                      <SelectItem value="Eastern">Eastern</SelectItem>
                      <SelectItem value="Western">Western</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleCreateList}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Create
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Contact List</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <Label>List Name *</Label>
                  <Input
                    value={listForm.list_name}
                    onChange={(e) =>
                      setListForm({ ...listForm, list_name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Input
                    value={listForm.description}
                    onChange={(e) =>
                      setListForm({ ...listForm, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>List Type</Label>
                  <Select
                    value={listForm.list_type}
                    onValueChange={(value) =>
                      setListForm({ ...listForm, list_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="National Database">National Database</SelectItem>
                      <SelectItem value="Regional Filter">Regional Filter</SelectItem>
                      <SelectItem value="Custom Segment">Custom Segment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleUpdateList} className="flex-1">
                    Update
                  </Button>
                  <Button variant="outline" onClick={() => setEditOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={contactEditOpen} onOpenChange={setContactEditOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Contact</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    placeholder="John Banda Updated"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Mobile *</Label>
                  <Input
                    value={contactForm.mob}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, mob: e.target.value })
                    }
                    placeholder="0977000001"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Province *</Label>
                  <Select
                    value={contactForm.province}
                    onValueChange={(value) =>
                      setContactForm({ ...contactForm, province: value })
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lusaka">Lusaka</SelectItem>
                      <SelectItem value="Copperbelt">Copperbelt</SelectItem>
                      <SelectItem value="Southern">Southern</SelectItem>
                      <SelectItem value="Eastern">Eastern</SelectItem>
                      <SelectItem value="Western">Western</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Status *</Label>
                  <Select
                    value={contactForm.status}
                    onValueChange={(value) =>
                      setContactForm({ ...contactForm, status: value })
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="opted-out">Opted Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleUpdateContact}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Update Contact
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setContactEditOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Contacts</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {(stats?.total_contacts || 0).toLocaleString()}
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
                  {stats?.total_lists || contactLists.length}
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
                  {(stats?.active_contacts || 0).toLocaleString()}
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
                <p className="text-sm text-gray-600">Inactive Contacts</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {(stats?.inactive_contacts || 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="lists">Contact Lists</TabsTrigger>
          <TabsTrigger value="contacts">All Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="lists" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search contact lists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <p className="text-sm text-gray-500">Loading contact lists...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLists.map((list) => {
                const listId = getListId(list);

                return (
                  <Card
                    key={listId}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {list.list_name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {list.description || "Contact List"}
                            </p>
                          </div>

                          <div className="relative">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === listId ? null : listId
                                )
                              }
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>

                            {openMenuId === listId && (
                              <div className="absolute right-0 top-9 z-[9999] w-40 rounded-md border border-gray-200 bg-white shadow-lg">
                                <button
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    openEdit(list);
                                  }}
                                  className="flex w-full items-center px-3 py-2 text-sm hover:bg-gray-100"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </button>

                                {/* <button
                                  type="button"
                                  className="flex w-full items-center px-3 py-2 text-sm hover:bg-gray-100"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Export
                                </button> */}

                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setDeleteListTarget(list);
                                  }}
                                  className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                          <p className="text-3xl font-bold text-blue-600">
                            {(list.total_contacts || 0).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">contacts</p>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Status:</span>
                            <Badge className="bg-green-100 text-green-700 capitalize">
                              active
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Last Updated:</span>
                            <span className="text-gray-900">
                              {formatDate(list.updated_at || list.created_at)}
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => fetchContactsByList(listId)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => fetchData(page - 1)}
                >
                  Prev
                </Button>

                <span className="px-4 py-2 text-sm">
                  Page {page} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => fetchData(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by name or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto overflow-y-visible">
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
                        Gender
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                        Age Group
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                        Created
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredContacts.map((contact) => {
                      const contactId = getContactId(contact);

                      return (
                        <tr
                          key={contactId}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4">
                            <p className="font-medium text-gray-900">
                              {getContactName(contact)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {contact.email || ""}
                            </p>
                          </td>

                          <td className="py-4 px-4">
                            <p className="text-sm text-gray-700">
                              {contact.phone || contact.mob || "N/A"}
                            </p>
                          </td>

                          <td className="py-4 px-4">
                            <p className="text-sm text-gray-700">
                              {contact.province || "N/A"}
                            </p>
                          </td>

                          <td className="py-4 px-4">
                            <p className="text-sm text-gray-700">
                              {contact.gender || "N/A"}
                            </p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-sm text-gray-700">
                              {contact.age_group || "N/A"}
                            </p>
                          </td>

                          <td className="py-4 px-4">
                            <Badge
                              className={
                                contact.status === "active" ||
                                  contact.status === 1
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }
                            >
                              {contact.status === 1
                                ? "active"
                                : contact.status || "inactive"}
                            </Badge>
                          </td>

                          <td className="py-4 px-4">
                            <p className="text-sm text-gray-700">
                              {formatDate(contact.created_at)}
                            </p>
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="relative flex justify-end">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setOpenMenuId(
                                    openMenuId === contactId ? null : contactId
                                  )
                                }
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>

                              {openMenuId === contactId && (
                                <div className="absolute right-0 top-9 z-[9999] w-36 rounded-md border border-gray-200 bg-white shadow-lg">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      openContactEdit(contact);
                                    }}
                                    className="flex w-full items-center px-3 py-2 text-sm hover:bg-gray-100"
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setRemoveContactTarget(contact);
                                    }}
                                    className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remove
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredContacts.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-6 text-center text-sm text-gray-500"
                        >
                          No contacts found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <ConfirmDialog
        open={Boolean(deleteListTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteListTarget(null);
        }}
        title="Delete Contact List?"
        description={`Are you sure you want to delete "${deleteListTarget?.list_name || "this list"
          }"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
        loading={confirmLoading}
        onConfirm={handleDeleteList}
      />

      <ConfirmDialog
        open={Boolean(removeContactTarget)}
        onOpenChange={(open) => {
          if (!open) setRemoveContactTarget(null);
        }}
        title="Remove Contact?"
        description={`Are you sure you want to remove "${removeContactTarget ? getContactName(removeContactTarget) : "this contact"
          }"? This action cannot be undone.`}
        confirmText="Yes, Remove"
        cancelText="Cancel"
        variant="danger"
        loading={confirmLoading}
        onConfirm={handleDeleteContact}
      />
    </div>
  );
}