export interface Chapter {
  id: number;
  slug: string;
  title: string;
  category: 'fundamentos' | 'pratica' | 'integracoes' | 'avancado' | 'etica';
  summary: string;
  content: string[];
  codeSnippets?: {
    language: string;
    caption?: string;
    code: string;
  }[];
  table?: {
    headers: string[];
    rows: string[][];
  };
  tips?: string[];
  warnings?: string[];
}

export interface CWEInfo {
  cwe: string;
  name: string;
  defaultSeverity: 'Crítica' | 'Alta' | 'Médio' | 'Baixo' | 'Info';
  scoreBase: number;
  description: string;
  detectionMechanism: string;
  targetFilesOrHeaders: string[];
  falsePositiveRisks: string;
  howToMitigate: string;
  hackerOneImpact: string;
}

export interface ScenarioPreset {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  command: string;
  explanation: string;
  tags: string[];
}

export interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  bullets: {
    title: string;
    desc: string;
    icon: string;
  }[];
  codeBlock?: {
    lang: string;
    code: string;
    note?: string;
  };
  keyTakeaway: string;
}
