import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import {
  Send,
  Loader2,
  Shield,
  MessageSquare,
  FileText,
  Scale,
  Gavel,
  Search,
  Plus,
  Trash2,
  BookOpen,
  ListTodo,
  Save,
  ChevronRight,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Star,
  Download,
  MoreVertical,
  Undo2,
} from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";

// Citation type colors
const citationColors: Record<string, string> = {
  INTAKE: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  NOTE: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  UPLOAD: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  STATUTE: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  CASELAW: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
};

// Static admin password - same as AdminDashboard
const ADMIN_PASSWORD = "&&77GAbriel";
const ADMIN_AUTH_KEY = "glg_admin_authenticated";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  citations?: any[];
  suggestedActions?: any[];
  createdAt: Date;
}

export default function Terminal() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearch();
  const [, setLocation] = useLocation();
  
  // Parse intakeId from URL
  const urlParams = new URLSearchParams(searchParams);
  const urlIntakeId = urlParams.get("intakeId");
  
  // State
  const [selectedIntakeId, setSelectedIntakeId] = useState<number | null>(
    urlIntakeId ? parseInt(urlIntakeId) : null
  );
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const [intakeSearch, setIntakeSearch] = useState("");
  const [showCitations, setShowCitations] = useState(true);
  const [showDocSearch, setShowDocSearch] = useState(false);
  const [docSearchQuery, setDocSearchQuery] = useState("");
  
  // Static password protection
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(ADMIN_AUTH_KEY) === "true";
    }
    return false;
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // tRPC queries
  const intakeListQuery = trpc.terminal.getIntakeList.useQuery(
    { search: intakeSearch, limit: 50 },
    { enabled: isAdminAuthenticated }
  );
  
  const sessionsQuery = trpc.terminal.listSessions.useQuery(
    { intakeId: selectedIntakeId || undefined, limit: 20 },
    { enabled: isAdminAuthenticated && !!selectedIntakeId }
  );
  
  const queryMutation = trpc.terminal.query.useMutation({
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: "assistant" as const,
        content: data.answer,
        citations: data.citations as any[],
        suggestedActions: data.suggestedActions as any[],
        createdAt: new Date(),
      }]);
      setCurrentSessionId(data.sessionId);
      setIsQuerying(false);
    },
    onError: (error) => {
      toast.error(error.message);
      setIsQuerying(false);
    },
  });
  
  const createTaskMutation = trpc.terminal.createTask.useMutation({
    onSuccess: () => {
      toast.success("Task created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const saveDraftMutation = trpc.terminal.saveDraft.useMutation({
    onSuccess: () => {
      toast.success("Draft saved successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const processUploadsMutation = trpc.terminal.processUploads.useMutation({
    onSuccess: (data) => {
      toast.success(`Processed ${data.processed} files (${data.failed} failed)`);
      uploadStatusQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  // Upload status query
  const uploadStatusQuery = trpc.terminal.getUploadStatus.useQuery(
    { intakeId: selectedIntakeId! },
    { enabled: isAdminAuthenticated && !!selectedIntakeId }
  );
  
  // Document search query
  const docSearchResults = trpc.terminal.searchDocuments.useQuery(
    { intakeId: selectedIntakeId!, query: docSearchQuery },
    { enabled: isAdminAuthenticated && !!selectedIntakeId && docSearchQuery.length >= 2 }
  );
  
  const deleteSessionMutation = trpc.terminal.deleteSession.useMutation({
    onSuccess: () => {
      toast.success("Session deleted permanently");
      sessionsQuery.refetch();
      if (currentSessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const toggleFavoriteMutation = trpc.terminal.toggleFavorite.useMutation({
    onSuccess: (data) => {
      toast.success(data.isFavorite ? "Added to favorites" : "Removed from favorites");
      sessionsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const softDeleteMutation = trpc.terminal.softDeleteSession.useMutation({
    onSuccess: () => {
      toast.success("Session moved to trash");
      sessionsQuery.refetch();
      if (currentSessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const restoreSessionMutation = trpc.terminal.restoreSession.useMutation({
    onSuccess: () => {
      toast.success("Session restored");
      sessionsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const exportPDFQuery = trpc.terminal.exportSessionPDF.useQuery(
    { sessionId: currentSessionId || "" },
    { enabled: false }
  );
  
  // Handle PDF export
  const handleExportPDF = async () => {
    if (!currentSessionId) return;
    
    try {
      const result = await exportPDFQuery.refetch();
      if (result.data) {
        // Generate PDF content as HTML
        const pdfData = result.data;
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${pdfData.title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
    h1 { color: #1a365d; border-bottom: 2px solid #1a365d; padding-bottom: 10px; }
    .meta { color: #666; margin-bottom: 20px; }
    .message { margin: 20px 0; padding: 15px; border-radius: 8px; }
    .user { background: #e3f2fd; border-left: 4px solid #1976d2; }
    .assistant { background: #f5f5f5; border-left: 4px solid #4caf50; }
    .role { font-weight: bold; margin-bottom: 5px; }
    .timestamp { font-size: 12px; color: #999; }
    .citations { margin-top: 10px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <h1>${pdfData.title}</h1>
  <div class="meta">
    <p><strong>Client:</strong> ${pdfData.clientName}</p>
    <p><strong>Practice Area:</strong> ${pdfData.practiceArea}</p>
    <p><strong>Date:</strong> ${new Date(pdfData.sessionDate).toLocaleString()}</p>
  </div>
  ${pdfData.messages.map(m => `
    <div class="message ${m.role}">
      <div class="role">${m.role === 'user' ? 'User' : 'Assistant'}</div>
      <div class="content">${m.content.replace(/\n/g, '<br>')}</div>
      <div class="timestamp">${new Date(m.timestamp).toLocaleString()}</div>
      ${m.citations && m.citations.length > 0 ? `<div class="citations">Citations: ${m.citations.map((c: any) => c.citation || c.type).join(', ')}</div>` : ''}
    </div>
  `).join('')}
</body>
</html>`;
        
        // Create blob and download
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${pdfData.title.replace(/[^a-z0-9]/gi, '_')}_session.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success("Session exported successfully");
      }
    } catch (error) {
      toast.error("Failed to export session");
    }
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Get session query
  const getSessionQuery = trpc.terminal.getSession.useQuery(
    { sessionId: currentSessionId || "" },
    { enabled: false }
  );
  
  // Load session when selected
  const loadSession = async (sessionId: string) => {
    try {
      setCurrentSessionId(sessionId);
      const result = await getSessionQuery.refetch();
      if (result.data) {
        setMessages((result.data.messages || []).map((m: any) => ({
          ...m,
          citations: m.citations as any[] | undefined,
          suggestedActions: m.suggestedActions as any[] | undefined,
        })));
        setSelectedIntakeId(result.data.intakeId);
      }
    } catch (error) {
      toast.error("Failed to load session");
    }
  };
  
  // Handle intake change
  const handleIntakeChange = (intakeId: string) => {
    const id = parseInt(intakeId);
    setSelectedIntakeId(id);
    setCurrentSessionId(null);
    setMessages([]);
    // Update URL
    setLocation(`/terminal?intakeId=${id}`);
  };
  
  // Handle send message
  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedIntakeId || isQuerying) return;
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: "user" as const,
      content: inputValue,
      createdAt: new Date(),
    }]);
    
    setIsQuerying(true);
    queryMutation.mutate({
      intakeId: selectedIntakeId,
      sessionId: currentSessionId || undefined,
      query: inputValue,
    });
    
    setInputValue("");
  };
  
  // Handle quick action
  const handleQuickAction = (action: string, payload?: any) => {
    if (!selectedIntakeId) return;
    
    switch (action) {
      case "query":
        setInputValue(payload?.query || "");
        break;
      case "createTask":
        if (payload?.title) {
          createTaskMutation.mutate({
            intakeId: selectedIntakeId,
            title: payload.title,
            description: payload.description,
            priority: payload.priority || "medium",
          });
        }
        break;
      case "saveDraft":
        if (payload?.type) {
          const lastAssistantMessage = messages.filter(m => m.role === "assistant").pop();
          saveDraftMutation.mutate({
            intakeId: selectedIntakeId,
            type: payload.type,
            title: payload.title || `Draft - ${new Date().toLocaleDateString()}`,
            content: { text: lastAssistantMessage?.content || "" },
          });
        }
        break;
    }
  };
  
  // Handle password submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
      setIsAdminAuthenticated(true);
      setPasswordError("");
      toast.success("Welcome to the Terminal");
    } else {
      setPasswordError("Incorrect password. Please try again.");
      setPasswordInput("");
    }
  };
  
  // Password protection screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
            <CardTitle>Admin Terminal</CardTitle>
            <CardDescription>Enter the admin password to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter admin password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                />
                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Access Terminal
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Global Site Header */}
      <Header />
      
      {/* Terminal Content */}
      <div className="flex-1 flex">
      {/* Session Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Sessions
          </h2>
        </div>
        
        <ScrollArea className="flex-1 p-2">
          {selectedIntakeId ? (
            sessionsQuery.data && sessionsQuery.data.length > 0 ? (
              <div className="space-y-1">
                {sessionsQuery.data.map((session: any) => (
                  <div
                    key={session.id}
                    className={`p-2 rounded-lg cursor-pointer flex items-center gap-2 group ${
                      currentSessionId === session.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => loadSession(session.id)}
                  >
                    {/* Favorite indicator */}
                    {session.isFavorite && (
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    )}
                    
                    <div className="truncate flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{session.title || "Untitled"}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.createdAt || session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {/* Session actions dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavoriteMutation.mutate({ sessionId: session.id });
                          }}
                        >
                          <Star className={`h-4 w-4 mr-2 ${session.isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                          {session.isFavorite ? 'Unfavorite' : 'Favorite'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            loadSession(session.id);
                            handleExportPDF();
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            softDeleteMutation.mutate({ sessionId: session.id });
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No sessions yet</p>
            )
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">Select a matter to view sessions</p>
          )}
        </ScrollArea>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setCurrentSessionId(null);
              setMessages([]);
            }}
            disabled={!selectedIntakeId}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Session
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Scale className="h-6 w-6 text-primary" />
                Legal Research Terminal
              </h1>
              
              {/* Matter Selector */}
              <div className="flex-1 max-w-md">
                <Select
                  value={selectedIntakeId?.toString() || ""}
                  onValueChange={handleIntakeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Matter (Intake)" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder="Search intakes..."
                        value={intakeSearch}
                        onChange={(e) => setIntakeSearch(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    {intakeListQuery.data?.map((intake) => (
                      <SelectItem key={intake.id} value={intake.id.toString()}>
                        {intake.name}
                        {intake.practiceArea && (
                          <span className="text-xs text-gray-500 ml-2">
                            ({intake.practiceArea.replace("_", " ")})
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Active Scope Badge */}
              {selectedIntakeId && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Active Scope: Intake #{selectedIntakeId}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Upload Status Badge */}
              {uploadStatusQuery.data && selectedIntakeId && (
                <Badge 
                  variant={uploadStatusQuery.data.pending.length > 0 ? "secondary" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setShowDocSearch(!showDocSearch)}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  {uploadStatusQuery.data.processed}/{uploadStatusQuery.data.total} docs indexed
                </Badge>
              )}
              <Button
                variant={showDocSearch ? "default" : "outline"}
                size="sm"
                onClick={() => setShowDocSearch(!showDocSearch)}
                disabled={!selectedIntakeId}
              >
                <Search className="h-4 w-4 mr-2" />
                Search Docs
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => processUploadsMutation.mutate({ intakeId: selectedIntakeId! })}
                disabled={!selectedIntakeId || processUploadsMutation.isPending}
              >
                {processUploadsMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Process Uploads
              </Button>
              {currentSessionId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Session
                </Button>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Admin Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Document Search Panel */}
        {showDocSearch && selectedIntakeId && (
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search documents by keyword..."
                    value={docSearchQuery}
                    onChange={(e) => setDocSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowDocSearch(false);
                    setDocSearchQuery("");
                  }}
                >
                  Close
                </Button>
              </div>
              
              {/* Upload Status */}
              {uploadStatusQuery.data && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {uploadStatusQuery.data.total} documents total | 
                      {uploadStatusQuery.data.processed} indexed | 
                      {uploadStatusQuery.data.pending.length} pending
                    </span>
                    {uploadStatusQuery.data.pending.length > 0 && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => processUploadsMutation.mutate({ intakeId: selectedIntakeId })}
                        disabled={processUploadsMutation.isPending}
                      >
                        {processUploadsMutation.isPending ? "Processing..." : "Index pending docs"}
                      </Button>
                    )}
                  </div>
                  
                  {/* Document List */}
                  {uploadStatusQuery.data.pending.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-500 mb-1">Pending documents:</p>
                      {uploadStatusQuery.data.pending.map((upload: { id: number; file_name: string }) => (
                        <div key={upload.id} className="flex items-center gap-2 text-xs">
                          <FileText className="h-3 w-3 text-gray-400" />
                          <span className="truncate flex-1">{upload.file_name}</span>
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-2 w-2 mr-1" />
                            Pending
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Search Results */}
              {docSearchQuery.length >= 2 && (
                <div className="space-y-2">
                  {docSearchResults.isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                  ) : docSearchResults.data && docSearchResults.data.length > 0 ? (
                    <>
                      <p className="text-sm text-gray-500 mb-2">
                        Found {docSearchResults.data.length} results for "{docSearchQuery}"
                      </p>
                      {docSearchResults.data.map((result, idx) => (
                        <Card key={idx} className="p-3">
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{result.file_name}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-3">
                                {result.snippet}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  Relevance: {result.rank}
                                </Badge>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="text-xs h-auto p-0"
                                  onClick={() => {
                                    setInputValue(`What does the document "${result.file_name}" say about ${docSearchQuery}?`);
                                    setShowDocSearch(false);
                                  }}
                                >
                                  Ask about this →
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </>
                  ) : docSearchResults.data?.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No results found for "{docSearchQuery}"
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Chat Area */}
        <div className="flex-1 flex">
          {/* Messages */}
          <div className="flex-1 flex flex-col">
            {!selectedIntakeId ? (
              <div className="flex-1 flex items-center justify-center">
                <Card className="max-w-md text-center">
                  <CardHeader>
                    <AlertCircle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
                    <CardTitle>Select a Matter to Begin</CardTitle>
                    <CardDescription>
                      Choose an intake from the dropdown above to start querying.
                      The terminal is scoped to a single matter for data isolation.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1 p-4">
                  <div className="max-w-3xl mx-auto space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">
                          Start a conversation about Intake #{selectedIntakeId}
                        </p>
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAction("query", { query: "Summarize this intake" })}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Summarize Intake
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAction("query", { query: "What statutes apply to this case?" })}
                          >
                            <BookOpen className="h-4 w-4 mr-1" />
                            Statute Lookup
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAction("query", { query: "Find relevant case law" })}
                          >
                            <Gavel className="h-4 w-4 mr-1" />
                            Case Law Search
                          </Button>
                        </div>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-4 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            {message.role === "assistant" ? (
                              <div className="prose prose-sm dark:prose-invert max-w-none">
                                <Streamdown>{message.content}</Streamdown>
                              </div>
                            ) : (
                              <p>{message.content}</p>
                            )}
                            
                            {/* Citations */}
                            {message.citations && message.citations.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                <p className="text-xs font-medium mb-2 text-gray-500">Citations:</p>
                                <div className="flex flex-wrap gap-1">
                                  {message.citations.map((citation, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className={`text-xs ${citationColors[citation.type] || ""}`}
                                    >
                                      {citation.type === "UPLOAD" && citation.file_name
                                        ? `📄 ${citation.file_name}`
                                        : citation.type === "STATUTE" && citation.citation
                                        ? `⚖️ ${citation.citation}`
                                        : citation.type === "CASELAW" && citation.citation
                                        ? `📚 ${citation.citation}`
                                        : `${citation.type} #${citation.id}`}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Suggested Actions */}
                            {message.suggestedActions && message.suggestedActions.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                <p className="text-xs font-medium mb-2 text-gray-500">Actions:</p>
                                <div className="flex flex-wrap gap-2">
                                  {message.suggestedActions.map((action: any, idx: number) => (
                                    <Button
                                      key={idx}
                                      variant="outline"
                                      size="sm"
                                      className="text-xs"
                                      onClick={() => handleQuickAction(action.action, action.payload)}
                                    >
                                      {action.action === "saveDraft" && <Save className="h-3 w-3 mr-1" />}
                                      {action.action === "createTask" && <ListTodo className="h-3 w-3 mr-1" />}
                                      {action.action === "query" && <Search className="h-3 w-3 mr-1" />}
                                      {action.label}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    
                    {isQuerying && (
                      <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* Input Area */}
                <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Ask about this intake, search statutes, find case law..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="min-h-[60px] resize-none"
                        disabled={isQuerying}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isQuerying}
                        className="self-end"
                      >
                        {isQuerying ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Quick Action Chips */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => setInputValue("Summarize the uploaded documents")}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Summarize Uploads
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => setInputValue("What is the statute of limitations for this case?")}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Statute of Limitations
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => setInputValue("Draft discovery requests for this case")}
                      >
                        <ListTodo className="h-3 w-3 mr-1" />
                        Draft Discovery
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => setInputValue("What information is missing from this intake?")}
                      >
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Missing Info
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
