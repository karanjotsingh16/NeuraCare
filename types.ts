
export interface AnalysisStep {
  step: number;
  title: string;
  description: string;
  type?: 'text' | 'breathing';
}

export interface AnalysisResult {
  analysis: {
    sentiment: string;
    summary: string;
  };
  plan: AnalysisStep[];
}
