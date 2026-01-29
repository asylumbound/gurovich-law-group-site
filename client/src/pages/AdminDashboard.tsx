import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  Users,
  FileText,
  MessageSquare,
  Loader2,
  Shield,
  Download,
  Plus,
  Trash2,
  StickyNote,
} from "lucide-react";
import { Link } from "wouter";

// Status badge colors
const statusColors: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  reviewed: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  contacted: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  converted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

// Urgency badge colors
const urgencyColors: Record<string, string> = {
  emergency: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  normal: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  unsure: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

// Practice area labels
const practiceAreaLabels: Record<string, string> = {
  personal_injury: "Personal Injury",
  criminal_defense: "Criminal Defense",
  employment_law: "Employment Law",
  tenant_rights: "Tenant Rights",
  civil_litigation: "Civil Litigation",
};

// CSV Export helper function
function downloadCSV(data: any[], filename: string) {
  if (data.length === 0) {
    toast.error("No data to export");
    return;
  }

  // Define column headers and their display names
  const columns = [
    { key: "id", label: "ID" },
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "zip", label: "ZIP" },
    { key: "practice_area", label: "Practice Area" },
    { key: "issue_type_name", label: "Issue Type" },
    { key: "urgency", label: "Urgency" },
    { key: "status", label: "Status" },
    { key: "incident_date", label: "Incident Date" },
    { key: "summary", label: "Summary" },
    { key: "preferred_contact_method", label: "Preferred Contact" },
    { key: "preferred_language", label: "Language" },
    { key: "how_heard", label: "How Heard" },
    { key: "admin_notes", label: "Admin Notes" },
    { key: "created_at", label: "Created At" },
    { key: "updated_at", label: "Updated At" },
  ];

  // Create CSV header
  const header = columns.map(c => c.label).join(",");

  // Create CSV rows
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col.key];
      if (value === null || value === undefined) return "";
      // Escape quotes and wrap in quotes if contains comma or newline
      const stringValue = String(value);
      if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(",");
  });

  // Combine header and rows
  const csv = [header, ...rows].join("\n");

  // Create and download file
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast.success(`Exported ${data.length} records to ${filename}`);
}

export default function AdminDashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [practiceAreaFilter, setPracticeAreaFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedIntakeId, setSelectedIntakeId] = useState<number | null>(null);
  const [newNote, setNewNote] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [notesIntakeId, setNotesIntakeId] = useState<number | null>(null);

  // Check authentication and admin role
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>Please log in to access the admin dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Log In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-red-400 mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AdminDashboardContent 
    search={search}
    setSearch={setSearch}
    statusFilter={statusFilter}
    setStatusFilter={setStatusFilter}
    practiceAreaFilter={practiceAreaFilter}
    setPracticeAreaFilter={setPracticeAreaFilter}
    urgencyFilter={urgencyFilter}
    setUrgencyFilter={setUrgencyFilter}
    page={page}
    setPage={setPage}
    selectedIntakeId={selectedIntakeId}
    setSelectedIntakeId={setSelectedIntakeId}
    newNote={newNote}
    setNewNote={setNewNote}
    isExporting={isExporting}
    setIsExporting={setIsExporting}
    notesDialogOpen={notesDialogOpen}
    setNotesDialogOpen={setNotesDialogOpen}
    notesIntakeId={notesIntakeId}
    setNotesIntakeId={setNotesIntakeId}
  />;
}

