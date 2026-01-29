import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Building, Plus, Trash2, Users } from "lucide-react";

interface Party {
  party_type: "individual" | "business" | "government" | "insurance" | "other";
  party_role: "defendant" | "plaintiff" | "witness" | "employer" | "landlord" | "tenant" | "other";
  name: string;
  phone: string;
  email: string;
}

interface Step3Data {
  incident_date: string;
  incident_date_unknown: boolean;
  incident_city: string;
  incident_state: string;
  agency_involved: boolean;
  agency_name: string;
  report_number: string;
  has_documents: boolean;
  parties: Party[];
}

interface Step3FactsProps {
  data: Step3Data;
  onChange: (data: Step3Data) => void;
}

const US_STATES = [
  { value: "CA", label: "California" },
  { value: "AZ", label: "Arizona" },
  { value: "NV", label: "Nevada" },
  { value: "OR", label: "Oregon" },
  { value: "WA", label: "Washington" },
  { value: "TX", label: "Texas" },
  { value: "NY", label: "New York" },
  { value: "FL", label: "Florida" },
  { value: "OTHER", label: "Other State" },
];

const PARTY_TYPES = [
  { value: "individual", label: "Individual Person" },
  { value: "business", label: "Business/Company" },
  { value: "government", label: "Government Agency" },
  { value: "insurance", label: "Insurance Company" },
  { value: "other", label: "Other" },
];

const PARTY_ROLES = [
  { value: "defendant", label: "Defendant/Opposing Party" },
  { value: "plaintiff", label: "Plaintiff/Claimant" },
  { value: "witness", label: "Witness" },
  { value: "employer", label: "Employer" },
  { value: "landlord", label: "Landlord" },
  { value: "tenant", label: "Tenant" },
  { value: "other", label: "Other" },
];

export default function Step3Facts({ data, onChange }: Step3FactsProps) {
  const addParty = () => {
    onChange({
      ...data,
      parties: [
        ...data.parties,
        {
          party_type: "individual",
          party_role: "defendant",
          name: "",
          phone: "",
          email: "",
        },
      ],
    });
  };

  const removeParty = (index: number) => {
    onChange({
      ...data,
      parties: data.parties.filter((_, i) => i !== index),
    });
  };

  const updateParty = (index: number, updates: Partial<Party>) => {
    onChange({
      ...data,
      parties: data.parties.map((party, i) =>
        i === index ? { ...party, ...updates } : party
      ),
    });
  };

  return (
    <div className="space-y-8">
      {/* Incident Date */}
      <div className="space-y-4">
        <Label className="text-base font-medium flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          When did the incident occur?
        </Label>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              id="date_unknown"
              checked={data.incident_date_unknown}
              onCheckedChange={(checked) =>
                onChange({
                  ...data,
                  incident_date_unknown: checked as boolean,
                  incident_date: checked ? "" : data.incident_date,
                })
              }
            />
            <Label htmlFor="date_unknown" className="cursor-pointer text-sm">
              I don't know the exact date
            </Label>
          </div>
          {!data.incident_date_unknown && (
            <Input
              type="date"
              value={data.incident_date}
              onChange={(e) => onChange({ ...data, incident_date: e.target.value })}
              max={new Date().toISOString().split("T")[0]}
            />
          )}
        </div>
      </div>

      {/* Incident Location */}
      <div className="space-y-4">
        <Label className="text-base font-medium flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Where did the incident occur?
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="incident_city">City</Label>
            <Input
              id="incident_city"
              value={data.incident_city}
              onChange={(e) => onChange({ ...data, incident_city: e.target.value })}
              placeholder="Los Angeles"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="incident_state">State</Label>
            <Select
              value={data.incident_state}
              onValueChange={(value) => onChange({ ...data, incident_state: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Agency Involvement */}
      <div className="space-y-4">
        <Label className="text-base font-medium flex items-center gap-2">
          <Building className="w-4 h-4" />
          Was any agency involved? (Police, EEOC, Labor Board, etc.)
        </Label>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              id="agency_involved"
              checked={data.agency_involved}
              onCheckedChange={(checked) =>
                onChange({
                  ...data,
                  agency_involved: checked as boolean,
                  agency_name: checked ? data.agency_name : "",
                  report_number: checked ? data.report_number : "",
                })
              }
            />
            <Label htmlFor="agency_involved" className="cursor-pointer">
              Yes, an agency was involved
            </Label>
          </div>
          {data.agency_involved && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-primary/20">
              <div className="space-y-2">
                <Label htmlFor="agency_name">Agency Name</Label>
                <Input
                  id="agency_name"
                  value={data.agency_name}
                  onChange={(e) => onChange({ ...data, agency_name: e.target.value })}
                  placeholder="e.g., LAPD, EEOC, Labor Board"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report_number">Report/Case Number (if known)</Label>
                <Input
                  id="report_number"
                  value={data.report_number}
                  onChange={(e) => onChange({ ...data, report_number: e.target.value })}
                  placeholder="e.g., DR-123456"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Documents */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Checkbox
            id="has_documents"
            checked={data.has_documents}
            onCheckedChange={(checked) =>
              onChange({ ...data, has_documents: checked as boolean })
            }
          />
          <Label htmlFor="has_documents" className="cursor-pointer">
            I have documents related to this matter (contracts, photos, reports, etc.)
          </Label>
        </div>
        {data.has_documents && (
          <p className="text-sm text-gray-500 pl-6">
            You'll be able to upload documents in the final step.
          </p>
        )}
      </div>

      {/* Parties Involved */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium flex items-center gap-2">
            <Users className="w-4 h-4" />
            Other Parties Involved (Optional)
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addParty}
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Party
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          Add information about other parties involved in your case (defendants, witnesses, employers, etc.)
        </p>

        {data.parties.map((party, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg bg-gray-50 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Party #{index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeParty(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Party Type</Label>
                <Select
                  value={party.party_type}
                  onValueChange={(value) =>
                    updateParty(index, { party_type: value as Party["party_type"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PARTY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Role in Case</Label>
                <Select
                  value={party.party_role}
                  onValueChange={(value) =>
                    updateParty(index, { party_role: value as Party["party_role"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PARTY_ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={party.name}
                onChange={(e) => updateParty(index, { name: e.target.value })}
                placeholder="Full name or business name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone (if known)</Label>
                <Input
                  type="tel"
                  value={party.phone}
                  onChange={(e) => updateParty(index, { phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label>Email (if known)</Label>
                <Input
                  type="email"
                  value={party.email}
                  onChange={(e) => updateParty(index, { email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>
        ))}

        {data.parties.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4 border border-dashed rounded-lg">
            No parties added yet. Click "Add Party" to include information about other parties.
          </p>
        )}
      </div>
    </div>
  );
}
