import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Phone, Mail, MapPin } from "lucide-react";

interface Step1Data {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  best_time_to_contact?: "morning" | "afternoon" | "evening" | "anytime";
  is_affected_person: boolean;
  relationship_to_affected?: string;
}

interface Step1ContactProps {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
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

const BEST_TIMES = [
  { value: "morning", label: "Morning (8am - 12pm)" },
  { value: "afternoon", label: "Afternoon (12pm - 5pm)" },
  { value: "evening", label: "Evening (5pm - 8pm)" },
  { value: "anytime", label: "Anytime" },
];

const RELATIONSHIPS = [
  { value: "spouse", label: "Spouse/Partner" },
  { value: "parent", label: "Parent" },
  { value: "child", label: "Child" },
  { value: "sibling", label: "Sibling" },
  { value: "friend", label: "Friend" },
  { value: "attorney", label: "Attorney/Legal Representative" },
  { value: "other", label: "Other" },
];

export default function Step1Contact({ data, onChange }: Step1ContactProps) {
  return (
    <div className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="first_name"
            value={data.first_name}
            onChange={(e) => onChange({ ...data, first_name: e.target.value })}
            placeholder="Enter your first name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="last_name"
            value={data.last_name}
            onChange={(e) => onChange({ ...data, last_name: e.target.value })}
            placeholder="Enter your last name"
          />
        </div>
      </div>

      {/* Contact Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            placeholder="(555) 123-4567"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            placeholder="you@example.com"
          />
        </div>
      </div>
      <p className="text-sm text-gray-500">
        Please provide at least one contact method (phone or email).
      </p>

      {/* Location Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            City
          </Label>
          <Input
            id="city"
            value={data.city}
            onChange={(e) => onChange({ ...data, city: e.target.value })}
            placeholder="Los Angeles"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select
            value={data.state}
            onValueChange={(value) => onChange({ ...data, state: value })}
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

      {/* Best Time to Contact */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Best Time to Contact</Label>
        <RadioGroup
          value={data.best_time_to_contact || ""}
          onValueChange={(value) =>
            onChange({
              ...data,
              best_time_to_contact: value as "morning" | "afternoon" | "evening" | "anytime",
            })
          }
          className="grid grid-cols-2 gap-4"
        >
          {BEST_TIMES.map((time) => (
            <div key={time.value} className="flex items-center space-x-2">
              <RadioGroupItem value={time.value} id={`time_${time.value}`} />
              <Label htmlFor={`time_${time.value}`} className="cursor-pointer text-sm">
                {time.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Is Affected Person */}
      <div className="space-y-4 pt-4 border-t">
        <Label className="text-base font-medium">
          Are you the person directly affected by this legal matter?
        </Label>
        <RadioGroup
          value={data.is_affected_person ? "yes" : "no"}
          onValueChange={(value) =>
            onChange({ ...data, is_affected_person: value === "yes" })
          }
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="affected_yes" />
            <Label htmlFor="affected_yes" className="cursor-pointer">
              Yes, I am the affected person
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="affected_no" />
            <Label htmlFor="affected_no" className="cursor-pointer">
              No, I am contacting on behalf of someone else
            </Label>
          </div>
        </RadioGroup>

        {/* Relationship to Affected Person */}
        {!data.is_affected_person && (
          <div className="space-y-2 pl-4 border-l-2 border-primary/20">
            <Label htmlFor="relationship">Your relationship to the affected person</Label>
            <Select
              value={data.relationship_to_affected || ""}
              onValueChange={(value) =>
                onChange({ ...data, relationship_to_affected: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {RELATIONSHIPS.map((rel) => (
                  <SelectItem key={rel.value} value={rel.value}>
                    {rel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
