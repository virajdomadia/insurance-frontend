export interface InsurancePolicy {
  id: string;
  name: string;
  provider: string;
  coverage: string;
  premium: string;
  eligibility: {
    minAge?: number;
    maxAge?: number;
    maxIncome?: number;
    requiresBPL?: boolean;
    districts?: string[];
  };
  benefits: string[];
  description: string;
}

export const allInsurancePolicies: InsurancePolicy[] = [
  {
    id: "POL-001",
    name: "Ayushman Bharat (PM-JAY)",
    provider: "Government of India",
    coverage: "₹5,00,000",
    premium: "Free",
    eligibility: {
      maxIncome: 100000,
      requiresBPL: true,
    },
    benefits: [
      "Cashless treatment",
      "Coverage for secondary & tertiary care",
      "No cap on family size",
    ],
    description: "National health protection scheme for economically vulnerable families",
  },
  {
    id: "POL-002",
    name: "Mahatma Jyotiba Phule Jan Arogya Yojana",
    provider: "Maharashtra Government",
    coverage: "₹1,50,000",
    premium: "Free",
    eligibility: {
      maxIncome: 120000,
      districts: ["Thane", "Palghar", "Mumbai", "Pune"],
    },
    benefits: [
      "Coverage for 996 procedures",
      "Cashless hospitalization",
      "Pre-existing diseases covered",
    ],
    description: "State health insurance scheme for Maharashtra residents",
  },
  {
    id: "POL-003",
    name: "Pradhan Mantri Suraksha Bima Yojana",
    provider: "Government of India",
    coverage: "₹2,00,000",
    premium: "₹20/year",
    eligibility: {
      minAge: 18,
      maxAge: 70,
      maxIncome: 200000,
    },
    benefits: [
      "Accidental death coverage",
      "Total permanent disability coverage",
      "Partial permanent disability coverage",
    ],
    description: "Affordable accident insurance scheme",
  },
  {
    id: "POL-004",
    name: "Rashtriya Swasthya Bima Yojana",
    provider: "Government of India",
    coverage: "₹30,000",
    premium: "Free",
    eligibility: {
      maxIncome: 75000,
      requiresBPL: true,
    },
    benefits: [
      "Hospitalization coverage",
      "Maternity benefits",
      "Coverage for 5 family members",
    ],
    description: "Health insurance for unorganized sector workers",
  },
  {
    id: "POL-005",
    name: "Aam Aadmi Bima Yojana",
    provider: "Government of India",
    coverage: "₹30,000",
    premium: "₹200/year",
    eligibility: {
      minAge: 18,
      maxAge: 59,
      maxIncome: 150000,
    },
    benefits: [
      "Natural death coverage",
      "Accidental death coverage",
      "Disability coverage",
    ],
    description: "Life and disability insurance for rural landless households",
  },
  {
    id: "POL-006",
    name: "Senior Citizen Health Insurance",
    provider: "Private Insurers",
    coverage: "₹3,00,000",
    premium: "₹5,000/year",
    eligibility: {
      minAge: 60,
      maxIncome: 300000,
    },
    benefits: [
      "Comprehensive health coverage",
      "Pre-existing disease coverage after 2 years",
      "Cashless treatment",
    ],
    description: "Specialized health insurance for senior citizens",
  },
];

export function getEligiblePolicies(formData: {
  age?: number;
  income?: number;
  bpl?: boolean;
  district?: string;
}): InsurancePolicy[] {
  return allInsurancePolicies.filter((policy) => {
    const { eligibility } = policy;

    // Check age eligibility
    if (formData.age !== undefined) {
      if (eligibility.minAge && formData.age < eligibility.minAge) {
        return false;
      }
      if (eligibility.maxAge && formData.age > eligibility.maxAge) {
        return false;
      }
    }

    // Check income eligibility
    if (formData.income !== undefined && eligibility.maxIncome) {
      if (formData.income > eligibility.maxIncome) {
        return false;
      }
    }

    // Check BPL requirement
    if (eligibility.requiresBPL !== undefined) {
      if (eligibility.requiresBPL && !formData.bpl) {
        return false;
      }
    }

    // Check district eligibility
    if (eligibility.districts && formData.district) {
      const districtLower = formData.district.toLowerCase();
      if (!eligibility.districts.some((d) => districtLower.includes(d.toLowerCase()))) {
        return false;
      }
    }

    return true;
  });
}

