import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PracticeArea } from "@shared/onboard-validation";

interface Step4DetailsProps {
  practiceArea: PracticeArea;
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export default function Step4Details({ practiceArea, data, onChange }: Step4DetailsProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  switch (practiceArea) {
    case "personal_injury":
      return <PersonalInjuryDetails data={data} onChange={updateField} />;
    case "criminal_defense":
      return <CriminalDefenseDetails data={data} onChange={updateField} />;
    case "employment_law":
      return <EmploymentDetails data={data} onChange={updateField} />;
    case "tenant_rights":
      return <TenantRightsDetails data={data} onChange={updateField} />;
    case "civil_litigation":
      return <CivilLitigationDetails data={data} onChange={updateField} />;
    default:
      return <div>Unknown practice area</div>;
  }
}

// Personal Injury Details
function PersonalInjuryDetails({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-[#1A222B]">Personal Injury Details</h3>
      
      {/* Injury Type */}
      <div className="space-y-3">
        <Label>Type of Injury (select all that apply)</Label>
        <div className="grid grid-cols-2 gap-3">
          {["Soft tissue", "Broken bones", "Head/brain injury", "Spinal injury", "Internal injuries", "Burns", "Scarring/disfigurement", "Other"].map((injury) => (
            <div key={injury} className="flex items-center gap-2">
              <Checkbox
                id={`injury_${injury}`}
                checked={(data.injury_types as string[] || []).includes(injury)}
                onCheckedChange={(checked) => {
                  const current = (data.injury_types as string[]) || [];
                  onChange(
                    "injury_types",
                    checked ? [...current, injury] : current.filter((i) => i !== injury)
                  );
                }}
              />
              <Label htmlFor={`injury_${injury}`} className="cursor-pointer text-sm">
                {injury}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Treatment */}
      <div className="space-y-3">
        <Label>Have you received medical treatment?</Label>
        <RadioGroup
          value={data.medical_treatment as string || ""}
          onValueChange={(value) => onChange("medical_treatment", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes_ongoing" id="med_ongoing" />
            <Label htmlFor="med_ongoing" className="cursor-pointer">Yes, and treatment is ongoing</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes_completed" id="med_completed" />
            <Label htmlFor="med_completed" className="cursor-pointer">Yes, treatment is completed</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="med_no" />
            <Label htmlFor="med_no" className="cursor-pointer">No, I haven't received treatment</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Lost Wages */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="lost_wages"
            checked={data.lost_wages as boolean || false}
            onCheckedChange={(checked) => onChange("lost_wages", checked)}
          />
          <Label htmlFor="lost_wages" className="cursor-pointer">
            I have lost wages due to this injury
          </Label>
        </div>
      </div>

      {/* Insurance Claim */}
      <div className="space-y-3">
        <Label>Has an insurance claim been filed?</Label>
        <RadioGroup
          value={data.insurance_claim_filed as string || ""}
          onValueChange={(value) => onChange("insurance_claim_filed", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="claim_yes" />
            <Label htmlFor="claim_yes" className="cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="claim_no" />
            <Label htmlFor="claim_no" className="cursor-pointer">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unsure" id="claim_unsure" />
            <Label htmlFor="claim_unsure" className="cursor-pointer">Not sure</Label>
          </div>
        </RadioGroup>
      </div>

      {/* At-Fault Party */}
      <div className="space-y-2">
        <Label htmlFor="at_fault_party">Who do you believe is at fault?</Label>
        <Input
          id="at_fault_party"
          value={data.at_fault_party as string || ""}
          onChange={(e) => onChange("at_fault_party", e.target.value)}
          placeholder="Name of person, company, or entity"
        />
      </div>
    </div>
  );
}

// Criminal Defense Details
function CriminalDefenseDetails({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-[#1A222B]">Criminal Defense Details</h3>

      {/* Charges */}
      <div className="space-y-2">
        <Label htmlFor="charges">What charges are you facing? (if known)</Label>
        <Textarea
          id="charges"
          value={data.charges as string || ""}
          onChange={(e) => onChange("charges", e.target.value)}
          placeholder="List the charges or describe the allegations"
          rows={3}
        />
      </div>

      {/* Court Date */}
      <div className="space-y-2">
        <Label htmlFor="court_date">Next court date (if scheduled)</Label>
        <Input
          id="court_date"
          type="date"
          value={data.court_date as string || ""}
          onChange={(e) => onChange("court_date", e.target.value)}
        />
      </div>

      {/* Case Number */}
      <div className="space-y-2">
        <Label htmlFor="case_number">Case number (if known)</Label>
        <Input
          id="case_number"
          value={data.case_number as string || ""}
          onChange={(e) => onChange("case_number", e.target.value)}
          placeholder="e.g., BA123456"
        />
      </div>

      {/* Bail Status */}
      <div className="space-y-3">
        <Label>Current custody status</Label>
        <RadioGroup
          value={data.custody_status as string || ""}
          onValueChange={(value) => onChange("custody_status", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="released_or" id="custody_or" />
            <Label htmlFor="custody_or" className="cursor-pointer">Released on own recognizance</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="released_bail" id="custody_bail" />
            <Label htmlFor="custody_bail" className="cursor-pointer">Released on bail</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="in_custody" id="custody_in" />
            <Label htmlFor="custody_in" className="cursor-pointer">Currently in custody</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="not_arrested" id="custody_not" />
            <Label htmlFor="custody_not" className="cursor-pointer">Not yet arrested</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Prior Record */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="prior_record"
            checked={data.prior_record as boolean || false}
            onCheckedChange={(checked) => onChange("prior_record", checked)}
          />
          <Label htmlFor="prior_record" className="cursor-pointer">
            I have a prior criminal record
          </Label>
        </div>
      </div>
    </div>
  );
}

// Employment Details
function EmploymentDetails({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-[#1A222B]">Employment Law Details</h3>

      {/* Employment Status */}
      <div className="space-y-3">
        <Label>Current employment status</Label>
        <RadioGroup
          value={data.employment_status as string || ""}
          onValueChange={(value) => onChange("employment_status", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="currently_employed" id="emp_current" />
            <Label htmlFor="emp_current" className="cursor-pointer">Currently employed at this company</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="terminated" id="emp_terminated" />
            <Label htmlFor="emp_terminated" className="cursor-pointer">Terminated/Fired</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="resigned" id="emp_resigned" />
            <Label htmlFor="emp_resigned" className="cursor-pointer">Resigned</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="on_leave" id="emp_leave" />
            <Label htmlFor="emp_leave" className="cursor-pointer">On leave</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Employer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employer_name">Employer name</Label>
          <Input
            id="employer_name"
            value={data.employer_name as string || ""}
            onChange={(e) => onChange("employer_name", e.target.value)}
            placeholder="Company name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="job_title">Your job title</Label>
          <Input
            id="job_title"
            value={data.job_title as string || ""}
            onChange={(e) => onChange("job_title", e.target.value)}
            placeholder="e.g., Manager, Sales Associate"
          />
        </div>
      </div>

      {/* Employment Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Employment start date</Label>
          <Input
            id="start_date"
            type="date"
            value={data.start_date as string || ""}
            onChange={(e) => onChange("start_date", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">Employment end date (if applicable)</Label>
          <Input
            id="end_date"
            type="date"
            value={data.end_date as string || ""}
            onChange={(e) => onChange("end_date", e.target.value)}
          />
        </div>
      </div>

      {/* Discrimination Type */}
      <div className="space-y-3">
        <Label>Type of issue (select all that apply)</Label>
        <div className="grid grid-cols-2 gap-3">
          {["Wrongful termination", "Discrimination", "Harassment", "Retaliation", "Wage theft", "Unpaid overtime", "Meal/rest break violations", "Misclassification"].map((issue) => (
            <div key={issue} className="flex items-center gap-2">
              <Checkbox
                id={`issue_${issue}`}
                checked={(data.issue_types as string[] || []).includes(issue)}
                onCheckedChange={(checked) => {
                  const current = (data.issue_types as string[]) || [];
                  onChange(
                    "issue_types",
                    checked ? [...current, issue] : current.filter((i) => i !== issue)
                  );
                }}
              />
              <Label htmlFor={`issue_${issue}`} className="cursor-pointer text-sm">
                {issue}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Filed Complaint */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="filed_complaint"
            checked={data.filed_complaint as boolean || false}
            onCheckedChange={(checked) => onChange("filed_complaint", checked)}
          />
          <Label htmlFor="filed_complaint" className="cursor-pointer">
            I have filed a complaint with HR, EEOC, or DFEH
          </Label>
        </div>
      </div>
    </div>
  );
}

// Tenant Rights Details
function TenantRightsDetails({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-[#1A222B]">Tenant Rights Details</h3>

      {/* Rental Address */}
      <div className="space-y-2">
        <Label htmlFor="rental_address">Rental property address</Label>
        <Input
          id="rental_address"
          value={data.rental_address as string || ""}
          onChange={(e) => onChange("rental_address", e.target.value)}
          placeholder="Full address of rental property"
        />
      </div>

      {/* Monthly Rent */}
      <div className="space-y-2">
        <Label htmlFor="monthly_rent">Monthly rent amount</Label>
        <Input
          id="monthly_rent"
          type="number"
          value={data.monthly_rent as string || ""}
          onChange={(e) => onChange("monthly_rent", e.target.value)}
          placeholder="e.g., 2000"
        />
      </div>

      {/* Lease Type */}
      <div className="space-y-3">
        <Label>Type of tenancy</Label>
        <RadioGroup
          value={data.lease_type as string || ""}
          onValueChange={(value) => onChange("lease_type", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="written_lease" id="lease_written" />
            <Label htmlFor="lease_written" className="cursor-pointer">Written lease</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="month_to_month" id="lease_mtm" />
            <Label htmlFor="lease_mtm" className="cursor-pointer">Month-to-month</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="verbal" id="lease_verbal" />
            <Label htmlFor="lease_verbal" className="cursor-pointer">Verbal agreement</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Eviction Notice */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="eviction_notice"
            checked={data.eviction_notice as boolean || false}
            onCheckedChange={(checked) => onChange("eviction_notice", checked)}
          />
          <Label htmlFor="eviction_notice" className="cursor-pointer">
            I have received an eviction notice
          </Label>
        </div>
        {Boolean(data.eviction_notice) && (
          <div className="pl-6 space-y-2">
            <Label htmlFor="notice_type">Type of notice</Label>
            <Select
              value={data.notice_type as string || ""}
              onValueChange={(value) => onChange("notice_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select notice type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3_day_pay">3-Day Pay or Quit</SelectItem>
                <SelectItem value="3_day_cure">3-Day Cure or Quit</SelectItem>
                <SelectItem value="30_day">30-Day Notice</SelectItem>
                <SelectItem value="60_day">60-Day Notice</SelectItem>
                <SelectItem value="unlawful_detainer">Unlawful Detainer Summons</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Habitability Issues */}
      <div className="space-y-3">
        <Label>Habitability issues (select all that apply)</Label>
        <div className="grid grid-cols-2 gap-3">
          {["No heat/hot water", "Pest infestation", "Mold", "Plumbing issues", "Electrical problems", "Security issues", "No working appliances", "Structural damage"].map((issue) => (
            <div key={issue} className="flex items-center gap-2">
              <Checkbox
                id={`habit_${issue}`}
                checked={(data.habitability_issues as string[] || []).includes(issue)}
                onCheckedChange={(checked) => {
                  const current = (data.habitability_issues as string[]) || [];
                  onChange(
                    "habitability_issues",
                    checked ? [...current, issue] : current.filter((i) => i !== issue)
                  );
                }}
              />
              <Label htmlFor={`habit_${issue}`} className="cursor-pointer text-sm">
                {issue}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Civil Litigation Details
function CivilLitigationDetails({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-[#1A222B]">Civil Litigation Details</h3>

      {/* Amount in Dispute */}
      <div className="space-y-3">
        <Label>Approximate amount in dispute</Label>
        <Select
          value={data.amount_band as string || ""}
          onValueChange={(value) => onChange("amount_band", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select amount range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="under_10k">Under $10,000</SelectItem>
            <SelectItem value="10k_25k">$10,000 - $25,000</SelectItem>
            <SelectItem value="25k_75k">$25,000 - $75,000</SelectItem>
            <SelectItem value="75k_200k">$75,000 - $200,000</SelectItem>
            <SelectItem value="over_200k">Over $200,000</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contract Exists */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="contract_exists"
            checked={data.contract_exists as boolean || false}
            onCheckedChange={(checked) => onChange("contract_exists", checked)}
          />
          <Label htmlFor="contract_exists" className="cursor-pointer">
            There is a written contract involved
          </Label>
        </div>
      </div>

      {/* Demand Letter */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="demand_letter"
            checked={data.demand_letter_sent as boolean || false}
            onCheckedChange={(checked) => onChange("demand_letter_sent", checked)}
          />
          <Label htmlFor="demand_letter" className="cursor-pointer">
            A demand letter has been sent
          </Label>
        </div>
      </div>

      {/* Litigation Filed */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="litigation_filed"
            checked={data.litigation_filed as boolean || false}
            onCheckedChange={(checked) => onChange("litigation_filed", checked)}
          />
          <Label htmlFor="litigation_filed" className="cursor-pointer">
            A lawsuit has already been filed
          </Label>
        </div>
        {Boolean(data.litigation_filed) && (
          <div className="pl-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="civil_case_number">Case number</Label>
              <Input
                id="civil_case_number"
                value={data.case_number as string || ""}
                onChange={(e) => onChange("case_number", e.target.value)}
                placeholder="e.g., 23STCV12345"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="county">County</Label>
              <Input
                id="county"
                value={data.county as string || ""}
                onChange={(e) => onChange("county", e.target.value)}
                placeholder="e.g., Los Angeles"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
