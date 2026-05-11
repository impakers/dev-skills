#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_TARGET = "docs/DEV_STANDARDS.md";
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_SCHEMA = path.join(SCRIPT_DIR, "dev-standards.schema.json");

const REQUIRED_SLOT_IDS = [
  "project.name_ko",
  "project.name_en",
  "project.client",
  "project.vendor",
  "project.last_modified",
  "tech.frontend",
  "tech.backend",
  "tech.db",
  "tech.auth",
  "tech.infra",
  "architecture.overview_mermaid",
  "architecture.modules",
  "architecture.integrations",
  "rbac.roles",
  "invariants",
  "data.classification",
  "data.compliance",
  "naming.common",
  "naming.backend",
  "naming.frontend",
  "naming.db",
  "naming.api",
  "naming.domain_terms",
  "dev.layering_rules",
  "dev.boundary_map",
  "dev.fsd_enforcement",
  "dev.dto_pattern",
  "dev.validation",
  "dev.runtime_validation",
  "dev.source_of_truth",
  "dev.client_server_boundary",
  "dev.exceptions",
  "dev.transaction",
  "dev.logging",
  "dev.testing",
  "dev.comments",
  "ui.principles",
  "ui.color_tokens",
  "ui.components",
  "ui.layouts",
  "ui.responsive",
  "quality.data_kpi",
  "quality.code_kpi",
  "quality.coverage_status",
  "quality.metrics_methodology",
  "quality.validation_log",
  "quality.gates",
  "quality.fsd_compliance_gate",
  "artifacts.classification",
  "docs.sync_policy",
  "deploy.infra_components",
  "deploy.pipeline_stages",
  "deploy.environments",
  "deploy.container_policy",
  "deploy.strategy",
  "directory.monorepo_tree",
  "directory.backend_tree",
  "directory.frontend_tree",
  "git.branch_strategy",
  "git.commit_convention",
  "git.mr_rules",
  "ops.availability",
  "ops.monitoring",
  "ops.incidents",
  "ops.backup",
  "ops.mock_fallback",
];

const REQUIRED_NEW_SLOT_IDS = [
  "dev.boundary_map",
  "dev.fsd_enforcement",
  "dev.runtime_validation",
  "dev.source_of_truth",
  "dev.client_server_boundary",
  "quality.coverage_status",
  "quality.metrics_methodology",
  "quality.validation_log",
  "quality.fsd_compliance_gate",
  "artifacts.classification",
  "docs.sync_policy",
];

const CHAPTERS = [
  [1, "개요"],
  [2, "시스템 아키텍처"],
  [3, "비즈니스 불변 규칙"],
  [4, "데이터 분류 및 보안"],
  [5, "명명규칙 표준"],
  [6, "개발표준"],
  [7, "UI/UX 표준"],
  [8, "품질 기준"],
  [9, "배포 및 CI/CD 표준"],
  [10, "Directory 표준"],
  [11, "Git 컨벤션"],
  [12, "장애 대응 및 모니터링"],
];

const CONFIDENCE_VALUES = new Set(["high", "medium", "low", "missing"]);
const MEASUREMENT_KINDS = new Set(["measured", "proxy", "unavailable"]);
const ARTIFACT_KINDS = new Set(["draft", "preview", "confirmed", "export", "public_fixture", "file_asset"]);
const UNSAFE_TS_SUPPRESSIONS = ["as any", "@ts-ignore", "@ts-expect-error", "@ts-nocheck"];
const NON_TYPESCRIPT_OVERRIDE_PATTERN = /비-TypeScript|non-TypeScript|not TypeScript|TypeScript\s*미사용|TypeScript\s*not used/i;
const REPLACEMENT_RUNTIME_PROFILE_PATTERN = /replacement\s+(runtime\s+validation\s+)?(profile|validator|schema)|alternative\s+(runtime\s+validation\s+)?(profile|validator|schema)|non-TypeScript\s+override[^\n]*(profile|validator|schema)|대체\s*(런타임\s*검증\s*)?(profile|프로필|validator|검증기|schema|스키마)|비-TypeScript[^\n]*(profile|프로필|validator|검증기|schema|스키마)/i;
const OVERRIDE_EVIDENCE_PATTERN = /evidence|근거|ADR|RFC|decision|reference|참조|문서|링크|path|file|line/i;
const REQUIRED_SKILL_MARKERS = [
  "version: 0.4.0",
  "번들 F — 경계 · 검증 · 측정",
  "번들 G — 레이어링/FSD 강제 규칙",
  "Next.js + TypeScript + FSD",
  "기본 profile",
  "비-Next/비-TypeScript/비-FSD",
  "override",
  "typia runtime schema",
  "TypeScript 프로젝트",
  "strict typia validator",
  "widgets/*/ui",
  "features/*/ui",
  "entities/*/ui",
  "shared/ui",
  "components/ui",
  "dev.boundary_map",
  "dev.fsd_enforcement",
  "quality.fsd_compliance_gate",
  "dev.runtime_validation",
  "dev.source_of_truth",
  "dev.client_server_boundary",
  "quality.coverage_status",
  "quality.metrics_methodology",
  "quality.validation_log",
  "artifacts.classification",
  "docs.sync_policy",
  "과장 방지 규칙",
  "측정값 | proxy | 측정 불가",
];

const options = parseArgs(process.argv.slice(2));
const errors = [];
const warnings = [];

