// Mock prediction model to simulate the ML model's behavior
// In a real application, this would call a backend API with the actual model

export type ApplicationData = {
  gender: string;
  married: string;
  dependents: string;
  education: string;
  selfEmployed: string;
  applicantIncome: number;
  coapplicantIncome: number;
  loanAmount: number;
  loanTerm: number;
  creditHistory: string;
  propertyArea: string;
};

export type PredictionResult = {
  approved: boolean;
  confidence: number;
  factors: {
    creditHistoryImpact: number;
    incomeImpact: number;
    educationImpact: number;
    propertyAreaImpact: number;
  };
};

// This is a simplified model that mimics the decision tree logic
// based on the most important factors from the actual model
export const predictLoanApproval = (data: ApplicationData): PredictionResult => {
  // Starting with a base score
  let score = 50;
  
  // Credit history has the highest impact (based on the actual model)
  if (data.creditHistory === '1') {
    score += 30;
  } else {
    score -= 30;
  }
  
  // Income to loan ratio impact
  const incomeToLoanRatio = (data.applicantIncome + data.coapplicantIncome) / data.loanAmount;
  if (incomeToLoanRatio > 5) {
    score += 15;
  } else if (incomeToLoanRatio > 3) {
    score += 10;
  } else if (incomeToLoanRatio > 2) {
    score += 5;
  } else {
    score -= 5;
  }
  
  // Education impact
  if (data.education === 'Graduate') {
    score += 5;
  }
  
  // Property area impact
  if (data.propertyArea === 'Urban') {
    score += 5;
  } else if (data.propertyArea === 'Semiurban') {
    score += 3;
  }
  
  // Marital status impact
  if (data.married === 'Yes') {
    score += 2;
  }
  
  // Self-employment impact
  if (data.selfEmployed === 'Yes') {
    score -= 2; // Slightly negative impact based on the model
  }
  
  // Dependents impact
  if (data.dependents === '0') {
    score += 1;
  } else if (data.dependents === '3+') {
    score -= 1;
  }
  
  // Loan term impact (longer terms are slightly riskier)
  if (data.loanTerm <= 180) {
    score += 2;
  } else if (data.loanTerm >= 360) {
    score -= 2;
  }
  
  // Ensure score stays within 0-100 range
  score = Math.max(0, Math.min(100, score));
  
  // Approval threshold
  const approved = score >= 60;
  
  return {
    approved,
    confidence: score,
    factors: {
      creditHistoryImpact: data.creditHistory === '1' ? 30 : -30,
      incomeImpact: incomeToLoanRatio > 3 ? 10 : (incomeToLoanRatio > 2 ? 5 : -5),
      educationImpact: data.education === 'Graduate' ? 5 : 0,
      propertyAreaImpact: data.propertyArea === 'Urban' ? 5 : (data.propertyArea === 'Semiurban' ? 3 : 0),
    }
  };
};