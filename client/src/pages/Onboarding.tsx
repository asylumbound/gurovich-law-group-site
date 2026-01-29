import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Check, ChevronLeft, ChevronRight, Loader2, Save } from "lucide-react";
// Header and Footer are provided by Layout component in App.tsx

// Step components
import Step0Consent from "@/components/onboarding/Step0Consent";
import Step1Contact from "@/components/onboarding/Step1Contact";
import Step2Matter from "@/components/onboarding/Step2Matter";
import Step3Facts from "@/components/onboarding/Step3Facts";
import Step4Details from "@/components/onboarding/Step4Details";
import Step5Review from "@/components/onboarding/Step5Review";

import type { PracticeArea } from "@shared/onboard-validation";

const STEPS = [
  { id: 0, title: "Disclaimer & Consent", shortTitle: "Consent" },
  { id: 1, title: "Contact Information", shortTitle: "Contact" },
  { id: 2, title: "Matter Selection", shortTitle: "Matter" },
  { id: 3, title: "Core Facts", shortTitle: "Facts" },
  { id: 4, title: "Case Details", shortTitle: "Details" },
  { id: 5, title: "Review & Submit", shortTitle: "Review" },
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [draftToken, setDraftToken] = useState<string | null>(null);
  const [practiceArea, setPracticeArea] = useState<PracticeArea | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Form data state for each step
  const [step0Data, setStep0Data] = useState<{
    consent_no_attorney_relationship: boolean;
    consent_contact: boolean;
    preferred_contact_method: "phone" | "email" | "text";
    preferred_language: "en" | "es" | "hy" | "ru" | "uk";
  }>({
    consent_no_attorney_relationship: false,
    consent_contact: false,
    preferred_contact_method: "phone",
    preferred_language: "en",
  });

  const [step1Data, setStep1Data] = useState<{
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    city: string;
    state: string;
    best_time_to_contact?: "morning" | "afternoon" | "evening" | "anytime";
    is_affected_person: boolean;
    relationship_to_affected?: string;
  }>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    city: "",
    state: "CA",
    best_time_to_contact: undefined,
    is_affected_person: true,
    relationship_to_affected: undefined,
  });

  const [step2Data, setStep2Data] = useState<{
    practice_area?: PracticeArea;
    issue_type_id?: number;
    urgency?: "emergency" | "high" | "normal" | "unsure";
    summary: string;
  }>({
    practice_area: undefined,
    issue_type_id: undefined,
    urgency: undefined,
    summary: "",
  });

  const [step3Data, setStep3Data] = useState({
    incident_date: "",
    incident_date_unknown: false,
    incident_city: "",
    incident_state: "CA",
    agency_involved: false,
    agency_name: "",
    report_number: "",
    has_documents: false,
    parties: [] as Array<{
      party_type: "individual" | "business" | "government" | "insurance" | "other";
      party_role: "defendant" | "plaintiff" | "witness" | "employer" | "landlord" | "tenant" | "other";
      name: string;
      phone: string;
      email: string;
    }>,
  });

  const [step4Data, setStep4Data] = useState<Record<string, unknown>>({});

  const [step5Data, setStep5Data] = useState({
    additional_notes: "",
    uploads: [] as Array<{
      id: number;
      file_name: string;
      file_path: string;
      file_size: number;
      mime_type: string;
      tag: string;
    }>,
  });

  // tRPC mutations
  const createDraft = trpc.onboard.createDraft.useMutation();
  const updateStep1 = trpc.onboard.updateStep1.useMutation();
  const updateStep2 = trpc.onboard.updateStep2.useMutation();
  const updateStep3 = trpc.onboard.updateStep3.useMutation();
  const updateStep4 = trpc.onboard.updateStep4.useMutation();
  const updateNotes = trpc.onboard.updateNotes.useMutation();
  const submitIntake = trpc.onboard.submit.useMutation();

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("onboarding_draft_token");
    if (savedToken) {
      setDraftToken(savedToken);
    }
  }, []);

  // Query to load existing draft
  const { data: existingDraft, isLoading: isLoadingDraft } = trpc.onboard.getByToken.useQuery(
    { draftToken: draftToken! },
    { enabled: !!draftToken }
  );

  // Load existing draft data
  useEffect(() => {
    if (existingDraft?.intake) {
      const intake = existingDraft.intake;
      
      // Restore step 0 data
      setStep0Data({
        consent_no_attorney_relationship: intake.consent_no_attorney_relationship,
        consent_contact: intake.consent_contact,
        preferred_contact_method: intake.preferred_contact_method || "phone",
        preferred_language: intake.preferred_language || "en",
      });

      // Restore step 1 data
      if (intake.first_name) {
        setStep1Data({
          first_name: intake.first_name || "",
          last_name: intake.last_name || "",
          phone: intake.phone || "",
          email: intake.email || "",
          city: intake.city || "",
          state: intake.state || "CA",
          best_time_to_contact: intake.best_time_to_contact || undefined,
          is_affected_person: intake.is_affected_person ?? true,
          relationship_to_affected: intake.relationship_to_affected || undefined,
        });
        setCurrentStep(Math.max(currentStep, 1));
      }

      // Restore step 2 data
      if (intake.practice_area) {
        setStep2Data({
          practice_area: intake.practice_area as PracticeArea,
          issue_type_id: intake.issue_type_id || undefined,
          urgency: intake.urgency || undefined,
          summary: intake.summary || "",
        });
        setPracticeArea(intake.practice_area as PracticeArea);
        setCurrentStep(Math.max(currentStep, 2));
      }

      // Restore step 3 data
      if (intake.incident_date || intake.incident_date_unknown) {
        setStep3Data({
          incident_date: intake.incident_date || "",
          incident_date_unknown: intake.incident_date_unknown || false,
          incident_city: intake.incident_city || "",
          incident_state: intake.incident_state || "CA",
          agency_involved: intake.agency_involved || false,
          agency_name: intake.agency_name || "",
          report_number: intake.report_number || "",
          has_documents: intake.has_documents || false,
          parties: existingDraft.parties?.map(p => ({
            party_type: p.party_type as "individual" | "business" | "government" | "insurance" | "other",
            party_role: p.party_role as "defendant" | "plaintiff" | "witness" | "employer" | "landlord" | "tenant" | "other",
            name: p.name || "",
            phone: p.phone || "",
            email: p.email || "",
          })) || [],
        });
        setCurrentStep(Math.max(currentStep, 3));
      }

      // Restore step 4 data (practice-specific)
      if (existingDraft.practiceDetails) {
        setStep4Data(existingDraft.practiceDetails);
        setCurrentStep(Math.max(currentStep, 4));
      }

      // Restore step 5 data
      setStep5Data({
        additional_notes: intake.additional_notes || "",
        uploads: existingDraft.uploads || [],
      });
    }
  }, [existingDraft]);

  // Handle step 0 completion (create draft)
  const handleStep0Complete = async () => {
    if (!step0Data.consent_no_attorney_relationship || !step0Data.consent_contact) {
      toast.error("Please accept both consents to continue");
      return;
    }

    try {
      const result = await createDraft.mutateAsync(step0Data);
      setDraftToken(result.draftToken);
      localStorage.setItem("onboarding_draft_token", result.draftToken);
      setLastSaved(new Date());
      setCurrentStep(1);
      toast.success("Draft saved");
    } catch (error) {
      toast.error("Failed to create draft. Please try again.");
    }
  };

  // Autosave function with debounce
  const saveCurrentStep = useCallback(async () => {
    if (!draftToken) return;

    try {
      switch (currentStep) {
        case 1:
          if (step1Data.first_name && step1Data.last_name && (step1Data.phone || step1Data.email)) {
            await updateStep1.mutateAsync({ draftToken, data: step1Data as any });
            setLastSaved(new Date());
          }
          break;
        case 2:
          if (step2Data.practice_area && step2Data.issue_type_id && step2Data.urgency && step2Data.summary) {
            await updateStep2.mutateAsync({ draftToken, data: step2Data as any });
            setLastSaved(new Date());
          }
          break;
        case 3:
          await updateStep3.mutateAsync({ draftToken, data: step3Data as any });
          setLastSaved(new Date());
          break;
        case 4:
          if (practiceArea) {
            await updateStep4.mutateAsync({ draftToken, practiceArea, data: step4Data as any });
            setLastSaved(new Date());
          }
          break;
        case 5:
          await updateNotes.mutateAsync({ draftToken, additional_notes: step5Data.additional_notes });
          setLastSaved(new Date());
          break;
      }
    } catch (error) {
      console.error("Autosave failed:", error);
    }
  }, [draftToken, currentStep, step1Data, step2Data, step3Data, step4Data, step5Data, practiceArea]);

  // Autosave effect with debounce
  useEffect(() => {
    if (!draftToken || currentStep === 0) return;

    const timer = setTimeout(() => {
      saveCurrentStep();
    }, 2000);

    return () => clearTimeout(timer);
  }, [step1Data, step2Data, step3Data, step4Data, step5Data, saveCurrentStep]);

  // Handle next step
  const handleNext = async () => {
    await saveCurrentStep();
    
    if (currentStep === 2 && step2Data.practice_area) {
      setPracticeArea(step2Data.practice_area);
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle final submission
  const handleSubmit = async () => {
    if (!draftToken) return;

    setIsSubmitting(true);
    try {
      await saveCurrentStep();
      await submitIntake.mutateAsync({ draftToken });
      localStorage.removeItem("onboarding_draft_token");
      toast.success("Your intake has been submitted successfully!");
      setLocation("/onboarding/success");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit. Please check all required fields.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate current step
  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return step0Data.consent_no_attorney_relationship && step0Data.consent_contact;
      case 1:
        return step1Data.first_name && step1Data.last_name && (step1Data.phone || step1Data.email);
      case 2:
        return step2Data.practice_area && step2Data.issue_type_id && step2Data.urgency && step2Data.summary?.length >= 10;
      case 3:
        return true; // Optional fields
      case 4:
        return true; // Optional fields
      case 5:
        return true; // Review step
      default:
        return false;
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  if (isLoadingDraft && draftToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading your saved progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A222B] mb-2">
              Client Intake Questionnaire
            </h1>
            <p className="text-gray-600">
              Please complete this form to help us understand your legal needs.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex-1 text-center text-xs md:text-sm ${
                    index <= currentStep ? "text-primary font-medium" : "text-gray-400"
                  }`}
                >
                  <span className="hidden md:inline">{step.shortTitle}</span>
                  <span className="md:hidden">{index + 1}</span>
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center mb-8 gap-2">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  index < currentStep
                    ? "bg-green-500 text-white"
                    : index === currentStep
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
              </div>
            ))}
          </div>

          {/* Current Step Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-[#1A222B]">
              Step {currentStep + 1}: {STEPS[currentStep].title}
            </h2>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && (
                  <Step0Consent data={step0Data} onChange={setStep0Data} />
                )}
                {currentStep === 1 && (
                  <Step1Contact data={step1Data} onChange={setStep1Data} />
                )}
                {currentStep === 2 && (
                  <Step2Matter data={step2Data} onChange={setStep2Data} />
                )}
                {currentStep === 3 && (
                  <Step3Facts data={step3Data} onChange={setStep3Data} />
                )}
                {currentStep === 4 && practiceArea && (
                  <Step4Details
                    practiceArea={practiceArea}
                    data={step4Data}
                    onChange={setStep4Data}
                  />
                )}
                {currentStep === 5 && (
                  <Step5Review
                    draftToken={draftToken!}
                    data={step5Data}
                    onChange={setStep5Data}
                    allData={{
                      step0: step0Data,
                      step1: step1Data,
                      step2: step2Data,
                      step3: step3Data,
                      step4: step4Data,
                      practiceArea,
                    }}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <div>
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {lastSaved && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Save className="w-3 h-3" />
                    Saved {lastSaved.toLocaleTimeString()}
                  </span>
                )}

                {currentStep === 0 ? (
                  <Button
                    onClick={handleStep0Complete}
                    disabled={!isStepValid() || createDraft.isPending}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    {createDraft.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Continue
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                ) : currentStep === STEPS.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Submit Intake
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Need help? Call us at{" "}
            <a href="tel:+18184014725" className="text-primary hover:underline">
              (818) 401-4725
            </a>
          </p>
        </div>
    </div>
  );
}