function AdminDashboardContent({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  practiceAreaFilter,
  setPracticeAreaFilter,
  urgencyFilter,
  setUrgencyFilter,
  page,
  setPage,
  selectedIntakeId,
  setSelectedIntakeId,
  newNote,
  setNewNote,
  isExporting,
  setIsExporting,
  notesDialogOpen,
  setNotesDialogOpen,
  notesIntakeId,
  setNotesIntakeId,
}: {
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  practiceAreaFilter: string;
  setPracticeAreaFilter: (v: string) => void;
  urgencyFilter: string;
  setUrgencyFilter: (v: string) => void;
  page: number;
  setPage: (v: number) => void;
  selectedIntakeId: number | null;
  setSelectedIntakeId: (v: number | null) => void;
  newNote: string;
  setNewNote: (v: string) => void;
  isExporting: boolean;
  setIsExporting: (v: boolean) => void;
  notesDialogOpen: boolean;
  setNotesDialogOpen: (v: boolean) => void;
  notesIntakeId: number | null;
  setNotesIntakeId: (v: number | null) => void;
}) {
  const utils = trpc.useUtils();

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = trpc.admin.getStats.useQuery();

  // Fetch intakes with filters
  const { data: intakesData, isLoading: intakesLoading, refetch } = trpc.admin.getIntakes.useQuery({
    status: statusFilter !== "all" ? statusFilter as any : undefined,
    practice_area: practiceAreaFilter !== "all" ? practiceAreaFilter : undefined,
    urgency: urgencyFilter !== "all" ? urgencyFilter as any : undefined,
    search: search || undefined,
    page,
    limit: 10,
  });

  // Fetch selected intake details
  const { data: selectedIntake, isLoading: intakeLoading } = trpc.admin.getIntake.useQuery(
    { id: selectedIntakeId! },
    { enabled: !!selectedIntakeId }
  );

  // Fetch notes for notes dialog
  const { data: notesData, isLoading: notesLoading, refetch: refetchNotes } = trpc.admin.getNotes.useQuery(
    { intakeId: notesIntakeId! },
    { enabled: !!notesIntakeId }
  );

  // CSV Export query
  const exportQuery = trpc.admin.exportCSV.useQuery(
    {
      status: statusFilter !== "all" ? statusFilter as any : undefined,
      practice_area: practiceAreaFilter !== "all" ? practiceAreaFilter : undefined,
      urgency: urgencyFilter !== "all" ? urgencyFilter as any : undefined,
    },
    { enabled: false }
  );

  // Update status mutation
  const updateStatusMutation = trpc.admin.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Status updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  // Add note mutation (legacy - appends to admin_notes field)
  const addNoteMutation = trpc.admin.addNote.useMutation({
    onSuccess: () => {
      setNewNote("");
      refetch();
      toast.success("Note added successfully");
    },
    onError: (error) => {
      toast.error(`Failed to add note: ${error.message}`);
    },
  });

  // Create note mutation (new notes table)
  const createNoteMutation = trpc.admin.createNote.useMutation({
    onSuccess: () => {
      setNewNote("");
      refetchNotes();
      toast.success("Note added successfully");
    },
    onError: (error) => {
      toast.error(`Failed to add note: ${error.message}`);
    },
  });

  // Delete note mutation
  const deleteNoteMutation = trpc.admin.deleteNote.useMutation({
    onSuccess: () => {
      refetchNotes();
      toast.success("Note deleted");
    },
    onError: (error) => {
      toast.error(`Failed to delete note: ${error.message}`);
    },
  });

  const handleStatusChange = (intakeId: number, newStatus: string) => {
    updateStatusMutation.mutate({ id: intakeId, status: newStatus as any });
  };

  const handleAddNote = (intakeId: number) => {
    if (newNote.trim()) {
      addNoteMutation.mutate({ intakeId, note: newNote.trim() });
    }
  };

  const handleCreateNote = () => {
    if (newNote.trim() && notesIntakeId) {
      createNoteMutation.mutate({ intakeId: notesIntakeId, note: newNote.trim() });
    }
  };

  const handleDeleteNote = (noteId: number) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNoteMutation.mutate({ noteId });
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const result = await exportQuery.refetch();
      if (result.data?.data) {
        const timestamp = new Date().toISOString().split("T")[0];
        downloadCSV(result.data.data, `intakes-export-${timestamp}.csv`);
      }
    } catch (error) {
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const openNotesDialog = (intakeId: number) => {
    setNotesIntakeId(intakeId);
    setNotesDialogOpen(true);
    setNewNote("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage client intakes and case submissions</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleExportCSV}
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export CSV
              </Button>
              <Button asChild variant="outline">
                <Link href="/">← Back to Site</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold">{statsLoading ? "-" : stats?.total || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">New</p>
                  <p className="text-2xl font-bold">{statsLoading ? "-" : stats?.submitted || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-500">Reviewed</p>
                  <p className="text-2xl font-bold">{statsLoading ? "-" : stats?.reviewed || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Contacted</p>
                  <p className="text-2xl font-bold">{statsLoading ? "-" : stats?.contacted || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Converted</p>
                  <p className="text-2xl font-bold">{statsLoading ? "-" : stats?.converted || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-red-500" />
                <div>
                  <p className="text-sm text-gray-500">Emergency</p>
                  <p className="text-2xl font-bold">{statsLoading ? "-" : stats?.byUrgency?.emergency || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">New</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={practiceAreaFilter} onValueChange={setPracticeAreaFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Practice Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  <SelectItem value="personal_injury">Personal Injury</SelectItem>
                  <SelectItem value="criminal_defense">Criminal Defense</SelectItem>
                  <SelectItem value="employment_law">Employment Law</SelectItem>
                  <SelectItem value="tenant_rights">Tenant Rights</SelectItem>
                  <SelectItem value="civil_litigation">Civil Litigation</SelectItem>
                </SelectContent>
              </Select>
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="unsure">Unsure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Intakes Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Client Intakes</CardTitle>
                <CardDescription>
                  {intakesData?.total || 0} total intakes
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {intakesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : intakesData?.intakes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No intakes found matching your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Client</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Contact</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Practice Area</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Urgency</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {intakesData?.intakes.map((intake) => (
                      <tr 
                        key={intake.id} 
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium">{intake.first_name} {intake.last_name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {intake.city}, {intake.state}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {intake.phone && (
                            <a href={`tel:${intake.phone}`} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                              <Phone className="h-3 w-3" />
                              {intake.phone}
                            </a>
                          )}
                          {intake.email && (
                            <a href={`mailto:${intake.email}`} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                              <Mail className="h-3 w-3" />
                              {intake.email}
                            </a>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">{practiceAreaLabels[intake.practice_area] || intake.practice_area}</div>
                          {intake.issue_type_name && (
                            <div className="text-xs text-gray-500">{intake.issue_type_name}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={urgencyColors[intake.urgency] || ""}>
                            {intake.urgency}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Select
                            value={intake.status}
                            onValueChange={(value) => handleStatusChange(intake.id, value)}
                          >
                            <SelectTrigger className="w-[130px] h-8">
                              <Badge className={statusColors[intake.status] || ""}>
                                {intake.status}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="submitted">New</SelectItem>
                              <SelectItem value="reviewed">Reviewed</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="converted">Converted</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {new Date(intake.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedIntakeId(intake.id)}
                                >
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    Intake Details - {selectedIntake?.first_name} {selectedIntake?.last_name}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Submitted on {selectedIntake?.created_at ? new Date(selectedIntake.created_at).toLocaleString() : ""}
                                  </DialogDescription>
                                </DialogHeader>
                                {intakeLoading ? (
                                  <div className="flex justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                  </div>
                                ) : selectedIntake ? (
                                  <div className="space-y-6">
                                    {/* Contact Info */}
                                    <div>
                                      <h3 className="font-semibold mb-2">Contact Information</h3>
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="text-gray-500">Name:</span> {selectedIntake.first_name} {selectedIntake.last_name}</div>
                                        <div><span className="text-gray-500">Email:</span> {selectedIntake.email}</div>
                                        <div><span className="text-gray-500">Phone:</span> {selectedIntake.phone}</div>
                                        <div><span className="text-gray-500">Language:</span> {selectedIntake.preferred_language}</div>
                                        <div className="col-span-2"><span className="text-gray-500">Address:</span> {selectedIntake.address}, {selectedIntake.city}, {selectedIntake.state} {selectedIntake.zip}</div>
                                      </div>
                                    </div>

                                    {/* Case Info */}
                                    <div>
                                      <h3 className="font-semibold mb-2">Case Information</h3>
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="text-gray-500">Practice Area:</span> {practiceAreaLabels[selectedIntake.practice_area] || selectedIntake.practice_area}</div>
                                        <div><span className="text-gray-500">Issue Type:</span> {selectedIntake.issue_type?.name || "N/A"}</div>
                                        <div><span className="text-gray-500">Urgency:</span> <Badge className={urgencyColors[selectedIntake.urgency] || ""}>{selectedIntake.urgency}</Badge></div>
                                        <div><span className="text-gray-500">Incident Date:</span> {selectedIntake.incident_date ? new Date(selectedIntake.incident_date).toLocaleDateString() : "N/A"}</div>
                                      </div>
                                      {selectedIntake.summary && (
                                        <div className="mt-4">
                                          <span className="text-gray-500">Summary:</span>
                                          <p className="mt-1 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">{selectedIntake.summary}</p>
                                        </div>
                                      )}
                                    </div>

                                    {/* Parties */}
                                    {selectedIntake.parties && selectedIntake.parties.length > 0 && (
                                      <div>
                                        <h3 className="font-semibold mb-2">Involved Parties</h3>
                                        <div className="space-y-2">
                                          {selectedIntake.parties.map((party: any, idx: number) => (
                                            <div key={idx} className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                              <div><span className="text-gray-500">Role:</span> {party.role}</div>
                                              <div><span className="text-gray-500">Name:</span> {party.name || "Unknown"}</div>
                                              {party.contact_info && <div><span className="text-gray-500">Contact:</span> {party.contact_info}</div>}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Uploads */}
                                    {selectedIntake.uploads && selectedIntake.uploads.length > 0 && (
                                      <div>
                                        <h3 className="font-semibold mb-2">Uploaded Files</h3>
                                        <div className="space-y-2">
                                          {selectedIntake.uploads.map((upload: any, idx: number) => (
                                            <a 
                                              key={idx} 
                                              href={upload.file_url} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                            >
                                              <FileText className="h-4 w-4" />
                                              {upload.file_name}
                                            </a>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Admin Notes (legacy) */}
                                    <div>
                                      <h3 className="font-semibold mb-2">Admin Notes</h3>
                                      {selectedIntake.admin_notes ? (
                                        <pre className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded whitespace-pre-wrap">{selectedIntake.admin_notes}</pre>
                                      ) : (
                                        <p className="text-sm text-gray-500">No notes yet.</p>
                                      )}
                                      <div className="mt-3 flex gap-2">
                                        <Textarea
                                          placeholder="Add a note..."
                                          value={newNote}
                                          onChange={(e) => setNewNote(e.target.value)}
                                          className="flex-1"
                                          rows={2}
                                        />
                                        <Button 
                                          onClick={() => handleAddNote(selectedIntake.id)}
                                          disabled={!newNote.trim() || addNoteMutation.isPending}
                                        >
                                          {addNoteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ) : null}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openNotesDialog(intake.id)}
                              title="Manage Notes"
                            >
                              <StickyNote className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {intakesData && intakesData.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Page {intakesData.page} of {intakesData.totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= intakesData.totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Internal Notes
            </DialogTitle>
            <DialogDescription>
              Add and manage internal notes for this intake. Notes are only visible to admin users.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Add new note */}
            <div className="space-y-2">
              <Label htmlFor="new-note">Add New Note</Label>
              <Textarea
                id="new-note"
                placeholder="Enter your note here..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleCreateNote}
                disabled={!newNote.trim() || createNoteMutation.isPending}
                className="w-full"
              >
                {createNoteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add Note
              </Button>
            </div>

            {/* Notes list */}
            <div className="space-y-2">
              <Label>Previous Notes</Label>
              {notesLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : notesData?.notes && notesData.notes.length > 0 ? (
                <ScrollArea className="h-[300px] rounded border p-3">
                  <div className="space-y-3">
                    {notesData.notes.map((note: any) => (
                      <div key={note.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm whitespace-pre-wrap">{note.note}</p>
                            <div className="mt-2 text-xs text-gray-500">
                              {note.created_by_name} • {new Date(note.created_at).toLocaleString()}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-gray-500 border rounded">
                  No notes yet. Add your first note above.
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
