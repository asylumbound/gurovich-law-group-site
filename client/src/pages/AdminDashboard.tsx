import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  MessageSquare,
  ExternalLink,
  Loader2,
  Shield,
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

export default function AdminDashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [practiceAreaFilter, setPracticeAreaFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedIntakeId, setSelectedIntakeId] = useState<number | null>(null);
  const [newNote, setNewNote] = useState("");

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
}) {
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

  // Update status mutation
  const updateStatusMutation = trpc.admin.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Add note mutation
  const addNoteMutation = trpc.admin.addNote.useMutation({
    onSuccess: () => {
      setNewNote("");
      refetch();
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
            <Button asChild variant="outline">
              <Link href="/">← Back to Site</Link>
            </Button>
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
                <AlertCircle className="h-5 w-5 text-red-500" />
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
            <CardTitle>Client Intakes</CardTitle>
            <CardDescription>
              {intakesData?.total || 0} total intakes
            </CardDescription>
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
                            <div className="text-sm flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <a href={`tel:${intake.phone}`} className="hover:underline">{intake.phone}</a>
                            </div>
                          )}
                          {intake.email && (
                            <div className="text-sm flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <a href={`mailto:${intake.email}`} className="hover:underline">{intake.email}</a>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{practiceAreaLabels[intake.practice_area || ""] || intake.practice_area}</div>
                          <div className="text-sm text-gray-500">{intake.issue_type_name}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={urgencyColors[intake.urgency || "normal"]}>
                            {intake.urgency === "emergency" ? "🚨 " : intake.urgency === "high" ? "⚠️ " : ""}
                            {intake.urgency?.charAt(0).toUpperCase() + (intake.urgency?.slice(1) || "")}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Select 
                            value={intake.status || "submitted"} 
                            onValueChange={(v) => handleStatusChange(intake.id, v)}
                          >
                            <SelectTrigger className="w-[130px] h-8">
                              <SelectValue />
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
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {intake.created_at ? new Date(intake.created_at).toLocaleDateString() : "-"}
                        </td>
                        <td className="py-3 px-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedIntakeId(intake.id)}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Intake Details: {intake.first_name} {intake.last_name}
                                </DialogTitle>
                                <DialogDescription>
                                  Submitted on {intake.created_at ? new Date(intake.created_at).toLocaleString() : "Unknown"}
                                </DialogDescription>
                              </DialogHeader>
                              
                              {intakeLoading ? (
                                <div className="flex justify-center py-8">
                                  <Loader2 className="h-8 w-8 animate-spin" />
                                </div>
                              ) : selectedIntake ? (
                                <IntakeDetails 
                                  intake={selectedIntake} 
                                  newNote={newNote}
                                  setNewNote={setNewNote}
                                  onAddNote={() => handleAddNote(selectedIntake.id)}
                                  isAddingNote={addNoteMutation.isPending}
                                />
                              ) : null}
                            </DialogContent>
                          </Dialog>
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
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(intakesData.totalPages, page + 1))}
                    disabled={page === intakesData.totalPages}
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
    </div>
  );
}

function IntakeDetails({ 
  intake, 
  newNote, 
  setNewNote, 
  onAddNote,
  isAddingNote,
}: { 
  intake: any; 
  newNote: string;
  setNewNote: (v: string) => void;
  onAddNote: () => void;
  isAddingNote: boolean;
}) {
  return (
    <Tabs defaultValue="contact" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="contact">Contact</TabsTrigger>
        <TabsTrigger value="case">Case Info</TabsTrigger>
        <TabsTrigger value="files">Files ({intake.uploads?.length || 0})</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>

      <TabsContent value="contact" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Full Name</label>
            <p className="font-medium">{intake.first_name} {intake.last_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Phone</label>
            <p>{intake.phone || "Not provided"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p>{intake.email || "Not provided"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Location</label>
            <p>{intake.city}, {intake.state}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Preferred Contact</label>
            <p className="capitalize">{intake.preferred_contact_method}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Preferred Language</label>
            <p>
              {intake.preferred_language === "en" ? "English" : 
               intake.preferred_language === "es" ? "Spanish" :
               intake.preferred_language === "hy" ? "Armenian" :
               intake.preferred_language === "ru" ? "Russian" : "Ukrainian"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Is Affected Person</label>
            <p>{intake.is_affected_person ? "Yes" : "No"}</p>
          </div>
          {!intake.is_affected_person && intake.relationship_to_affected && (
            <div>
              <label className="text-sm font-medium text-gray-500">Relationship</label>
              <p>{intake.relationship_to_affected}</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="case" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Practice Area</label>
            <p className="font-medium">{practiceAreaLabels[intake.practice_area] || intake.practice_area}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Issue Type</label>
            <p>{intake.issue_type?.name || "Unknown"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Urgency</label>
            <Badge className={urgencyColors[intake.urgency || "normal"]}>
              {intake.urgency?.charAt(0).toUpperCase() + (intake.urgency?.slice(1) || "")}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Incident Date</label>
            <p>{intake.incident_date || (intake.incident_date_unknown ? "Unknown" : "Not provided")}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Incident Location</label>
            <p>{intake.incident_city ? `${intake.incident_city}, ${intake.incident_state}` : "Not provided"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Agency Involved</label>
            <p>{intake.agency_involved ? `Yes - ${intake.agency_name || "Unknown"}` : "No"}</p>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-500">Summary</label>
          <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">{intake.summary}</p>
        </div>

        {intake.additional_notes && (
          <div>
            <label className="text-sm font-medium text-gray-500">Additional Notes</label>
            <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">{intake.additional_notes}</p>
          </div>
        )}

        {/* Practice-specific details */}
        {intake.practice_details && (
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-2">Practice-Specific Details</label>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(intake.practice_details, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Parties */}
        {intake.parties && intake.parties.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-2">Related Parties</label>
            <div className="space-y-2">
              {intake.parties.map((party: any, idx: number) => (
                <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="font-medium">{party.name} ({party.role})</p>
                  {party.contact_info && <p className="text-sm text-gray-500">{party.contact_info}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="files" className="space-y-4">
        {intake.uploads && intake.uploads.length > 0 ? (
          <div className="space-y-2">
            {intake.uploads.map((upload: any) => (
              <div key={upload.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{upload.file_name}</p>
                    <p className="text-sm text-gray-500">
                      {upload.tag} • {(upload.file_size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/GUROVICH/${upload.file_path}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </a>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No files uploaded</p>
        )}
      </TabsContent>

      <TabsContent value="notes" className="space-y-4">
        {intake.admin_notes && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg whitespace-pre-wrap text-sm">
            {intake.admin_notes}
          </div>
        )}
        
        <div className="space-y-2">
          <Textarea
            placeholder="Add a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
          />
          <Button 
            onClick={onAddNote} 
            disabled={!newNote.trim() || isAddingNote}
            className="w-full"
          >
            {isAddingNote ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <MessageSquare className="h-4 w-4 mr-2" />
            )}
            Add Note
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
