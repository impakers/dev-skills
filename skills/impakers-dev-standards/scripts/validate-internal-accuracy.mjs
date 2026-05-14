#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = path.dirname(SCRIPT_DIR);
const TESTS_DIR = path.join(SKILL_DIR, "tests");
const CASES_FILE = path.join(TESTS_DIR, "cases", "internal-accuracy-cases.yaml");
const PROMPT_FILE = path.join(TESTS_DIR, "judge", "prompt.md");
const REPORT_SCHEMA_FILE = path.join(TESTS_DIR, "judge", "report.schema.json");
const REPORTS_DIR = path.join(TESTS_DIR, "reports");

const RUBRIC_CRITERIA = new Set([
  "evidence_fidelity",
  "uncertainty_handling",
  "profile_correctness",
  "standards_actionability",
  "risk_transparency",
]);

const BLOCKING_FAILURES = new Set([
  "unsupported_high_confidence_claim",
  "hallucinated_stack_or_policy",
  "hidden_measurement_gap",
  "wrong_default_profile_application",
  "source_of_truth_confusion",
  "missing_handoff_risk_status",
]);

const PHASES = ["discovery", "extraction", "interview", "synthesis", "gate", "handoff"];
const errors = [];

const cases = parseCases(readText(CASES_FILE));
const reportSchema = readJson(REPORT_SCHEMA_FILE);
const prompt = readText(PROMPT_FILE);

validateCases(cases);
validatePromptMatchesSchema(prompt, reportSchema);

const sampleReport = buildSampleReport(cases.find((testCase) => testCase.id === "no-coverage-tooling") ?? cases[0]);
validateReportShape(sampleReport);
writeSampleReports(sampleReport);

