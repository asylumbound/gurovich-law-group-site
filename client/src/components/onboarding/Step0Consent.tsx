import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertTriangle } from "lucide-react";

interface Step0Data {
  consent_no_attorney_relationship: boolean;
  consent_contact: boolean;
  preferred_contact_method: "phone" | "email" | "text";
  preferred_language: "en" | "es" | "hy" | "ru" | "uk";
}

interface Step0ConsentProps {
  data: Step0Data;
  onChange: (data: Step0Data) => void;
}

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "hy", label: "Հայերdelays" },
  { value: "ru", label: "Русский" },
  { value: "uk", label: "Українська" },
];

const CONTACT_METHODS = [
  { value: "phone", label: "Phone Call" },
  { value: "email", label: "Email" },
  { value: "text", label: "Text Message" },
];

export default function Step0Consent({ data, onChange }: Step0ConsentProps) {
  return (
    <div className="space-y-8">
      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-amber-800 mb-1">Important Notice</h3>
          <p className="text-sm text-amber-700">
            Please read and acknowledge the following disclaimers before proceeding with your intake form.
          </p>
        </div>
      </div>

      {/* Disclaimer 1: No Attorney-Client Relationship */}
      <div className="space-y-3">
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h4 className="font-medium text-[#1A222B] mb-2">No Attorney-Client Relationship</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Submitting this questionnaire does not create an attorney-client relationship between you and 
            Gurovich Law Group. An attorney-client relationship is only established after a formal 
            engagement agreement has been signed by both parties. The information you provide will be 
            used to evaluate your potential case and determine if we can assist you.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox
            id="consent_no_attorney"
            checked={data.consent_no_attorney_relationship}
            onCheckedChange={(checked) =>
              onChange({ ...data, consent_no_attorney_relationship: checked as boolean })
            }
          />
          <Label
            htmlFor="consent_no_attorney"
            className="text-sm cursor-pointer leading-relaxed"
          >
            I understand and acknowledge that submitting this form does not create an attorney-client 
            relationship with Gurovich Law Group.
          </Label>
        </div>
      </div>

      {/* Disclaimer 2: Consent to Contact */}
      <div className="space-y-3">
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h4 className="font-medium text-[#1A222B] mb-2">Consent to Contact</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            By providing your contact information, you consent to receive communications from 
            Gurovich Law Group regarding your inquiry. We may contact you via phone, email, or text 
            message to discuss your potential case. You may opt out of communications at any time.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox
            id="consent_contact"
            checked={data.consent_contact}
            onCheckedChange={(checked) =>
              onChange({ ...data, consent_contact: checked as boolean })
            }
          />
          <Label
            htmlFor="consent_contact"
            className="text-sm cursor-pointer leading-relaxed"
          >
            I consent to be contacted by Gurovich Law Group regarding my inquiry via phone, email, 
            or text message.
          </Label>
        </div>
      </div>

      {/* Preferred Contact Method */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Preferred Contact Method</Label>
        <RadioGroup
          value={data.preferred_contact_method}
          onValueChange={(value) =>
            onChange({ ...data, preferred_contact_method: value as "phone" | "email" | "text" })
          }
          className="grid grid-cols-3 gap-4"
        >
          {CONTACT_METHODS.map((method) => (
            <div key={method.value} className="flex items-center space-x-2">
              <RadioGroupItem value={method.value} id={`contact_${method.value}`} />
              <Label htmlFor={`contact_${method.value}`} className="cursor-pointer">
                {method.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Preferred Language */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Preferred Language</Label>
        <RadioGroup
          value={data.preferred_language}
          onValueChange={(value) =>
            onChange({ ...data, preferred_language: value as "en" | "es" | "hy" | "ru" | "uk" })
          }
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {LANGUAGES.map((lang) => (
            <div key={lang.value} className="flex items-center space-x-2">
              <RadioGroupItem value={lang.value} id={`lang_${lang.value}`} />
              <Label htmlFor={`lang_${lang.value}`} className="cursor-pointer">
                {lang.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
