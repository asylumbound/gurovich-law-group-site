/**
 * Our Team Page
 * Gurovich Law Group
 * 
 * Features: Attorney profile cards with photos, bios, credentials
 * Team members:
 * - Konstantin Gurovich (Founding Partner)
 * - Rita Skuratovsky (Partner)
 * - John Rogers (Of Counsel)
 * - Leo Rotenberg (Of Counsel)
 * - Milena Dolukhanyan (Of Counsel)
 */

import { Phone, Mail, Scale, Award, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactModal } from "@/contexts/ContactModalContext";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  role: string;
  image?: string;
  bio: string;
  practiceAreas: string[];
  languages: string[];
  education?: string[];
  credentials?: string[];
  email?: string;
}

const teamMembers: TeamMember[] = [
  {
    id: "konstantin-gurovich",
    name: "Konstantin Gurovich",
    title: "Founding Partner",
    role: "Principal",
    bio: "Konstantin Gurovich is the founding attorney of Gurovich Law Group. With over two decades of experience in California law, he has built a reputation for vigorous advocacy and exceptional client service. Mr. Gurovich is fluent in multiple languages, allowing him to serve the diverse communities of Los Angeles. He is committed to providing personalized legal representation and fighting for the rights of every client.",
    practiceAreas: ["Personal Injury", "Criminal Defense", "Civil Litigation", "Employment Law"],
    languages: ["English", "Russian", "Ukrainian"],
    credentials: ["California State Bar", "U.S. District Court, Central District of California"],
    email: "info@gurovichlaw.com",
  },
  {
    id: "rita-skuratovsky",
    name: "Rita Skuratovsky",
    title: "Partner",
    role: "Attorney",
    bio: "Rita Skuratovsky is a dedicated attorney with extensive experience in personal injury and civil litigation. She is known for her meticulous case preparation and compassionate approach to client representation. Rita works closely with clients to understand their needs and develop effective legal strategies.",
    practiceAreas: ["Personal Injury", "Civil Litigation", "Employment"],
    languages: ["English", "Russian", "Ukrainian"],
    credentials: ["California State Bar"],
  },
  {
    id: "john-rogers",
    name: "John Rogers",
    title: "Of Counsel",
    role: "Of Counsel",
    bio: "John Rogers serves as Of Counsel to Gurovich Law Group, bringing decades of litigation experience to complex federal and state criminal cases. His expertise in trial advocacy and practice strengthens our ability to handle challenging matters.",
    practiceAreas: ["Federal and State Criminal"],
    languages: ["English"],
    credentials: ["California State Bar", "U.S. District Courts"],
  },
  {
    id: "leo-rotenberg",
    name: "Leo Rotenberg",
    title: "Of Counsel",
    role: "Of Counsel",
    bio: "Leo Rotenberg is Of Counsel to the firm, specializing in real estate, evictions, business litigation and commercial disputes. His strategic approach and negotiation skills have helped numerous clients resolve complex business conflicts.",
    practiceAreas: ["Evictions", "Real Estate Litigation", "Business Litigation", "Commercial Disputes"],
    languages: ["English", "Russian", "Ukrainian"],
    credentials: ["California State Bar"],
  },
  {
    id: "milena-dolukhanyan",
    name: "Milena Dolukhanyan",
    title: "Of Counsel",
    role: "Of Counsel",
    bio: "Ms. Dolukhanyan is an experienced litigator and a trial lawyer. Ms. Dolukhanyan's practice includes litigation, general arbitration claims, mediations, SEC, state regulatory and FINRA investigations. Ms. Dolukhanyan has extensive experience in complex business litigation, EB-5 investigations and litigation, commercial landlord/tenant disputes, SEC investigations and broker/dealer relations. She also has experience representing both financial institutions and individual brokers in FINRA arbitrations.",
    practiceAreas: ["Business Litigation", "Commercial Disputes", "Civil Federal Investigations"],
    languages: ["English", "Russian", "Armenian"],
    credentials: ["California State Bar", "U.S. District Courts", "Ninth Circuit Court of Appeals"],
  },
];

// Group team members by role
const attorneys = teamMembers.filter(m => m.role === "Principal" || m.role === "Attorney");
const ofCounsel = teamMembers.filter(m => m.role === "Of Counsel");

export default function OurTeam() {
  const { openContactModal } = useContactModal();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-20 md:py-28 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/team-hero-bg.jpg"
            alt="Professional legal team"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/80" />
        </div>
        <div className="container max-w-6xl relative z-10">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            Meet Our Team
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Our Team
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
            The Gurovich Law Group is comprised of experienced attorneys who share a commitment 
            to excellence and client service. Together, we bring diverse backgrounds and 
            perspectives to every case.
          </p>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Partners</h2>
          <p className="text-lg text-slate-600 mb-10 max-w-3xl">
            Our partners bring decades of combined experience and a passion for justice to every case.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {attorneys.map((member) => (
              <TeamCard key={member.id} member={member} featured={member.role === "Principal"} />
            ))}
          </div>
        </div>
      </section>

      {/* Of Counsel Section */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Of Counsel</h2>
          <p className="text-lg text-slate-600 mb-10 max-w-3xl">
            Our Of Counsel attorneys provide specialized expertise and additional resources for complex matters.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ofCounsel.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="py-16 bg-slate-800 text-white">
        <div className="container max-w-6xl">
          <div className="flex items-center gap-4 mb-6">
            <Globe className="w-10 h-10 text-primary" />
            <h2 className="text-3xl font-bold">We Speak Your Language</h2>
          </div>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl">
            Our multilingual team serves clients in multiple languages, ensuring clear communication 
            and culturally sensitive representation.
          </p>
          <div className="flex flex-wrap gap-4">
            {["English", "Russian", "Ukrainian", "Armenian"].map((lang) => (
              <div key={lang} className="bg-slate-700 px-6 py-3 rounded-lg font-medium">
                {lang}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary text-white">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Work With Our Team?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation. Our experienced attorneys are ready to 
            discuss your case and explain your legal options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={openContactModal}
              className="bg-white text-primary hover:bg-slate-100 px-8"
            >
              Schedule Consultation
            </Button>
            <a href="tel:818-401-4725">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8">
                <Phone className="w-5 h-5 mr-2" />
                (818) 401-4725
              </Button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

// Team Card Component
function TeamCard({ member, featured = false }: { member: TeamMember; featured?: boolean }) {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${featured ? "ring-2 ring-primary" : ""}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar placeholder */}
          <div className="w-20 h-20 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-slate-400">
              {member.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {member.name}
            </h3>
            <p className="text-primary font-medium">{member.title}</p>
            {featured && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                Founding Partner
              </span>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          {member.bio}
        </p>

        {/* Practice Areas */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">Practice Areas</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {member.practiceAreas.map((area) => (
              <span key={area} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">Languages</span>
          </div>
          <p className="text-sm text-slate-600">{member.languages.join(", ")}</p>
        </div>

        {/* Credentials */}
        {member.credentials && member.credentials.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">Credentials</span>
            </div>
            <p className="text-sm text-slate-600">{member.credentials.join(" • ")}</p>
          </div>
        )}

        {/* Contact */}
        {member.email && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <a 
              href={`mailto:${member.email}`}
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Mail className="w-4 h-4" />
              {member.email}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