validateSchemaFile(options.schema, errors);

if (options.skill !== null) {
  validateSkillFile(options.skill, errors);
}

if (options.slotData !== null) {
  validateSlotData(options.slotData, errors);
}

if (options.target !== null) {
  validateDevStandardsDocument(options.target, options.allowMissing, errors, warnings);
}

for (const warning of warnings) {
  console.warn(`warning: ${warning}`);
}

if (errors.length > 0) {
  console.error(`dev-standards validation failed with ${errors.length} error(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log("dev-standards validation passed");
}

function parseArgs(args) {
  const parsed = {
    allowMissing: false,
    schema: DEFAULT_SCHEMA,
    skill: null,
    slotData: null,
    target: DEFAULT_TARGET,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--allow-missing") {
      parsed.allowMissing = true;
    } else if (arg === "--no-target") {
      parsed.target = null;
    } else if (arg === "--target") {
      parsed.target = readOptionValue(args, index, arg);
      index += 1;
    } else if (arg === "--slot-data") {
      parsed.slotData = readOptionValue(args, index, arg);
      index += 1;
    } else if (arg === "--slot-schema" || arg === "--schema") {
      parsed.schema = readOptionValue(args, index, arg);
      index += 1;
    } else if (arg === "--skill") {
      parsed.skill = readOptionValue(args, index, arg);
      index += 1;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return parsed;
}

function readOptionValue(args, index, optionName) {
  const value = args[index + 1];

  if (value === undefined || value.startsWith("--")) {
    throw new Error(`${optionName} requires a value`);
  }

  return value;
}

function validateSchemaFile(schemaPath, outputErrors) {
  const resolved = resolveProjectPath(schemaPath);

  if (!existsSync(resolved)) {
    outputErrors.push(`JSON Schema not found: ${schemaPath}`);
    return;
  }

  const schema = readJson(resolved, outputErrors);

  if (schema === null) {
    return;
  }

  const slotEnum = schema.$defs?.slotId?.enum;
  const confidenceEnum = schema.$defs?.confidence?.enum;
  const measurementEnum = schema.$defs?.measurementKind?.enum;
  const artifactEnum = schema.$defs?.artifactKind?.enum;

  if (!Array.isArray(slotEnum)) {
    outputErrors.push("JSON Schema must define $defs.slotId.enum");
  } else {
    for (const slotId of REQUIRED_SLOT_IDS) {
      if (!slotEnum.includes(slotId)) {
        outputErrors.push(`JSON Schema is missing slot ID: ${slotId}`);
      }
    }
  }

  assertEnumIncludes(confidenceEnum, [...CONFIDENCE_VALUES], "$defs.confidence.enum", outputErrors);
  assertEnumIncludes(measurementEnum, [...MEASUREMENT_KINDS], "$defs.measurementKind.enum", outputErrors);
  assertEnumIncludes(artifactEnum, [...ARTIFACT_KINDS], "$defs.artifactKind.enum", outputErrors);
}

function validateSkillFile(skillPath, outputErrors) {
  const resolved = resolveProjectPath(skillPath);

  if (!existsSync(resolved)) {
    outputErrors.push(`Skill file not found: ${skillPath}`);
    return;
  }

  const content = readSkillWithResources(resolved, outputErrors);

  validateFenceBalance(content, { label: skillPath, requireLanguage: false }, outputErrors);

  for (const marker of REQUIRED_SKILL_MARKERS) {
    if (!content.includes(marker)) {
      outputErrors.push(`Skill file is missing required marker: ${marker}`);
    }
  }

  for (const slotId of REQUIRED_NEW_SLOT_IDS) {
    if (!content.includes(`\`${slotId}\``)) {
      outputErrors.push(`Skill file is missing new slot catalog entry: ${slotId}`);
    }
  }

  if (content.includes("슬롯 54")) {
    outputErrors.push("Skill file still mentions the old '슬롯 54' count");
  }
}

function readSkillWithResources(skillPath, outputErrors) {
  const skillContent = readFileSync(skillPath, "utf8");
  const resourcesDir = path.join(path.dirname(skillPath), "resources");

  if (!existsSync(resourcesDir)) {
    return skillContent;
  }

  const resourceContents = [];

  for (const entry of readdirSync(resourcesDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      continue;
    }

    const resourcePath = path.join(resourcesDir, entry.name);
    const resourceContent = readFileSync(resourcePath, "utf8");
    validateFenceBalance(resourceContent, { label: resourcePath, requireLanguage: false }, outputErrors);
    resourceContents.push(resourceContent);
  }

  return [skillContent, ...resourceContents].join("\n");
}

function validateSlotData(slotDataPath, outputErrors) {
  const resolved = resolveProjectPath(slotDataPath);

  if (!existsSync(resolved)) {
    outputErrors.push(`Slot data file not found: ${slotDataPath}`);
    return;
  }

  const parsed = readJson(resolved, outputErrors);

  if (parsed === null) {
    return;
  }

  const records = Array.isArray(parsed) ? parsed : parsed.slots;

  if (!Array.isArray(records)) {
    outputErrors.push("Slot data must be an array or an object with a slots array");
    return;
  }

  records.forEach((record, index) => validateSlotRecord(record, `slots[${index}]`, outputErrors));
  validateSlotSet(records, outputErrors);

  if (!Array.isArray(parsed)) {
    if (Array.isArray(parsed.measurements)) {
      parsed.measurements.forEach((measurement, index) => {
        validateMeasurement(measurement, `measurements[${index}]`, outputErrors);
      });
    }

    if (Array.isArray(parsed.artifacts)) {
      parsed.artifacts.forEach((artifact, index) => {
        validateArtifact(artifact, `artifacts[${index}]`, outputErrors);
      });
    }

    if (parsed.handoff !== undefined) {
      validateHandoff(parsed.handoff, "handoff", outputErrors);
    }
  }
}

