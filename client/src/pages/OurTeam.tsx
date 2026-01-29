/**
 * Our Team Page
 * Gurovich Law Group
 * 
 * Features: Attorney profile cards with photos, bios, credentials
 * Team members from sitemap:
 * - Konstantin Gurovich (Principal)
 * - Rita Skuratovsky
 * - Anna Garkusha
 * - Natalia Garfulina
 * - Nadya
 * - Guadalupe Soto
 * - Of Cnsl John Rogers
 * - Of Cnsl Leo Rotenberg
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
    title: "Founding Attorney",
    role: "Principal",
    bio: "Konstantin Gurovich is the founding attorney of Gurovich Law Group. With over two decades of experience in California law, he has built a reputation for vigorous advocacy and exceptional client service. Mr. Gurovich is fluent in multiple languages, allowing him to serve the diverse communities of Los Angeles. He is committed to providing personalized legal representation and fighting for the rights of every client.",
    practiceAreas: ["Personal Injury", "Criminal Defense", "Civil Litigation", "Employment Law"],
    languages: ["English", "Russian", "Ukrainian"],
    education: ["J.D., Law School", "B.A., Political Science"],
    credentials: ["California State Bar", "U.S. District Court, Central District of California"],
    email: "info@gurovichlaw.com",
  },
  {
    id: "rita-skuratovsky",
    name: "Rita Skuratovsky",
    title: "Senior Associate",
    role: "Attorney",
    bio: "Rita Skuratovsky is a dedicated attorney with extensive experience in personal injury and civil litigation. She is known for her meticulous case preparation and compassionate approach to client representation. Rita works closely with clients to understand their needs and develop effective legal strategies.",
    practiceAreas: ["Personal Injury", "Civil Litigation"],
    languages: ["English", "Russian"],
    education: ["J.D., Law School"],
    credentials: ["California State Bar"],
  },
  {
    id: "anna-garkusha",
    name: "Anna Garkusha",
    title: "Associate Attorney",
    role: "Attorney",
    bio: "Anna Garkusha brings a strong background in employment law and civil rights to the firm. She is passionate about protecting workers' rights and has successfully represented clients in discrimination, harassment, and wrongful termination cases.",
    practiceAreas: ["Employment Law", "Civil Rights"],
    languages: ["English", "Russian", "Ukrainian"],
    education: ["J.D., Law School"],
    credentials: ["California State Bar"],
  },
  {
    id: "natalia-garfulina",
    name: "Natalia Garfulina",
    title: "Associate Attorney",
    role: "Attorney",
    bio: "Natalia Garfulina focuses her practice on criminal defense and immigration-related matters. She understands the unique challenges faced by immigrant communities and provides culturally sensitive legal representation.",
    practiceAreas: ["Criminal Defense", "Immigration"],
    languages: ["English", "Russian"],
    education: ["J.D., Law School"],
    credentials: ["California State Bar"],
  },
  {
    id: "nadya",
    name: "Nadya",
    title: "Legal Assistant",
    role: "Support Staff",
    bio: "Nadya provides essential support to our legal team, ensuring smooth case management and excellent client communication. Her attention to detail and organizational skills help keep our cases on track.",
    practiceAreas: ["Case Management", "Client Relations"],
    languages: ["English", "Russian", "Armenian"],
  },
  {
    id: "guadalupe-soto",
    name: "Guadalupe Soto",
    title: "Paralegal",
    role: "Support Staff",
    bio: "Guadalupe Soto is an experienced paralegal who assists with case preparation, document management, and client intake. Her bilingual abilities help us serve our Spanish-speaking clients effectively.",
    practiceAreas: ["Personal Injury", "Civil Litigation"],
    languages: ["English", "Spanish"],
  },
  {
    id: "john-rogers",
    name: "John Rogers",
    title: "Of Counsel",
    role: "Of Counsel",
    bio: "John Rogers serves as Of Counsel to Gurovich Law Group, bringing decades of litigation experience to complex cases. His expertise in trial advocacy and appellate practice strengthens our ability to handle challenging matters.",
    practiceAreas: ["Complex Litigation", "Appeals"],
    languages: ["English"],
    credentials: ["California State Bar", "Multiple Federal Courts"],
  },
  {
    id: "leo-rotenberg",
    name: "Leo Rotenberg",
    title: "Of Counsel",
    role: "Of Counsel",
    bio: "Leo Rotenberg is Of Counsel to the firm, specializing in business litigation and commercial disputes. His strategic approach and negotiation skills have helped numerous clients resolve complex business conflicts.",
    practiceAreas: ["Business Litigation", "Commercial Disputes"],
    languages: ["English", "Russian"],
    credentials: ["California State Bar"],
  },
];

// Group team members by role
const attorneys = teamMembers.filter(m => m.role === "Principal" || m.role === "Attorney");
const ofCounsel = teamMembers.filter(m => m.role === "Of Counsel");
const supportStaff = teamMembers.filter(m => m.role === "Support Staff");

export default function OurTeam() {
  const { openContactModal } = useContactModal();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 md:py-28">
        <div className="container max-w-6xl">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            Meet Our Team
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Our Team
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
            The Gurovich Law Group is comprised of experienced attorneys and dedicated support staff 
            who share a commitment to excellence and client service. Together, we bring diverse 
            backgrounds and perspectives to every case.
          </p>
        </div>
      </section>

      {/* Attorneys Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Attorneys</h2>
          <p className="text-lg text-slate-600 mb-10 max-w-3xl">
            Our attorneys bring decades of combined experience and a passion for justice to every case.
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

          <div className="grid md:grid-cols-2 gap-8">
            {ofCounsel.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Support Staff Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Support Staff</h2>
          <p className="text-lg text-slate-600 mb-10 max-w-3xl">
            Our dedicated support team ensures smooth operations and excellent client communication.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {supportStaff.map((member) => (
              <TeamCard key={member.id} member={member} compact />
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
            {["English", "Spanish", "Russian", "Ukrainian", "Armenian"].map((lang) => (
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
function TeamCard({ member, featured = false, compact = false }: { member: TeamMember; featured?: boolean; compact?: boolean }) {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${featured ? "ring-2 ring-primary" : ""}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar placeholder */}
          <div className={`${compact ? "w-16 h-16" : "w-20 h-20"} rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0`}>
            <span className="text-2xl font-bold text-slate-400">
              {member.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div>
            <h3 className={`${compact ? "text-lg" : "text-xl"} font-bold text-slate-900`}>
              {member.name}
            </h3>
            <p className="text-primary font-medium">{member.title}</p>
            {featured && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                Founding Attorney
              </span>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className={`text-slate-600 ${compact ? "text-sm" : ""} mb-4 leading-relaxed`}>
          {compact ? member.bio.substring(0, 150) + "..." : member.bio}
        </p>

        {!compact && (
          <>
            {/* Practice Areas */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Scale className="w-4 h-4 text-primary" />
                Practice Areas
              </div>
              <div className="flex flex-wrap gap-2">
                {member.practiceAreas.map((area) => (
                  <span key={area} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Globe className="w-4 h-4 text-primary" />
                Languages
              </div>
              <p className="text-sm text-slate-600">{member.languages.join(", ")}</p>
            </div>

            {/* Credentials */}
            {member.credentials && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <Award className="w-4 h-4 text-primary" />
                  Credentials
                </div>
                <p className="text-sm text-slate-600">{member.credentials.join(" • ")}</p>
              </div>
            )}
          </>
        )}

        {/* Contact */}
        {member.email && (
          <div className="pt-4 border-t border-slate-100">
            <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-primary hover:underline text-sm">
              <Mail className="w-4 h-4" />
              {member.email}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
