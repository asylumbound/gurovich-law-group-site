import { Check } from "lucide-react";

const caseResults = [
  { amount: "$3,000,000", description: "Wrongful Death | Settlement" },
  { amount: "$1,400,000", description: "Slip and Fall | Settlement" },
  { amount: "$650,000", description: "Employment (wrongful termination) | Trial Verdict" },
  { amount: "$457,000", description: "Dog Bite | Settlement" },
  { amount: "$1,300,000", description: "Motorcycle Accident | Settlement" },
  { amount: "$1,250,000", description: "Vehicle Accident | Trial Verdict" },
  { amount: "$458,000", description: "Scooter Accident | Settlement" },
  { amount: "$6,800,000", description: "Ponzi Scheme Fraud | Trial Verdict" },
];

export default function NoFeeGuarantee() {
  return (
    <section className="bg-[#1a1f2e] py-16 md:py-20">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Shield Icon with Text */}
          <div className="flex-shrink-0 relative">
            <div className="relative w-64 h-72 md:w-72 md:h-80">
              {/* Shield SVG */}
              <svg
                viewBox="0 0 200 240"
                className="w-full h-full text-white/90"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  d="M100 10 L180 40 L180 120 C180 180 100 220 100 220 C100 220 20 180 20 120 L20 40 Z"
                  fill="none"
                />
              </svg>
              
              {/* Text inside shield */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8">
                <span className="text-2xl md:text-3xl font-bold tracking-wide">NO FEE</span>
                <span className="text-2xl md:text-3xl font-bold tracking-wide">GUARANTEE</span>
                <div className="mt-3 text-xs md:text-sm font-medium tracking-wider opacity-80">
                  YOU DON'T PAY
                </div>
                <div className="text-xs md:text-sm font-medium tracking-wider opacity-80">
                  UNLESS WE WIN
                </div>
              </div>
              
              {/* Checkmark at bottom */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#1a1f2e] p-1">
                <Check className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>

          {/* Case Results Grid */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 md:gap-x-8 md:gap-y-10">
              {caseResults.map((result, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
                    {result.amount}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 leading-tight">
                    {result.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
