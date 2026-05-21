/**
 * Practice Areas Data - Gurovich Law Group
 * 
 * Contains all practice area categories and their sub-pages
 * based on the sitemap structure
 */

export interface SubPage {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  keyPoints: string[];
}

export interface PracticeArea {
  slug: string;
  title: string;
  icon: string;
  iconImage?: string;
  description: string;
  heroDescription: string;
  subPages: SubPage[];
}

export const practiceAreas: PracticeArea[] = [
  {
    slug: "personal-injury",
    title: "Personal Injury",
    icon: "Shield",
    iconImage: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/personal-injury-LOGO.png",
    description: "Aggressive representation for accident victims. We fight for maximum compensation for your injuries and losses.",
    heroDescription: "When you've been injured due to someone else's negligence, you deserve an advocate who will fight tirelessly for your rights. Our personal injury attorneys have recovered millions of dollars for clients across California, handling everything from car accidents to catastrophic injuries.",
    subPages: [
      {
        slug: "auto-accidents",
        title: "Auto Accidents",
        shortDescription: "Comprehensive legal representation for car accident victims.",
        fullDescription: "Car accidents can result in devastating injuries, mounting medical bills, and lost wages. Our experienced auto accident attorneys understand the complexities of California traffic law and insurance regulations. We investigate every aspect of your case, from police reports to witness statements, to build the strongest possible claim for compensation.",
        keyPoints: [
          "Free case evaluation and no fees unless we win",
          "Experience with all types of vehicle collisions",
          "Negotiation with insurance companies on your behalf",
          "Litigation support if a fair settlement cannot be reached",
          "Help with medical treatment coordination",
          "Recovery for medical bills, lost wages, and pain and suffering"
        ]
      },
      {
        slug: "wrongful-death",
        title: "Wrongful Death",
        shortDescription: "Compassionate advocacy for families who have lost loved ones.",
        fullDescription: "Losing a loved one due to another's negligence is devastating. While no amount of money can replace your loss, a wrongful death claim can provide financial security for your family and hold the responsible parties accountable. Our attorneys handle these sensitive cases with compassion while aggressively pursuing justice.",
        keyPoints: [
          "Compassionate support during difficult times",
          "Recovery for funeral expenses and medical bills",
          "Compensation for loss of income and benefits",
          "Damages for loss of companionship and guidance",
          "Holding negligent parties accountable",
          "Two-year statute of limitations in California"
        ]
      },
      {
        slug: "ride-share-accidents",
        title: "Ride Share Accidents",
        shortDescription: "Legal help for Uber, Lyft, and other ride-share accident victims.",
        fullDescription: "Ride-share accidents involve complex liability issues between drivers, companies, and insurance policies. Whether you were a passenger, driver, or third party injured in a ride-share accident, our attorneys understand the unique challenges of these cases and can navigate the multiple insurance policies involved.",
        keyPoints: [
          "Understanding of Uber and Lyft insurance policies",
          "Experience with ride-share company procedures",
          "Claims against multiple liable parties",
          "Coverage analysis for maximum compensation",
          "Representation for passengers, drivers, and pedestrians",
          "Knowledge of California ride-share regulations"
        ]
      },
      {
        slug: "pedestrian-accidents",
        title: "Pedestrian Accidents",
        shortDescription: "Protecting the rights of pedestrians injured by negligent drivers.",
        fullDescription: "Pedestrians have little protection against vehicles, making these accidents often result in severe or fatal injuries. California law provides strong protections for pedestrians, and our attorneys are skilled at proving driver negligence and securing maximum compensation for victims.",
        keyPoints: [
          "Thorough accident scene investigation",
          "Expert reconstruction of pedestrian accidents",
          "Claims for catastrophic and permanent injuries",
          "Recovery for long-term medical care needs",
          "Advocacy against negligent and distracted drivers",
          "Crosswalk and intersection accident expertise"
        ]
      },
      {
        slug: "motorcycle-accidents",
        title: "Motorcycle Accidents",
        shortDescription: "Dedicated representation for injured motorcyclists.",
        fullDescription: "Motorcyclists face unique dangers on California roads and often suffer severe injuries in accidents. Unfortunately, they also face bias from insurance companies. Our attorneys are experienced motorcycle accident advocates who understand the physics of motorcycle crashes and fight against unfair stereotypes.",
        keyPoints: [
          "Understanding of motorcycle dynamics and accidents",
          "Fighting insurance company bias against riders",
          "Experience with lane-splitting accident cases",
          "Claims for traumatic brain and spinal injuries",
          "Recovery for motorcycle damage and gear",
          "Advocacy for riders' rights in California"
        ]
      },
      {
        slug: "premises-liability",
        title: "Premises Liability",
        shortDescription: "Holding property owners accountable for unsafe conditions.",
        fullDescription: "Property owners have a legal duty to maintain safe premises for visitors. When they fail to address hazards like wet floors, broken stairs, inadequate lighting, or security issues, they can be held liable for resulting injuries. Our attorneys investigate premises liability claims thoroughly to establish negligence.",
        keyPoints: [
          "Slip and fall accident representation",
          "Negligent security claims",
          "Swimming pool and recreational accidents",
          "Elevator and escalator injuries",
          "Construction site accidents",
          "Dog bite and animal attack cases"
        ]
      },
      {
        slug: "truck-accidents",
        title: "Truck Accidents",
        shortDescription: "Aggressive advocacy against trucking companies and their insurers.",
        fullDescription: "Commercial truck accidents often result in catastrophic injuries due to the massive size difference between trucks and passenger vehicles. These cases involve complex federal regulations, multiple liable parties, and well-funded defense teams. Our attorneys have the resources and experience to take on trucking companies.",
        keyPoints: [
          "Knowledge of federal trucking regulations",
          "Investigation of driver logs and black box data",
          "Claims against trucking companies and manufacturers",
          "Experience with 18-wheeler and semi-truck cases",
          "Understanding of trucking industry practices",
          "Resources to match corporate defense teams"
        ]
      }
    ]
  },
  {
    slug: "civil-litigation",
    title: "Civil Litigation",
    icon: "Scale",
    iconImage: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/civillitigation.png",
    description: "Resolving complex disputes. From landlord-tenant issues to business conflicts, we advocate for your interests.",
    heroDescription: "Civil disputes require strategic thinking and aggressive advocacy. Whether you're facing a business conflict, property dispute, or need to enforce your legal rights, our litigation team has the courtroom experience and negotiation skills to protect your interests and achieve favorable outcomes.",
    subPages: [
      {
        slug: "civil-disputes",
        title: "Civil Disputes",
        shortDescription: "General civil litigation for a wide range of disputes.",
        fullDescription: "Civil disputes can arise in many contexts, from contract breaches to property damage claims. Our attorneys are skilled litigators who can represent you in negotiations, mediation, arbitration, or trial. We analyze each case strategically to determine the most effective path to resolution.",
        keyPoints: [
          "Contract dispute resolution",
          "Property damage claims",
          "Fraud and misrepresentation cases",
          "Breach of fiduciary duty claims",
          "Injunctive relief and restraining orders",
          "Appeals and post-judgment enforcement"
        ]
      },
      {
        slug: "business-disputes",
        title: "Business Disputes",
        shortDescription: "Protecting your business interests in commercial conflicts.",
        fullDescription: "Business disputes can threaten your company's operations, reputation, and bottom line. Our attorneys understand the commercial realities of business litigation and work to resolve disputes efficiently while protecting your long-term interests. We handle everything from partnership disputes to breach of contract claims.",
        keyPoints: [
          "Partnership and shareholder disputes",
          "Breach of contract litigation",
          "Non-compete and trade secret cases",
          "Business fraud and unfair competition",
          "Commercial lease disputes",
          "Vendor and supplier conflicts"
        ]
      },
      {
        slug: "landlord-tenant-disputes",
        title: "Landlord/Tenant Disputes",
        shortDescription: "Representation for both landlords and tenants in housing matters.",
        fullDescription: "California has complex landlord-tenant laws that protect both property owners and renters. Whether you're a landlord dealing with problem tenants or a tenant facing unlawful eviction or habitability issues, our attorneys can help you understand your rights and pursue appropriate remedies.",
        keyPoints: [
          "Eviction defense and prosecution",
          "Security deposit disputes",
          "Habitability and repair issues",
          "Rent control compliance",
          "Lease negotiation and enforcement",
          "Unlawful detainer actions"
        ]
      },
      {
        slug: "restraining-orders",
        title: "Restraining Orders",
        shortDescription: "Help obtaining or defending against protective orders.",
        fullDescription: "Restraining orders can provide crucial protection from harassment, abuse, or threats. They can also have serious consequences for the person they're issued against. Our attorneys help clients on both sides of restraining order cases, whether you need protection or are defending against an order.",
        keyPoints: [
          "Emergency protective orders",
          "Domestic violence restraining orders",
          "Civil harassment restraining orders",
          "Workplace violence restraining orders",
          "Defense against false accusations",
          "Modification and termination of orders"
        ]
      },
      {
        slug: "administrative-hearings",
        title: "Administrative Hearings",
        shortDescription: "Representation before government agencies and administrative bodies.",
        fullDescription: "Administrative hearings before government agencies can affect your professional license, benefits, or business operations. These proceedings have their own rules and procedures that differ from traditional court cases. Our attorneys have experience navigating administrative law and advocating before various agencies.",
        keyPoints: [
          "Professional license defense",
          "Government benefits appeals",
          "Regulatory compliance matters",
          "Agency investigation response",
          "Administrative appeals",
          "Due process protection"
        ]
      }
    ]
  },
  {
    slug: "employment-law",
    title: "Employment Law",
    icon: "Briefcase",
    iconImage: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/tenants-rights.png",
    description: "Standing up for workers' rights. We handle discrimination, harassment, wrongful termination, and wage disputes.",
    heroDescription: "California has some of the strongest worker protection laws in the nation, but employers don't always follow them. Our employment law attorneys fight for employees who have been wrongfully terminated, discriminated against, harassed, or denied fair wages. We level the playing field against employers and their legal teams.",
    subPages: [
      {
        slug: "wrongful-termination",
        title: "Wrongful Termination",
        shortDescription: "Fighting for employees who were illegally fired.",
        fullDescription: "While California is an at-will employment state, there are many exceptions that protect employees from wrongful termination. If you were fired for discriminatory reasons, in retaliation for reporting violations, or in breach of an employment contract, you may have a wrongful termination claim.",
        keyPoints: [
          "Termination for discriminatory reasons",
          "Retaliation for whistleblowing",
          "Breach of employment contract",
          "Violation of public policy",
          "Constructive discharge claims",
          "Severance negotiation"
        ]
      },
      {
        slug: "wage-and-hour-claims",
        title: "Wage and Hour Claims",
        shortDescription: "Recovering unpaid wages and overtime for workers.",
        fullDescription: "California wage and hour laws require employers to pay minimum wage, overtime, and provide meal and rest breaks. Many employers violate these laws, costing workers thousands of dollars. Our attorneys help employees recover unpaid wages and hold employers accountable for wage theft.",
        keyPoints: [
          "Unpaid overtime recovery",
          "Minimum wage violations",
          "Meal and rest break violations",
          "Misclassification as exempt or independent contractor",
          "Final paycheck violations",
          "Class action wage claims"
        ]
      },
      {
        slug: "sexual-harassment",
        title: "Sexual Harassment",
        shortDescription: "Protecting employees from workplace sexual harassment.",
        fullDescription: "No one should have to endure sexual harassment at work. California law prohibits both quid pro quo harassment and hostile work environment harassment. Our attorneys provide confidential consultations and aggressive representation for victims of workplace sexual harassment.",
        keyPoints: [
          "Quid pro quo harassment claims",
          "Hostile work environment cases",
          "Third-party harassment",
          "Retaliation for reporting harassment",
          "Confidential case handling",
          "DFEH and EEOC complaint filing"
        ]
      },
      {
        slug: "discrimination",
        title: "Discrimination",
        shortDescription: "Fighting workplace discrimination based on protected characteristics.",
        fullDescription: "California's Fair Employment and Housing Act prohibits discrimination based on race, gender, age, disability, religion, sexual orientation, and other protected characteristics. If you've been treated unfairly at work because of who you are, our attorneys can help you fight back.",
        keyPoints: [
          "Race and national origin discrimination",
          "Gender and pregnancy discrimination",
          "Age discrimination (40+)",
          "Disability discrimination and failure to accommodate",
          "Religious discrimination",
          "LGBTQ+ workplace discrimination"
        ]
      },
      {
        slug: "retaliation-claims",
        title: "Retaliation Claims",
        shortDescription: "Protecting employees who report illegal conduct.",
        fullDescription: "Employers cannot legally punish employees for reporting illegal conduct, filing complaints, or exercising their legal rights. If you've faced demotion, termination, or other adverse actions after speaking up, you may have a retaliation claim. Our attorneys protect whistleblowers and employees who assert their rights.",
        keyPoints: [
          "Whistleblower protection",
          "Retaliation for filing complaints",
          "Protected activity documentation",
          "Adverse employment action claims",
          "OSHA and safety complaint retaliation",
          "Workers' compensation retaliation"
        ]
      }
    ]
  },
  {
    slug: "criminal-defense",
    title: "Criminal Defense",
    icon: "Gavel",
    iconImage: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/criminal-defense.png",
    description: "Protecting your rights and freedom. Experienced defense for all criminal charges from misdemeanors to felonies.",
    heroDescription: "Being charged with a crime is one of the most stressful experiences you can face. Your freedom, reputation, and future are on the line. Our criminal defense attorneys have decades of combined experience defending clients against all types of charges. We fight aggressively to protect your rights at every stage.",
    subPages: [
      {
        slug: "federal-felony",
        title: "Federal Felony",
        shortDescription: "Defense against serious federal criminal charges.",
        fullDescription: "Federal felony charges carry severe penalties and are prosecuted by well-resourced federal agencies. These cases require attorneys with specific experience in federal court procedures and sentencing guidelines. Our attorneys have successfully defended clients against federal charges including fraud, drug trafficking, and white-collar crimes.",
        keyPoints: [
          "Federal court experience",
          "Understanding of federal sentencing guidelines",
          "White-collar crime defense",
          "Federal drug charges",
          "Mail and wire fraud",
          "Federal conspiracy charges"
        ]
      },
      {
        slug: "state-felony",
        title: "State Felony",
        shortDescription: "Aggressive defense against California felony charges.",
        fullDescription: "California felony convictions can result in state prison sentences, heavy fines, and lifelong consequences. Our attorneys have extensive experience defending against felony charges in California courts, from preliminary hearings through trial and appeal. We explore every avenue to achieve the best possible outcome.",
        keyPoints: [
          "Felony charge reduction strategies",
          "Preliminary hearing defense",
          "Trial preparation and representation",
          "Sentencing advocacy",
          "Three strikes law defense",
          "Post-conviction relief"
        ]
      },
      {
        slug: "state-misdemeanor",
        title: "State Misdemeanor",
        shortDescription: "Defense for misdemeanor charges in California.",
        fullDescription: "While misdemeanors are less serious than felonies, a conviction can still result in jail time, fines, probation, and a permanent criminal record. Don't underestimate the impact of a misdemeanor conviction on your employment, housing, and immigration status. Our attorneys fight to protect your record.",
        keyPoints: [
          "Misdemeanor charge defense",
          "Diversion program eligibility",
          "Record expungement",
          "Probation negotiation",
          "DMV hearing representation",
          "Immigration consequences advice"
        ]
      },
      {
        slug: "theft-crimes",
        title: "Theft Crimes",
        shortDescription: "Defense against theft, burglary, and property crime charges.",
        fullDescription: "Theft crimes range from petty theft misdemeanors to serious felonies like robbery and burglary. The consequences depend on the value of property involved and the circumstances of the alleged offense. Our attorneys develop strategic defenses tailored to the specific theft charges you face.",
        keyPoints: [
          "Petty theft and shoplifting defense",
          "Grand theft charges",
          "Burglary and robbery defense",
          "Embezzlement cases",
          "Identity theft charges",
          "Receiving stolen property"
        ]
      },
      {
        slug: "domestic-violence",
        title: "Domestic Violence",
        shortDescription: "Defense against domestic violence accusations.",
        fullDescription: "Domestic violence allegations can arise from misunderstandings, false accusations, or mutual conflicts. These charges carry serious consequences including jail time, restraining orders, and loss of gun rights. Our attorneys provide aggressive defense while handling these sensitive cases with discretion.",
        keyPoints: [
          "False accusation defense",
          "Self-defense arguments",
          "Restraining order defense",
          "Anger management alternatives",
          "Child custody implications",
          "Immigration consequences"
        ]
      },
      {
        slug: "gun-charges",
        title: "Gun Charges",
        shortDescription: "Defense against firearms and weapons charges.",
        fullDescription: "California has some of the strictest gun laws in the nation, and violations can result in serious felony charges. Whether you're facing charges for illegal possession, carrying a concealed weapon, or assault with a firearm, our attorneys understand California's complex firearms laws and can build an effective defense.",
        keyPoints: [
          "Illegal possession charges",
          "Concealed carry violations",
          "Felon in possession defense",
          "Assault with a firearm",
          "Illegal sale or transfer",
          "Second Amendment rights"
        ]
      },
      {
        slug: "traffic-violations",
        title: "Traffic Violations",
        shortDescription: "Defense for serious traffic offenses and DUI charges.",
        fullDescription: "Serious traffic violations like DUI, reckless driving, and hit-and-run can result in criminal charges, license suspension, and jail time. Our attorneys handle traffic-related criminal matters and work to minimize the impact on your driving privileges and criminal record.",
        keyPoints: [
          "DUI and DWI defense",
          "Reckless driving charges",
          "Hit and run defense",
          "Driving on suspended license",
          "DMV hearing representation",
          "License restoration"
        ]
      }
    ]
  }
];

export const getPracticeAreaBySlug = (slug: string): PracticeArea | undefined => {
  return practiceAreas.find(area => area.slug === slug);
};

export const getSubPageBySlug = (areaSlug: string, subSlug: string): SubPage | undefined => {
  const area = getPracticeAreaBySlug(areaSlug);
  return area?.subPages.find(sub => sub.slug === subSlug);
};
