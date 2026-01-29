import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Upload,
  File,
  Trash2,
  Loader2,
  CheckCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Scale,
  Calendar,
  FileText,
} from "lucide-react";
import type { PracticeArea } from "@shared/onboard-validation";

interface UploadedFile {
  id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  tag: string;
}

interface Step5Data {
  additional_notes: string;
  uploads: UploadedFile[];
}

interface AllData {
  step0: {
    consent_no_attorney_relationship: boolean;
    consent_contact: boolean;
    preferred_contact_method: string;
    preferred_language: string;
  };
  step1: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    city: string;
    state: string;
    best_time_to_contact?: string;
    is_affected_person: boolean;
    relationship_to_affected?: string;
  };
  step2: {
    practice_area?: PracticeArea;
    issue_type_id?: number;
    urgency?: string;
    summary: string;
  };
  step3: {
    incident_date: string;
    incident_date_unknown: boolean;
    incident_city: string;
    incident_state: string;
    agency_involved: boolean;
    agency_name: string;
    report_number: string;
    has_documents: boolean;
    parties: Array<{
      party_type: string;
      party_role: string;
      name: string;
      phone: string;
      email: string;
    }>;
  };
  step4: Record<string, unknown>;
  practiceArea: PracticeArea | null;
}

interface Step5ReviewProps {
  draftToken: string;
  data: Step5Data;
  onChange: (data: Step5Data) => void;
  allData: AllData;
}

const PRACTICE_AREA_LABELS: Record<string, string> = {
  personal_injury: "Personal Injury",
  criminal_defense: "Criminal Defense",
  employment: "Employment Law",
  tenant_rights: "Tenant Rights",
  civil_litigation: "Civil Litigation",
};

const URGENCY_LABELS: Record<string, string> = {
  emergency: "Emergency",
  high: "High Priority",
  normal: "Normal",
  unsure: "Not Sure",
};

const FILE_TAGS = [
  { value: "contract", label: "Contract/Agreement" },
  { value: "medical", label: "Medical Records" },
  { value: "photo", label: "Photos/Evidence" },
  { value: "correspondence", label: "Correspondence" },
  { value: "court", label: "Court Documents" },
  { value: "financial", label: "Financial Records" },
  { value: "other", label: "Other" },
];

export default function Step5Review({ draftToken, data, onChange, allData }: Step5ReviewProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTag, setSelectedTag] = useState("other");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = trpc.onboard.uploadFile.useMutation();
  const deleteFile = trpc.onboard.deleteFile.useMutation();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    for (const file of Array.from(files)) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type.`);
        continue;
      }

      try {
        // Convert file to base64
        const base64 = await fileToBase64(file);
        
        const result = await uploadFile.mutateAsync({
          draftToken,
          fileName: file.name,
          fileData: base64,
          mimeType: file.type,
          tag: selectedTag,
        });

        onChange({
          ...data,
          uploads: [
            ...data.uploads,
            {
              id: result.uploadId,
              file_name: file.name,
              file_path: result.filePath,
              file_size: file.size,
              mime_type: file.type,
              tag: selectedTag,
            },
          ],
        });

        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteFile = async (uploadId: number, fileName: string) => {
    try {
      await deleteFile.mutateAsync({ draftToken, uploadId });
      onChange({
        ...data,
        uploads: data.uploads.filter((u) => u.id !== uploadId),
      });
      toast.success(`${fileName} deleted`);
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-8">
      {/* Summary Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-[#1A222B] flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Review Your Information
        </h3>

        {/* Contact Info Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <User className="w-4 h-4" />
            Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Name:</span>{" "}
              <span className="font-medium">{allData.step1.first_name} {allData.step1.last_name}</span>
            </div>
            {allData.step1.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-gray-400" />
                <span>{allData.step1.phone}</span>
              </div>
            )}
            {allData.step1.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-gray-400" />
                <span>{allData.step1.email}</span>
              </div>
            )}
            {allData.step1.city && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span>{allData.step1.city}, {allData.step1.state}</span>
              </div>
            )}
          </div>
        </div>

        {/* Matter Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Scale className="w-4 h-4" />
            Legal Matter
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Practice Area:</span>{" "}
              <span className="font-medium">
                {allData.step2.practice_area ? PRACTICE_AREA_LABELS[allData.step2.practice_area] : "Not selected"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Urgency:</span>{" "}
              <span className="font-medium">
                {allData.step2.urgency ? URGENCY_LABELS[allData.step2.urgency] : "Not selected"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Summary:</span>
              <p className="mt-1 text-gray-700">{allData.step2.summary || "No summary provided"}</p>
            </div>
          </div>
        </div>

        {/* Incident Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Incident Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Date:</span>{" "}
              <span className="font-medium">
                {allData.step3.incident_date_unknown
                  ? "Unknown"
                  : allData.step3.incident_date || "Not provided"}
              </span>
            </div>
            {allData.step3.incident_city && (
              <div>
                <span className="text-gray-500">Location:</span>{" "}
                <span className="font-medium">
                  {allData.step3.incident_city}, {allData.step3.incident_state}
                </span>
              </div>
            )}
            {allData.step3.agency_involved && (
              <div>
                <span className="text-gray-500">Agency:</span>{" "}
                <span className="font-medium">{allData.step3.agency_name}</span>
              </div>
            )}
            {allData.step3.parties.length > 0 && (
              <div>
                <span className="text-gray-500">Other Parties:</span>{" "}
                <span className="font-medium">{allData.step3.parties.length} listed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium text-[#1A222B] flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Upload Documents (Optional)
        </h3>
        <p className="text-sm text-gray-500">
          Upload any relevant documents such as contracts, photos, medical records, or correspondence.
          Maximum file size: 10MB. Supported formats: PDF, JPG, PNG, DOC, DOCX.
        </p>

        {/* Tag Selection */}
        <div className="flex flex-wrap gap-2">
          {FILE_TAGS.map((tag) => (
            <button
              key={tag.value}
              type="button"
              onClick={() => setSelectedTag(tag.value)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTag === tag.value
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Upload Button */}
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {isUploading ? "Uploading..." : "Upload Files"}
          </Button>
        </div>

        {/* Uploaded Files List */}
        {data.uploads.length > 0 && (
          <div className="space-y-2">
            <Label>Uploaded Files ({data.uploads.length})</Label>
            <div className="space-y-2">
              {data.uploads.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <File className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">{file.file_name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.file_size)} • {FILE_TAGS.find(t => t.value === file.tag)?.label || file.tag}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteFile(file.id, file.file_name)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Additional Notes */}
      <div className="space-y-3 pt-4 border-t">
        <Label htmlFor="additional_notes">Additional Notes (Optional)</Label>
        <Textarea
          id="additional_notes"
          value={data.additional_notes}
          onChange={(e) => onChange({ ...data, additional_notes: e.target.value })}
          placeholder="Is there anything else you'd like us to know about your case?"
          rows={4}
          className="resize-none"
        />
      </div>

      {/* Final Confirmation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Ready to submit?</strong> Please review all information above before clicking the
          "Submit Intake" button. Our team will review your submission and contact you within 1-2
          business days.
        </p>
      </div>
    </div>
  );
}
