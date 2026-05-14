#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const REQUIRED_FILES = [
  "docs/design-docs/adr-001-typia-runtime-validation.md",
  "docs/design-docs/typescript-coding-guidelines.md",
  "docs/design-docs/data-model.md",
  "docs/design-docs/document-processing-pipeline.md",
  "docs/design-docs/dev-standards-validation.md",
  "scripts/dev-standards.contract.example.json",
  "scripts/validate-dev-standards.mjs",
  "package.json",
];

const REQUIRED_MARKERS = new Map([
  ["docs/design-docs/adr-001-typia-runtime-validation.md", [
    /기본 profile|기본값|Next\.js|TypeScript/,
    /typia를 필수로 사용한다/,
    /typia runtime schema validator는 선택 사항이 아니며/,
    /strict typia validator/,
    /validator 오류의 path, expected, value 요약은 로그에 남기고, 사용자 응답은 필드 단위 오류로 변환한다/,
    /외부 입력 경계의 typia runtime schema 필수 검증을 대체할 수 없다/,
  ]],
  ["docs/design-docs/typescript-coding-guidelines.md", [
    /기본 profile|Next\.js \+ TypeScript|TypeScript를 기본 구현 언어/,
    /외부 입력은 반드시 `unknown`으로 받고/,
    /typia runtime schema validator로 좁힌다/,
    /타입 가드는 typia validator를 대체할 수 없고/,
  ]],
  ["docs/design-docs/data-model.md", [
    /기본 profile|Next\.js \+ TypeScript|TypeScript type/i,
    /typia runtime schema validator를 생성해 필수 수행한다/,
    /필수 runtime schema validator/,
    /strict typia validator/,
  ]],
  ["docs/design-docs/document-processing-pipeline.md", [
    /기본 profile|Next\.js \+ TypeScript|TypeScript `type`\/`interface`/,
    /typia runtime schema validator를 필수 생성/,
    /모든 API\/IPC payload는 TypeScript type 기반 typia runtime schema validator/,
  ]],
  ["docs/design-docs/dev-standards-validation.md", [
    /Next\.js \+ TypeScript \+ FSD \+ typia/,
    /typia 런타임 스키마 강제/,
    /mandatory typia runtime schema/,
    /strict validator 초과 속성 거부/,
    /error status mapping/,
  ]],
  ["scripts/dev-standards.contract.example.json", [
    /Next\.js \+ TypeScript \+ FSD \+ typia/,
    /mandatory typia runtime schema validator/,
    /strict typia validator/,
    /external unknown input boundary/,
    /error status responses/,
  ]],
  ["scripts/validate-dev-standards.mjs", [
    /Next\.js \+ TypeScript \+ FSD/,
    /non-TypeScript override/,
    /validateRuntimeValidationSlot/,
    /validateRuntimeValidationGate/,
    /typia runtime schema/,
    /strict typia validator/,
    /error status mapping/,
  ]],
  ["package.json", [
    /"typia"/,
    /"validate:typia-runtime-policy"/,
  ]],
]);

const FORBIDDEN_PATTERNS = new Map([
  ["docs/design-docs/adr-001-typia-runtime-validation.md", [
    /typia[^\n]{0,80}(필요하면|필요 시|선택 사항이다|선택적으로)/,
    /외부 입력[^\n]{0,80}타입 가드[^\n]{0,80}(대체한다|대체 가능)/,
  ]],
  ["docs/design-docs/typescript-coding-guidelines.md", [
    /외부 입력[^\n]{0,80}(typia validator 또는 타입 가드|validator\/guard)/,
    /typia[^\n]{0,80}(필요하면|필요 시|선택)/,
  ]],
  ["docs/design-docs/document-processing-pipeline.md", [
    /JSON Schema[^\n]{0,120}필요 시/,
    /typia 기반 validator 또는 생성된 runtime validator/,
  ]],
]);

const errors = [];

for (const relativePath of REQUIRED_FILES) {
  const absolutePath = resolveProjectPath(relativePath);

  if (!existsSync(absolutePath)) {
    errors.push(`Required file is missing: ${relativePath}`);
    continue;
  }

  const content = readFileSync(absolutePath, "utf8");
  const requiredMarkers = REQUIRED_MARKERS.get(relativePath) ?? [];

  for (const marker of requiredMarkers) {
    if (!marker.test(content)) {
      errors.push(`${relativePath} is missing required typia runtime policy marker: ${marker.source}`);
    }
  }

  const forbiddenPatterns = FORBIDDEN_PATTERNS.get(relativePath) ?? [];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) {
      errors.push(`${relativePath} contains forbidden optional typia wording: ${pattern.source}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`typia runtime policy validation failed with ${errors.length} error(s):`);

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exitCode = 1;
} else {
  console.log("typia runtime policy validation passed");
}

function resolveProjectPath(relativePath) {
  return path.resolve(process.cwd(), relativePath);
}