function validateSlotSet(records, outputErrors) {
  const seenSlots = new Set();

  for (const [index, record] of records.entries()) {
    if (!isPlainObject(record) || typeof record.slot !== "string") {
      continue;
    }

    if (seenSlots.has(record.slot)) {
      outputErrors.push(`slots[${index}].slot is duplicated: ${record.slot}`);
    }

    seenSlots.add(record.slot);
  }

  for (const slotId of REQUIRED_NEW_SLOT_IDS) {
    if (!seenSlots.has(slotId)) {
      outputErrors.push(`Slot data is missing required v0.4 slot: ${slotId}`);
    }
  }
}

function validateSlotRecord(record, recordPath, outputErrors) {
  if (!isPlainObject(record)) {
    outputErrors.push(`${recordPath} must be an object`);
    return;
  }

  if (!REQUIRED_SLOT_IDS.includes(record.slot)) {
    outputErrors.push(`${recordPath}.slot is not a known slot ID: ${String(record.slot)}`);
  }

  if (!CONFIDENCE_VALUES.has(record.confidence)) {
    outputErrors.push(`${recordPath}.confidence must be high | medium | low | missing`);
  }

  if (!Array.isArray(record.evidence)) {
    outputErrors.push(`${recordPath}.evidence must be an array`);
    return;
  }

  if (record.confidence === "missing" && record.evidence.length > 0) {
    outputErrors.push(`${recordPath} has confidence=missing but still contains evidence`);
  }

  if (record.confidence !== "missing" && record.evidence.length === 0) {
    outputErrors.push(`${recordPath} must include evidence unless confidence=missing`);
  }

  record.evidence.forEach((evidence, index) => {
    if (typeof evidence !== "string" || !/^.+:(L)?[0-9]+(-[0-9]+)?$/.test(evidence)) {
      outputErrors.push(`${recordPath}.evidence[${index}] must look like path/to/file.md:42-58`);
    }
  });

  validateRuntimeValidationSlot(record, recordPath, outputErrors);
}