if (errors.length > 0) {
  console.error(`internal accuracy validation failed with ${errors.length} error(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(`internal accuracy validation passed (${cases.length} case(s), sample report generated)`);
}

function readText(filePath) {
  if (!existsSync(filePath)) {
    errors.push(`Missing file: ${relative(filePath)}`);
    return "";
  }

  return readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  const raw = readText(filePath);

  if (raw.length === 0) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    errors.push(`Invalid JSON ${relative(filePath)}: ${error.message}`);
    return null;
  }
}

function parseCases(raw) {
  const parsed = [];
  let current = null;
  let currentListKey = null;

  for (const line of raw.split(/\r?\n/)) {
    const caseStart = line.match(/^\s*- id: (.+)$/);
    const scalar = line.match(/^\s{4}([a-z_]+): (.+)$/);
    const listItem = line.match(/^\s{6}- (.+)$/);

    if (caseStart !== null) {
      current = { id: caseStart[1].trim(), judge_focus: [] };
      parsed.push(current);
      currentListKey = null;
    } else if (current !== null && scalar !== null) {
      const [, key, value] = scalar;
      current[key] = value.trim();
      currentListKey = null;
    } else if (current !== null && line.match(/^\s{4}judge_focus:/) !== null) {
      currentListKey = "judge_focus";
    } else if (current !== null && currentListKey === "judge_focus" && listItem !== null) {
      current.judge_focus.push(listItem[1].trim());
    }
  }

  return parsed;
}

function validateCases(testCases) {
  if (testCases.length === 0) {
    errors.push("No internal accuracy cases found");
    return;
  }

  const ids = new Set();

  for (const testCase of testCases) {
    if (ids.has(testCase.id)) {
      errors.push(`Duplicate case id: ${testCase.id}`);
    }
    ids.add(testCase.id);

    for (const field of ["purpose", "fixture", "gold"]) {
      if (typeof testCase[field] !== "string" || testCase[field].length === 0) {
        errors.push(`Case ${testCase.id} is missing ${field}`);
      }
    }

    validateTestsRootPath(testCase.id, "fixture", testCase.fixture, true);
    validateTestsRootPath(testCase.id, "gold", testCase.gold, false);
    validateJudgeFocus(testCase);
    validateGoldCaseId(testCase);
  }
}

function validateTestsRootPath(caseId, field, value, shouldBeDirectory) {
  const resolved = path.join(TESTS_DIR, value ?? "");

  if (!existsSync(resolved)) {
    errors.push(`Case ${caseId} ${field} path does not exist: ${value}`);
    return;
  }

  if (shouldBeDirectory && !value.startsWith("fixtures/")) {
    errors.push(`Case ${caseId} fixture must be tests-root-relative under fixtures/: ${value}`);
  }

  if (!shouldBeDirectory && !value.startsWith("gold/")) {
    errors.push(`Case ${caseId} gold must be tests-root-relative under gold/: ${value}`);
  }
}

function validateJudgeFocus(testCase) {
  if (!Array.isArray(testCase.judge_focus) || testCase.judge_focus.length === 0) {
    errors.push(`Case ${testCase.id} must define judge_focus`);
    return;
  }

  for (const focus of testCase.judge_focus) {
    if (!RUBRIC_CRITERIA.has(focus) && !BLOCKING_FAILURES.has(focus)) {
      errors.push(`Case ${testCase.id} has unknown judge_focus: ${focus}`);
    }
  }
}

function validateGoldCaseId(testCase) {
  const goldPath = path.join(TESTS_DIR, testCase.gold ?? "");
  const gold = readText(goldPath);
  const expectedLine = `case_id: ${testCase.id}`;

  if (gold.length > 0 && !gold.includes(expectedLine)) {
    errors.push(`Gold file for ${testCase.id} must include '${expectedLine}'`);
  }
}

function validatePromptMatchesSchema(promptText, schema) {
  if (schema === null) {
    return;
  }

  for (const field of schema.required ?? []) {
    if (!promptText.includes(`"${field}"`)) {
      errors.push(`Judge prompt required JSON output is missing schema field: ${field}`);
    }
  }
}

function buildSampleReport(testCase) {
  const phaseResults = Object.fromEntries(
    PHASES.map((phase) => [phase, { verdict: "pass", score: 1 }]),
  );

  return {
    run_id: `sample-${testCase.id}`,
    fixture: testCase.id,
    skill_version: readSkillVersion(),
    verdict: "pass",
    score: 1,
    threshold: 0.82,
    blocking_failures: [],
    phase_results: phaseResults,
    rubric_scores: {
      evidence_fidelity: 1,
      uncertainty_handling: 1,
      profile_correctness: 1,
      standards_actionability: 1,
      risk_transparency: 1,
    },
    issues: [],
    reasoning_summary: "Sample report used to validate the internal accuracy report contract.",
  };
}

function readSkillVersion() {
  const skill = readText(path.join(SKILL_DIR, "SKILL.md"));
  const match = skill.match(/^version:\s*([^\n]+)$/m);

  return match?.[1]?.trim() ?? "unknown";
}

function validateReportShape(report) {
  for (const field of [
    "run_id",
    "fixture",
    "skill_version",
    "verdict",
    "score",
    "threshold",
    "blocking_failures",
    "phase_results",
    "rubric_scores",
    "issues",
  ]) {
    if (!(field in report)) {
      errors.push(`Sample report missing required field: ${field}`);
    }
  }

  for (const phase of PHASES) {
    if (!(phase in report.phase_results)) {
      errors.push(`Sample report missing phase result: ${phase}`);
    }
  }

  for (const criterion of RUBRIC_CRITERIA) {
    if (!(criterion in report.rubric_scores)) {
      errors.push(`Sample report missing rubric score: ${criterion}`);
    }
  }
}

function writeSampleReports(report) {
  mkdirSync(REPORTS_DIR, { recursive: true });

  const jsonPath = path.join(REPORTS_DIR, `${report.run_id}.json`);
  const mdPath = path.join(REPORTS_DIR, `${report.run_id}.md`);

  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(mdPath, renderMarkdownReport(report));
}

function renderMarkdownReport(report) {
  const phaseRows = PHASES.map((phase) => {
    const result = report.phase_results[phase];
    return `| ${phase} | ${result.verdict.toUpperCase()} | ${result.score} | Sample contract validation |`;
  }).join("\n");

  return `# impakers-dev-standards 내부 정확성 평가 리포트\n\n## 1. 실행 요약\n\n| 항목 | 값 |\n|---|---|\n| Run ID | ${report.run_id} |\n| Fixture | ${report.fixture} |\n| Skill Version | ${report.skill_version} |\n| 평가 대상 | docs/DEV_STANDARDS.md |\n| 최종 판정 | ${report.verdict.toUpperCase()} |\n| 총점 | ${report.score} |\n| 통과 기준 | ${report.threshold} 이상, blocking failure 없음 |\n\n## 2. 최종 판정\n\n**Verdict:** ${report.verdict.toUpperCase()}\n\n${report.reasoning_summary}\n\n## 3. Phase별 결과\n\n| Phase | 판정 | 점수 | 주요 결과 |\n|---|---:|---:|---|\n${phaseRows}\n`;
}

function relative(filePath) {
  return path.relative(process.cwd(), filePath);
}
