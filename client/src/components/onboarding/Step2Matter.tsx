import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { Loader2, Scale, AlertCircle, Car, Briefcase, Home, Gavel, AlertTriangle } from "lucide-react";
import type { PracticeArea } from "@shared/onboard-validation";

interface Step2Data {
  practice_area?: PracticeArea;
  issue_type_id?: number;
  urgency?: "emergency" | "high" | "normal" | "unsure";
  summary: string;
}

interface Step2MatterProps {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
}

const PRACTICE_AREAS = [
  { value: "personal_injury", label: "Personal Injury", icon: Car, description: "Car accidents, slip & fall, medical malpractice" },
  { value: "criminal_defense", label: "Criminal Defense", icon: Gavel, description: "DUI, misdemeanors, felonies, expungement" },
  { value: "employment_law", label: "Employment Law", icon: Briefcase, description: "Wrongful termination, discrimination, wage disputes" },
  { value: "tenant_rights", label: "Tenant Rights", icon: Home, description: "Eviction defense, habitability, security deposits" },
  { value: "civil_litigation", label: "Civil Litigation", icon: Scale, description: "Contract disputes, debt collection, business disputes" },
];

const URGENCY_LEVELS = [
  { value: "emergency", label: "Emergency", description: "Immediate legal action needed (arrest, eviction notice, etc.)" },
  { value: "high", label: "High Priority", description: "Deadline approaching within 30 days" },
  { value: "normal", label: "Normal", description: "No immediate deadline" },
  { value: "unsure", label: "Not Sure", description: "I'm not sure about the urgency" },
];

export default function Step2Matter({ data, onChange }: Step2MatterProps) {
  // Fetch issue types from database when practice area is selected
  const { 
    data: issueTypes, 
    isLoading: isLoadingTypes,
    error: issueTypesError,
    refetch: refetchIssueTypes
  } = trpc.onboard.getIssueTypes.useQuery(
    { practice_area: data.practice_area! },
    { 
      enabled: !!data.practice_area,
      retry: 2,
    }
  );

  // Reset issue_type_id when practice area changes
  useEffect(() => {
    if (data.practice_area && data.issue_type_id && issueTypes) {
      const isValidType = issueTypes.some(t => t.id === data.issue_type_id);
      if (!isValidType) {
        onChange({ ...data, issue_type_id: undefined });
      }
    }
  }, [data.practice_area, issueTypes]);

  // Refetch when practice area changes
  useEffect(() => {
    if (data.practice_area) {
      refetchIssueTypes();
    }
  }, [data.practice_area]);

  // Check if issue types are empty (after loading)
  const hasNoIssueTypes = !isLoadingTypes && !issueTypesError && (!issueTypes || issueTypes.length === 0);

  return (
    <div className="space-y-8">
      {/* Practice Area Selection */}
      <div className="space-y-4">
        <Label className="text-base font-medium">
          What type of legal matter do you need help with? <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRACTICE_AREAS.map((area) => {
            const Icon = area.icon;
            const isSelected = data.practice_area === area.value;
            return (
              <button
                key={area.value}
                type="button"
                onClick={() => onChange({ ...data, practice_area: area.value as PracticeArea, issue_type_id: undefined })}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? "bg-primary text-white" : "bg-gray-100"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${isSelected ? "text-primary" : "text-[#1A222B]"}`}>
                      {area.label}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{area.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Issue Type Selection */}
      {data.practice_area && (
        <div className="space-y-3">
          <Label htmlFor="issue_type">
            Specific Issue Type <span className="text-red-500">*</span>
          </Label>
          
          {/* Loading State */}
          {isLoadingTypes && (
            <div className="flex items-center gap-2 text-gray-500 p-3 bg-gray-50 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading issue types...</span>
            </div>
          )}
          
          {/* Error State */}
          {issueTypesError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Failed to load issue types. Please try selecting the practice area again or contact support.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Empty State - Admin Error */}
          {hasNoIssueTypes && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No issue types configured for this practice area. Please contact the administrator.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Success State - Show Dropdown */}
          {!isLoadingTypes && !issueTypesError && issueTypes && issueTypes.length > 0 && (
            <Select
              value={data.issue_type_id?.toString() || ""}
              onValueChange={(value) => onChange({ ...data, issue_type_id: parseInt(value) })}
            >
              <SelectTrigger className={!data.issue_type_id ? "text-gray-500" : ""}>
                <SelectValue placeholder="Select the specific issue" />
              </SelectTrigger>
              <SelectContent>
                {issueTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {/* Helper text */}
          {!isLoadingTypes && !issueTypesError && issueTypes && issueTypes.length > 0 && !data.issue_type_id && (
            <p className="text-sm text-amber-600">
              Please select a specific issue type to continue.
            </p>
          )}
        </div>
      )}

      {/* Urgency Level */}
      <div className="space-y-4">
        <Label className="text-base font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          How urgent is your matter? <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={data.urgency || ""}
          onValueChange={(value) =>
            onChange({ ...data, urgency: value as "emergency" | "high" | "normal" | "unsure" })
          }
          className="space-y-3"
        >
          {URGENCY_LEVELS.map((level) => (
            <div
              key={level.value}
              className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                data.urgency === level.value
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <RadioGroupItem value={level.value} id={`urgency_${level.value}`} className="mt-0.5" />
              <Label htmlFor={`urgency_${level.value}`} className="cursor-pointer flex-1">
                <span className="font-medium">{level.label}</span>
                <p className="text-sm text-gray-500">{level.description}</p>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Summary */}
      <div className="space-y-3">
        <Label htmlFor="summary">
          Brief Summary of Your Situation <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="summary"
          value={data.summary}
          onChange={(e) => onChange({ ...data, summary: e.target.value })}
          placeholder="Please provide a brief description of your legal matter (minimum 10 characters)..."
          rows={4}
          className="resize-none"
        />
        <p className="text-sm text-gray-500">
          {data.summary.length}/500 characters (minimum 10 required)
        </p>
      </div>
    </div>
  );
}
