/**
 * Practice Area FAQs - Gurovich Law Group
 * 
 * FAQ data for each practice area to enable rich snippets in search results
 * via JSON-LD FAQ schema markup
 */

export interface FAQ {
  question: string;
  answer: string;
}

export interface PracticeAreaFAQs {
  slug: string;
  faqs: FAQ[];
}

export const practiceAreaFAQs: PracticeAreaFAQs[] = [
  {
    slug: "personal-injury",
    faqs: [
      {
        question: "How much does it cost to hire a personal injury lawyer?",
        answer: "At Gurovich Law Group, we work on a contingency fee basis for personal injury cases. This means you pay nothing upfront and we only get paid if we win your case. Our fee is a percentage of the settlement or verdict we obtain for you."
      },
      {
        question: "How long do I have to file a personal injury claim in California?",
        answer: "In California, the statute of limitations for most personal injury claims is two years from the date of the injury. However, there are exceptions that may shorten or extend this deadline, so it's important to consult with an attorney as soon as possible after your injury."
      },
      {
        question: "What compensation can I receive in a personal injury case?",
        answer: "Personal injury victims may be entitled to compensation for medical expenses (past and future), lost wages, pain and suffering, emotional distress, property damage, and in some cases, punitive damages. The amount depends on the severity of your injuries and the circumstances of your case."
      },
      {
        question: "Should I accept the insurance company's first settlement offer?",
        answer: "We generally advise against accepting the first settlement offer without consulting an attorney. Insurance companies often make low initial offers hoping you'll accept before understanding the full value of your claim. An experienced personal injury attorney can evaluate your case and negotiate for fair compensation."
      },
      {
        question: "What should I do immediately after a car accident?",
        answer: "After ensuring everyone's safety, you should call 911, exchange information with other drivers, take photos of the scene and damage, get contact information from witnesses, seek medical attention even if you feel fine, and contact a personal injury attorney before speaking with insurance companies."
      }
    ]
  },
  {
    slug: "criminal-defense",
    faqs: [
      {
        question: "What should I do if I'm arrested in California?",
        answer: "If arrested, remain calm and exercise your right to remain silent. Politely decline to answer questions without an attorney present. Do not resist arrest or argue with officers. Contact a criminal defense attorney as soon as possible. Remember, anything you say can be used against you in court."
      },
      {
        question: "What's the difference between a misdemeanor and a felony?",
        answer: "In California, misdemeanors are less serious crimes punishable by up to one year in county jail and fines up to $1,000. Felonies are more serious offenses that can result in state prison sentences of more than one year, larger fines, and more severe long-term consequences for your record."
      },
      {
        question: "Can a criminal record be expunged in California?",
        answer: "Yes, many criminal convictions in California can be expunged under Penal Code 1203.4. If you successfully completed probation or were convicted of an offense that didn't result in state prison, you may be eligible to have your conviction dismissed. This can help with employment and housing applications."
      },
      {
        question: "What are my rights during a police investigation?",
        answer: "You have the right to remain silent (Fifth Amendment), the right to an attorney (Sixth Amendment), and the right to refuse searches without a warrant (Fourth Amendment). You should clearly invoke these rights by stating you wish to remain silent and want an attorney."
      },
      {
        question: "How much does a criminal defense attorney cost?",
        answer: "Criminal defense fees vary based on the complexity of the case, the charges involved, and whether the case goes to trial. We offer free initial consultations to discuss your case and provide transparent fee structures. Many cases can be handled for a flat fee, while more complex cases may require hourly billing."
      }
    ]
  },
  {
    slug: "employment-law",
    faqs: [
      {
        question: "What qualifies as wrongful termination in California?",
        answer: "Wrongful termination occurs when an employer fires an employee for illegal reasons, such as discrimination based on protected characteristics, retaliation for reporting violations or exercising legal rights, breach of an employment contract, or violation of public policy. California is an at-will state, but these exceptions provide important protections."
      },
      {
        question: "How do I prove workplace discrimination?",
        answer: "To prove workplace discrimination, you need to show you belong to a protected class, you were qualified for your position, you suffered an adverse employment action, and the circumstances suggest discrimination. Evidence can include discriminatory comments, unequal treatment compared to others, timing of adverse actions, and statistical patterns."
      },
      {
        question: "What should I do if I'm being sexually harassed at work?",
        answer: "Document all incidents with dates, times, locations, witnesses, and what was said or done. Report the harassment to HR or management in writing. Keep copies of all communications. If your employer doesn't take appropriate action, you can file a complaint with the California Civil Rights Department (formerly DFEH) and consult with an employment attorney."
      },
      {
        question: "Am I entitled to overtime pay in California?",
        answer: "Most non-exempt employees in California are entitled to overtime pay: 1.5 times their regular rate for hours over 8 in a day or 40 in a week, and 2 times their regular rate for hours over 12 in a day. Some employees are exempt from overtime based on their job duties and salary level."
      },
      {
        question: "How long do I have to file an employment discrimination claim?",
        answer: "In California, you generally have three years to file a complaint with the Civil Rights Department for most employment discrimination claims. However, federal claims with the EEOC have shorter deadlines (300 days). It's best to consult with an attorney promptly to ensure you don't miss any deadlines."
      }
    ]
  },
  {
    slug: "civil-litigation",
    faqs: [
      {
        question: "What is civil litigation?",
        answer: "Civil litigation is the legal process for resolving disputes between individuals, businesses, or organizations that don't involve criminal charges. It covers a wide range of matters including contract disputes, property disputes, personal injury claims, business conflicts, and landlord-tenant issues. The goal is typically to obtain compensation or specific performance rather than criminal penalties."
      },
      {
        question: "How long does a civil lawsuit take in California?",
        answer: "The timeline varies significantly based on the complexity of the case, court schedules, and whether the case settles or goes to trial. Simple cases may resolve in a few months, while complex litigation can take several years. Many cases settle before trial through negotiation or mediation."
      },
      {
        question: "What's the difference between mediation and arbitration?",
        answer: "Mediation is a voluntary process where a neutral mediator helps parties negotiate a settlement, but cannot impose a decision. Arbitration is more formal, where an arbitrator hears evidence and makes a binding decision. Both are forms of alternative dispute resolution that can be faster and less expensive than traditional litigation."
      },
      {
        question: "What is a restraining order and how do I get one?",
        answer: "A restraining order is a court order that protects you from harassment, abuse, or threats by requiring another person to stay away from you. To obtain one, you must file a petition with the court describing the harassment or abuse. Temporary orders can be granted quickly, with a hearing scheduled for a permanent order."
      },
      {
        question: "Can I sue my landlord for uninhabitable conditions?",
        answer: "Yes, California law requires landlords to maintain rental properties in habitable condition. If your landlord fails to make necessary repairs affecting health and safety, you may be able to withhold rent, repair and deduct, or sue for damages. Document all issues and communications with your landlord before taking legal action."
      }
    ]
  }
];

export const getFAQsBySlug = (slug: string): FAQ[] | undefined => {
  const area = practiceAreaFAQs.find(a => a.slug === slug);
  return area?.faqs;
};

/**
 * Generate JSON-LD FAQ schema markup for a practice area
 */
export const generateFAQSchema = (slug: string): string | null => {
  const faqs = getFAQsBySlug(slug);
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return JSON.stringify(schema);
};