function validateRuntimeValidationSlot(record, recordPath, outputErrors) {
  if (record.slot !== "dev.runtime_validation") {
    return;
  }

  const value = stringifySlotValue(record.value);
  const generalRequiredPatterns = new Map([
    ["runtime validation boundary", /runtime validation|런타임 검증|validator|validation|검증/i],
    ["external input boundary", /외부 입력|external input|request|payload|body|message|callback|webhook|file upload|parser|IPC|queue|event|boundary|경계/i],
    ["strict or equivalent schema validation", /strict|schema|validator|초과\s*속성|unknown|type|타입|스키마|DTO|contract|계약/i],
    ["error status mapping", /error status|상태 코드|400|401|403|404|422|500|에러 매핑|오류 매핑|field|path|expected|validation error|검증 실패/i],
  ]);

  for (const [label, pattern] of generalRequiredPatterns) {
    if (!pattern.test(value)) {
      outputErrors.push(`${recordPath}.value must describe ${label}`);
    }
  }

  const hasNonTypeScriptOverride = NON_TYPESCRIPT_OVERRIDE_PATTERN.test(value);
  const usesTypeScriptTypia = usesDefaultTypeScriptTypiaProfile(value);

  if (hasNonTypeScriptOverride) {
    validateNonTypeScriptOverride(value, `${recordPath}.value`, outputErrors);
  }

  if (!usesTypeScriptTypia && !hasNonTypeScriptOverride) {
    outputErrors.push(`${recordPath}.value must require TypeScript typia runtime schema by default or explicitly document a non-TypeScript override`);
  }

  if (!usesTypeScriptTypia) {
    return;
  }

  const typiaRequiredPatterns = new Map([
    ["typia", /\btypia\b/i],
    ["mandatory wording", /필수|강제|required|must|반드시/i],
    ["TypeScript interface/type source of truth", /TypeScript\s+(interface\/type|type\/interface|interface|type)[^\n]*(source of truth|정본)|((source of truth|정본)[^\n]*TypeScript\s+(interface\/type|type\/interface|interface|type))/i],
    ["unknown external input", /\bunknown\b/i],
    ["strict validator", /strict\s+validator|strict\s+typia|초과\s*속성.*거부|excess\s+propert/i],
    ["server action boundary", /server action|서버 액션/i],
    ["API route boundary", /API\s+route|route handler|API\s*\/|\/api\//i],
    ["file upload or parser boundary", /file upload|파일 업로드|parser|파서/i],
    ["IPC boundary", /\bIPC\b/i],
    ["external callback boundary", /callback|외부 인증/i],
    ["error status mapping", /error status|상태 코드|400|401|403|404|422|500|에러 매핑|오류 매핑/i],
  ]);

  for (const [label, pattern] of typiaRequiredPatterns) {
    if (!pattern.test(value)) {
      outputErrors.push(`${recordPath}.value must require ${label} for typia runtime schema enforcement`);
    }
  }
}

function usesDefaultTypeScriptTypiaProfile(content) {
  return /\btypia\b/i.test(content)
    && /필수|강제|required|must|반드시/i.test(content)
    && /TypeScript\s+(interface\/type|type\/interface|interface|type)[^\n]*(source of truth|정본)|((source of truth|정본)[^\n]*TypeScript\s+(interface\/type|type\/interface|interface|type))/i.test(content);
}

function validateNonTypeScriptOverride(content, context, outputErrors) {
  if (!REPLACEMENT_RUNTIME_PROFILE_PATTERN.test(content)) {
    outputErrors.push(`${context} non-TypeScript override must name the replacement runtime validation profile, validator, or schema`);
  }

  if (!OVERRIDE_EVIDENCE_PATTERN.test(content)) {
    outputErrors.push(`${context} non-TypeScript override must include explicit evidence or reference wording`);
  }
}

function validateMeasurement(measurement, recordPath, outputErrors) {
  if (!isPlainObject(measurement)) {
    outputErrors.push(`${recordPath} must be an object`);
    return;
  }

  if (typeof measurement.name !== "string" || measurement.name.length === 0) {
    outputErrors.push(`${recordPath}.name is required`);
  }

  if (!MEASUREMENT_KINDS.has(measurement.kind)) {
    outputErrors.push(`${recordPath}.kind must be measured | proxy | unavailable`);
  }

  if (typeof measurement.source !== "string" || measurement.source.length === 0) {
    outputErrors.push(`${recordPath}.source is required`);
  }

  if ((measurement.kind === "measured" || measurement.kind === "proxy") && typeof measurement.formula !== "string") {
    outputErrors.push(`${recordPath}.formula is required for measured/proxy metrics`);
  }

  if ((measurement.kind === "measured" || measurement.kind === "proxy") && typeof measurement.scope !== "string") {
    outputErrors.push(`${recordPath}.scope is required for measured/proxy metrics`);
  }

  if (measurement.kind === "unavailable" && typeof measurement.risk !== "string") {
    outputErrors.push(`${recordPath}.risk is required when a metric is unavailable`);
  }
}

function validateArtifact(artifact, recordPath, outputErrors) {
  if (!isPlainObject(artifact)) {
    outputErrors.push(`${recordPath} must be an object`);
    return;
  }

  if (typeof artifact.name !== "string" || artifact.name.length === 0) {
    outputErrors.push(`${recordPath}.name is required`);
  }

  if (!ARTIFACT_KINDS.has(artifact.kind)) {
    outputErrors.push(`${recordPath}.kind must be one of ${[...ARTIFACT_KINDS].join(", ")}`);
  }

  if (typeof artifact.sourceOfTruth !== "boolean") {
    outputErrors.push(`${recordPath}.sourceOfTruth must be boolean`);
  }
}

function validateHandoff(handoff, recordPath, outputErrors) {
  if (!isPlainObject(handoff)) {
    outputErrors.push(`${recordPath} must be an object`);
    return;
  }

  if (handoff.file !== DEFAULT_TARGET) {
    outputErrors.push(`${recordPath}.file must be ${DEFAULT_TARGET}`);
  }

  if (!Number.isInteger(handoff.filledSlots) || handoff.filledSlots < 0) {
    outputErrors.push(`${recordPath}.filledSlots must be a non-negative integer`);
  }

  if (!Number.isInteger(handoff.totalSlots) || handoff.totalSlots < 60) {
    outputErrors.push(`${recordPath}.totalSlots must be an integer >= 60`);
  }

  if (!Number.isInteger(handoff.todoCount) || handoff.todoCount < 0) {
    outputErrors.push(`${recordPath}.todoCount must be a non-negative integer`);
  }

  if (Number.isInteger(handoff.filledSlots) && Number.isInteger(handoff.totalSlots) && handoff.filledSlots > handoff.totalSlots) {
    outputErrors.push(`${recordPath}.filledSlots must not exceed totalSlots`);
  }

  validateMeasurement(handoff.coverageStatus, `${recordPath}.coverageStatus`, outputErrors);

  if (Array.isArray(handoff.measurements)) {
    handoff.measurements.forEach((measurement, index) => {
      validateMeasurement(measurement, `${recordPath}.measurements[${index}]`, outputErrors);
    });
  }

  if (!Array.isArray(handoff.risks)) {
    outputErrors.push(`${recordPath}.risks must be an array`);
  }
}

function validateDevStandardsDocument(targetPath, allowMissing, outputErrors, outputWarnings) {
  const resolved = resolveProjectPath(targetPath);

  if (!existsSync(resolved)) {
    if (allowMissing) {
      outputWarnings.push(`${targetPath} does not exist yet; strict DEV_STANDARDS gate skipped`);
      return;
    }

    outputErrors.push(`${targetPath} does not exist`);
    return;
  }

  const normalizedTarget = targetPath.split(path.sep).join("/");

  if (!normalizedTarget.endsWith(DEFAULT_TARGET)) {
    outputErrors.push(`DEV_STANDARDS output path must end with ${DEFAULT_TARGET}`);
  }

  const content = readFileSync(resolved, "utf8");
  const visibleContent = withoutFencedCode(content);

  validateFenceBalance(content, { label: targetPath, requireLanguage: true }, outputErrors);
  validateChapterOrder(content, outputErrors);
  validateHeadingDepth(visibleContent, outputErrors);
  validateTableAlignment(content, outputErrors);
  validateInternalLinks(visibleContent, outputErrors);
  validateRendererPurity(visibleContent, outputErrors);
  validateUnsupportedClaims(visibleContent, outputErrors);
  validateGateSections(content, visibleContent, outputErrors);
}

function validateChapterOrder(content, outputErrors) {
  const matches = [...content.matchAll(/^##\s+(\d+)\.\s+(.+)$/gm)];
  const chapterMatches = matches.filter((match) => Number(match[1]) >= 1 && Number(match[1]) <= 12);

  if (chapterMatches.length < CHAPTERS.length) {
    outputErrors.push(`Expected 12 numbered chapters, found ${chapterMatches.length}`);
    return;
  }

  for (const [index, [expectedNumber, expectedTitle]] of CHAPTERS.entries()) {
    const match = chapterMatches[index];

    if (match === undefined) {
      outputErrors.push(`Missing chapter ${expectedNumber}. ${expectedTitle}`);
      continue;
    }

    const actualNumber = Number(match[1]);
    const actualTitle = match[2].trim();

    if (actualNumber !== expectedNumber || actualTitle !== expectedTitle) {
      outputErrors.push(`Chapter ${index + 1} must be '## ${expectedNumber}. ${expectedTitle}', found '## ${actualNumber}. ${actualTitle}'`);
    }
  }
}

function validateHeadingDepth(content, outputErrors) {
  const deepHeading = content.match(/^#{5,}\s+.+$/m);

  if (deepHeading !== null) {
    outputErrors.push(`Heading depth must not exceed ####: ${deepHeading[0]}`);
  }
}

function validateFenceBalance(content, optionsForFence, outputErrors) {
  const lines = content.split("\n");
  let activeFence = null;

  lines.forEach((line, index) => {
    const match = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);

    if (match === null) {
      return;
    }

    const marker = match[1];
    const rest = match[2].trim();

    if (activeFence === null) {
      activeFence = {
        char: marker[0],
        length: marker.length,
        line: index + 1,
      };

      if (optionsForFence.requireLanguage && rest.length === 0) {
        outputErrors.push(`${optionsForFence.label}:${index + 1} code fence must include a language tag`);
      }

      return;
    }

    if (marker[0] === activeFence.char && marker.length >= activeFence.length && rest.length === 0) {
      activeFence = null;
    }
  });

  if (activeFence !== null) {
    outputErrors.push(`${optionsForFence.label}:${activeFence.line} has an unclosed code fence`);
  }
}

function validateTableAlignment(content, outputErrors) {
  const tables = tableBlocks(withoutFencedCode(content));

  for (const table of tables) {
    if (table.lines.length < 2 || !isAlignmentRow(table.lines[1])) {
      outputErrors.push(`Markdown table at line ${table.startLine} must include an alignment row`);
    }
  }
}

function validateInternalLinks(content, outputErrors) {
  const headingSlugs = new Set([...content.matchAll(/^#{1,4}\s+(.+)$/gm)].map((match) => slugifyHeading(match[1])));
  const links = content.matchAll(/\[[^\]]+\]\(#([^)]+)\)/g);

  for (const link of links) {
    const target = decodeURIComponent(link[1]).trim();

    if (!headingSlugs.has(target)) {
      outputErrors.push(`Broken internal link: #${target}`);
    }
  }
}

function validateRendererPurity(content, outputErrors) {
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(content)) {
    outputErrors.push("DEV_STANDARDS.md must not contain emoji or icon glyphs; renderer owns visual treatment");
  }

  if (/(^|[^\w])#[0-9a-fA-F]{3,8}\b/.test(content)) {
    outputErrors.push("DEV_STANDARDS.md must not hardcode hex colors; use token names only");
  }

  if (/\b(lucide|icon:|아이콘)\b/i.test(content)) {
    outputErrors.push("DEV_STANDARDS.md must not reference icon libraries or icon injection details");
  }
}

function validateUnsupportedClaims(content, outputErrors) {
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    if (/(coverage|커버리지|token|토큰|time|시간|loc|sloc|탐색 비용|search cost)/i.test(line)
      && /(정확히|exact|[0-9]+(\.[0-9]+)?\s*%|[0-9]+(\.[0-9]+)?\s*(tokens?|토큰|초|분))/i.test(line)
      && !/(측정값|proxy|측정 불가|출처|산식|CI|로그|실측)/i.test(line)) {
      outputErrors.push(`Metric claim at line ${index + 1} needs measured/proxy/unavailable basis: ${line.trim()}`);
    }

    for (const suppression of UNSAFE_TS_SUPPRESSIONS) {
      if (line.includes(suppression)
        && /(허용|가능|사용한다|써도|권장)/.test(line)
        && !/(금지|위반|사용하지|않는다|차단|forbidden)/i.test(line)) {
        outputErrors.push(`Unsafe TypeScript suppression appears allowed at line ${index + 1}: ${line.trim()}`);
      }
    }
  });
}

function validateGateSections(content, visibleContent, outputErrors) {
  const sections = new Map(CHAPTERS.map(([chapterNumber]) => [chapterNumber, extractChapter(content, chapterNumber)]));
  const section2 = sections.get(2) ?? "";
  const section3 = sections.get(3) ?? "";
  const section5 = sections.get(5) ?? "";
  const section6 = sections.get(6) ?? "";
  const section8 = sections.get(8) ?? "";
  const section9 = sections.get(9) ?? "";
  const section10 = sections.get(10) ?? "";
  const section11 = sections.get(11) ?? "";
  const section12 = sections.get(12) ?? "";

  if (!/```mermaid\b/.test(section2)) {
    outputErrors.push("Chapter 2 must contain at least one mermaid code block");
  }

  if (!/백엔드/.test(section3) || !/프론트엔드/.test(section3) || countMarkdownTableDataRows(section3) < 3) {
    outputErrors.push("Chapter 3 must contain at least three invariant rows with backend and frontend implementation columns");
  }

  if (countNamingTargets(section5) < 3) {
    outputErrors.push("Chapter 5 must cover at least three language/API/DB naming sections");
  }

  if (!/client|server|shared|FSD|source of truth|정본/i.test(section6) || countTables(section6) < 2) {
    outputErrors.push("Chapter 6 must include boundary and source-of-truth tables");
  }

  validateLayeringGate(section6, section8, outputErrors);

  validateRuntimeValidationGate(section6, outputErrors);

  if (!/coverage|커버리지/i.test(section8) || !/측정값|proxy|측정 불가/.test(section8)) {
    outputErrors.push("Chapter 8 must state coverage/tooling status as measured, proxy, or unavailable");
  }

  if (!/LoC|SLoC|token|토큰|search cost|탐색 비용/i.test(section8) || !/산식|범위|출처/.test(section8)) {
    outputErrors.push("Chapter 8 must include formulas, scope, and sources for quantitative metrics");
  }

  if (!/검증 명령|결과|경고|수동 QA|미검증 리스크/.test(section8)) {
    outputErrors.push("Chapter 8 must include validation command/result/warning/manual QA/unverified risk records");
  }

  if (!/파이프라인/.test(section9) || countTables(section9) < 1) {
    outputErrors.push("Chapter 9 must include a pipeline stage table");
  }

  if (!/```(text|txt|bash|plaintext)\b/.test(section10)) {
    outputErrors.push("Chapter 10 must include a language-tagged directory tree code block");
  }

  if (!/브랜치/.test(section11) || !/커밋/.test(section11) || countTables(section11) < 2) {
    outputErrors.push("Chapter 11 must include branch and commit type tables");
  }

  if (!/장애/.test(section12) || !/대응/.test(section12) || countTables(section12) < 1) {
    outputErrors.push("Chapter 12 must include an incident type and response table");
  }

  const artifactSection = extractHeadingSection(visibleContent, /아티팩트|artifact/i);
  const docsSyncSection = extractHeadingSection(visibleContent, /문서 동기화|docs sync|함께 갱신/i);

  if (artifactSection.length === 0
    || !/draft|preview|confirmed|export|public fixture|FileAsset/i.test(artifactSection)
    || countTables(artifactSection) < 1) {
    outputErrors.push("Document must include an artifact classification table");
  }

  if (docsSyncSection.length === 0 || !/(docs\/|docs sync|문서|spec|security|frontend|design)/i.test(docsSyncSection)) {
    outputErrors.push("Document must include a docs sync list for code changes");
  }

  if (!/^##\s+부록 A\s+—\s+TODO 인덱스/m.test(visibleContent)) {
    outputErrors.push("Document must include '## 부록 A — TODO 인덱스'");
  }
}

function validateLayeringGate(section6, section8, outputErrors) {
  const layeringSection = extractHeadingSection(section6, /레이어링|layering|architecture boundary|dependency direction|의존 방향|FSD|Feature-Sliced/i);
  const layeringContent = layeringSection.length > 0 ? layeringSection : section6;
  const combinedQualityContent = `${layeringContent}\n${section8}`;
  const hasNonFsdOverride = /FSD\s*(미채택|not adopted|not used|비채택)|비-FSD|non-FSD/i.test(layeringContent);
  const usesFsd = !hasNonFsdOverride;

  if (!/레이어링|layering|layer|architecture|FSD|Feature-Sliced|Clean Architecture|Hexagonal|MVC|controller|service|domain|infra|module/i.test(layeringContent)) {
    outputErrors.push("Chapter 6 must include an explicit adopted-layering section");
  }

  if (!/책임|responsibilit|역할|role/i.test(layeringContent)) {
    outputErrors.push("Layering enforcement must describe layer responsibilities");
  }

  if (!/허용 import|allowed import|허용되는 import|import 방향|dependency direction|의존 방향|허용 의존/i.test(layeringContent)) {
    outputErrors.push("Layering enforcement must specify allowed import/dependency direction");
  }

  if (!/금지 import|forbidden import|cross-layer|역방향|우회 import|금지 의존|금지 호출/i.test(layeringContent)) {
    outputErrors.push("Layering enforcement must specify forbidden imports/calls or cross-layer violations");
  }

  if (!/public API|index\.ts|barrel|공개 API|export boundary|module exports|패키지 경계/i.test(layeringContent)) {
    outputErrors.push("Layering enforcement must specify public API/export boundary rules");
  }

  if (!/예외 승인|exception|waiver|승인 기준|미검증 리스크/i.test(combinedQualityContent)) {
    outputErrors.push("Layering enforcement must include exception approval or unverified-risk handling");
  }

  if (!/eslint|boundaries|no-restricted-imports|depcruise|ArchUnit|import-linter|validate:[\w:-]+|validate script|lint|수동 QA/i.test(combinedQualityContent)) {
    outputErrors.push("Layering enforcement must include an automated or manual validation command");
  }

  if (usesFsd) {
    validateFsdGate(layeringContent, section8, outputErrors);
  }
}

function validateFsdGate(section6, section8, outputErrors) {
  const fsdSection = extractHeadingSection(section6, /FSD|Feature-Sliced|레이어 강제|경계 설계/i);
  const fsdContent = fsdSection.length > 0 ? fsdSection : section6;
  const combinedQualityContent = `${fsdContent}\n${section8}`;
  const requiredLayerPatterns = new Map([
    ["app route entry", /app\s+(route entry|router entry|route|라우트\s*엔트리)|app\/page|app\s*\/\s*page|App Router entry/i],
    ["widgets/*/ui", /widgets\/\*\/ui|widgets\/\{area\}\/ui|widgets\/[^\s`|]+\/ui/i],
    ["features/*/ui", /features\/\*\/ui|features\/\{feature\}\/ui|features\/[^\s`|]+\/ui/i],
    ["entities/*/ui", /entities\/\*\/ui|entities\/\{domain\}\/ui|entities\/[^\s`|]+\/ui/i],
    ["shared/ui", /shared\/ui/i],
    ["components/ui", /components\/ui/i],
  ]);

  if (!/FSD|Feature-Sliced/i.test(fsdContent)) {
    outputErrors.push("Chapter 6 must include an explicit FSD enforcement section");
  }

  for (const [label, pattern] of requiredLayerPatterns) {
    if (!pattern.test(fsdContent)) {
      outputErrors.push(`FSD enforcement must explicitly list ${label}`);
    }
  }

  if (countTables(fsdContent) < 1) {
    outputErrors.push("FSD enforcement must include a layer responsibility/import table");
  }

  if (!/허용 import|allowed import|허용되는 import|import 방향|dependency direction/i.test(fsdContent)) {
    outputErrors.push("FSD enforcement must specify allowed import/dependency direction");
  }

  if (!/금지 import|forbidden import|cross-layer|역방향|우회 import/i.test(fsdContent)) {
    outputErrors.push("FSD enforcement must specify forbidden imports or cross-layer violations");
  }

  if (!/public API|index\.ts|barrel|공개 API/i.test(fsdContent)) {
    outputErrors.push("FSD enforcement must specify public API/index.ts exposure rules");
  }

  if (!/600\+?\s*LOC/i.test(fsdContent)) {
    outputErrors.push("FSD enforcement must include the 600+ LOC page split threshold");
  }

  if (!/1000\+?\s*LOC|1,000\+?\s*LOC/i.test(fsdContent)) {
    outputErrors.push("FSD enforcement must include the 1,000+ LOC refactor-plan threshold");
  }

  if (!/반복.*3회|3회.*반복|repeated.*3|3.*repeated/i.test(fsdContent)) {
    outputErrors.push("FSD enforcement must include the repeated UI/class extraction threshold");
  }

  if (!/state machine|modal|renderer|상태 머신|모달|렌더러/i.test(fsdContent)) {
    outputErrors.push("FSD enforcement must mention state machine, modal, or renderer extraction triggers");
  }

  if (!/예외 승인|exception|waiver|승인 기준|미검증 리스크/i.test(combinedQualityContent)) {
    outputErrors.push("FSD enforcement must include exception approval or unverified-risk handling");
  }

  if (!/eslint|boundaries|no-restricted-imports|validate:fsd-structure|validate:dev-standards|lint|수동 QA/i.test(combinedQualityContent)) {
    outputErrors.push("FSD enforcement must include an automated or manual validation command");
  }
}

function validateRuntimeValidationGate(section6, outputErrors) {
  const runtimeSection = extractHeadingSection(section6, /typia|runtime schema|runtime validation|런타임 검증/i);
  const runtimeContent = runtimeSection.length > 0 ? runtimeSection : section6;
  const hasNonTypeScriptOverride = NON_TYPESCRIPT_OVERRIDE_PATTERN.test(runtimeContent);
  const usesTypeScriptTypia = usesDefaultTypeScriptTypiaProfile(runtimeContent);
  const generalValidationPatterns = new Map([
    ["runtime validation boundary", /runtime validation|런타임 검증|validator|validation|검증/i],
    ["external input boundary", /외부 입력|external input|request|payload|body|message|callback|webhook|file upload|parser|IPC|queue|event/i],
    ["error mapping", /error status|상태 코드|400|401|403|404|422|500|에러 매핑|오류 매핑|field|path|expected|validation error/i],
  ]);

  for (const [label, pattern] of generalValidationPatterns) {
    if (!pattern.test(runtimeContent)) {
      outputErrors.push(`Chapter 6 runtime validation must include ${label}`);
    }
  }

  if (hasNonTypeScriptOverride) {
    validateNonTypeScriptOverride(runtimeContent, "Chapter 6 runtime validation", outputErrors);
  }

  if (!usesTypeScriptTypia && !hasNonTypeScriptOverride) {
    outputErrors.push("Chapter 6 runtime validation must require TypeScript typia runtime schema by default or explicitly document a non-TypeScript override");
  }

  if (!usesTypeScriptTypia) {
    return;
  }

  const requiredPatterns = new Map([
    ["typia runtime schema", /\btypia\b/i],
    ["mandatory requirement", /필수|강제|required|must|반드시/i],
    ["TypeScript interface/type source of truth", /TypeScript\s+(interface\/type|type\/interface|interface|type)[^\n]*(source of truth|정본)|((source of truth|정본)[^\n]*TypeScript\s+(interface\/type|type\/interface|interface|type))/i],
    ["unknown input boundary", /\bunknown\b/i],
    ["strict validator or excess-property rejection", /strict\s+validator|strict\s+typia|초과\s*속성.*거부|excess\s+propert/i],
    ["server action boundary", /server action|서버 액션/i],
    ["API route boundary", /API\s+route|route handler|API\s*\/|\/api\//i],
    ["file upload or parser boundary", /file upload|파일 업로드|parser|파서/i],
    ["IPC boundary", /\bIPC\b/i],
    ["external callback boundary", /callback|외부 인증/i],
    ["error status mapping", /error status|상태 코드|400|401|403|404|422|500|에러 매핑|오류 매핑/i],
  ]);

  for (const [label, pattern] of requiredPatterns) {
    if (!pattern.test(runtimeContent)) {
      outputErrors.push(`Chapter 6 runtime validation must include ${label}`);
    }
  }
}

function extractHeadingSection(content, headingPattern) {
  const lines = content.split("\n");
  const startIndex = lines.findIndex((line) => /^#{2,4}\s+/.test(line) && headingPattern.test(line));

  if (startIndex < 0) {
    return "";
  }

  const startDepth = headingDepth(lines[startIndex]);
  const endIndex = lines.findIndex((line, index) => index > startIndex && headingDepth(line) > 0 && headingDepth(line) <= startDepth);

  return lines.slice(startIndex, endIndex < 0 ? lines.length : endIndex).join("\n");
}

function headingDepth(line) {
  const match = line.match(/^(#{1,6})\s+/);
  return match === null ? 0 : match[1].length;
}

function withoutFencedCode(content) {
  const lines = content.split("\n");
  let activeFence = null;

  return lines.map((line) => {
    const match = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);

    if (match !== null) {
      const marker = match[1];
      const rest = match[2].trim();

      if (activeFence === null) {
        activeFence = {
          char: marker[0],
          length: marker.length,
        };
        return "";
      }

      if (marker[0] === activeFence.char && marker.length >= activeFence.length && rest.length === 0) {
        activeFence = null;
        return "";
      }
    }

    if (activeFence !== null) {
      return "";
    }

    return line;
  }).join("\n");
}

function tableBlocks(content) {
  const lines = content.split("\n");
  const blocks = [];
  let current = [];
  let startLine = 0;

  lines.forEach((line, index) => {
    if (isTableLine(line)) {
      if (current.length === 0) {
        startLine = index + 1;
      }

      current.push(line);
      return;
    }

    if (current.length > 0) {
      blocks.push({ lines: current, startLine });
      current = [];
    }
  });

  if (current.length > 0) {
    blocks.push({ lines: current, startLine });
  }

  return blocks;
}

function isTableLine(line) {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|");
}

function isAlignmentRow(line) {
  return /^\s*\|\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|\s*$/.test(line);
}

function countTables(content) {
  return tableBlocks(withoutFencedCode(content)).filter((table) => table.lines.length >= 2 && isAlignmentRow(table.lines[1])).length;
}

function countMarkdownTableDataRows(content) {
  return tableBlocks(withoutFencedCode(content)).reduce((total, table) => {
    if (table.lines.length < 3 || !isAlignmentRow(table.lines[1])) {
      return total;
    }

    return total + table.lines.length - 2;
  }, 0);
}

function countNamingTargets(section) {
  const targets = [
    /TypeScript|JavaScript|TS|JS/i,
    /Java|Kotlin|Python|Go|Ruby/i,
    /DB|SQL|데이터베이스|테이블|컬럼/i,
    /API|REST|GraphQL|엔드포인트/i,
    /프론트엔드|frontend/i,
    /백엔드|backend/i,
  ];

  return targets.filter((target) => target.test(section)).length;
}

function extractChapter(content, chapterNumber) {
  const lines = content.split("\n");
  const startIndex = lines.findIndex((line) => new RegExp(`^##\\s+${chapterNumber}\\.\\s+`).test(line));

  if (startIndex < 0) {
    return "";
  }

  const endIndex = lines.findIndex((line, index) => index > startIndex && /^##\s+\d+\.\s+/.test(line));
  return lines.slice(startIndex, endIndex < 0 ? lines.length : endIndex).join("\n");
}

function slugifyHeading(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function assertEnumIncludes(actualEnum, expectedValues, label, outputErrors) {
  if (!Array.isArray(actualEnum)) {
    outputErrors.push(`JSON Schema must define ${label}`);
    return;
  }

  for (const expectedValue of expectedValues) {
    if (!actualEnum.includes(expectedValue)) {
      outputErrors.push(`${label} is missing value: ${expectedValue}`);
    }
  }
}

function readJson(filePath, outputErrors) {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    outputErrors.push(`${filePath} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

function stringifySlotValue(value) {
  if (typeof value === "string") {
    return value;
  }

  if (value === undefined) {
    return "";
  }

  return JSON.stringify(value);
}

function resolveProjectPath(inputPath) {
  return path.isAbsolute(inputPath) ? inputPath : path.resolve(process.cwd(), inputPath);
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
