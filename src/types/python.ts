export type EngineStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface PythonVariable {
  name: string;
  type: string;
  value: string;
}

export interface ExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  errorType?: string;
  errorHint?: string;
  durationMs: number;
  variables: PythonVariable[];
}

export interface PythonPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  code: string;
  stdin?: string;
}

export interface LessonItem {
  id: string;
  title: string;
  durationMinutes: number;
  summary: string;
  conceptPoints: string[];
  syntaxNote: string;
  code: string;
  stdin?: string;
}

export interface LessonModule {
  id: string;
  indexLabel: string;
  title: string;
  level: string;
  description: string;
  lessons: LessonItem[];
}

export type ChallengeDifficulty = '基礎入門' | '邏輯演算法' | '資料處理';

export interface ChallengeTestCase {
  id: string;
  description: string;
  assertionCode: string;
}

export interface CodingChallenge {
  id: string;
  title: string;
  difficulty: ChallengeDifficulty;
  estimatedMinutes: number;
  prompt: string;
  functionSignature: string;
  starterCode: string;
  hint: string;
  solutionCode: string;
  testCases: ChallengeTestCase[];
}

export interface TestCaseResult {
  id: string;
  description: string;
  passed: boolean;
  errorMessage?: string;
}

export interface ChallengeRunResult {
  allPassed: boolean;
  stdout: string;
  compileError?: string;
  durationMs: number;
  results: TestCaseResult[];
}

export type CheatsheetCategory =
  | '全部'
  | '基礎與型別'
  | '字串操作'
  | '串列與字典'
  | '函式與推導式'
  | '內建工具';

export interface CheatsheetItem {
  id: string;
  category: Exclude<CheatsheetCategory, '全部'>;
  title: string;
  summary: string;
  snippet: string;
}
