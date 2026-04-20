#!/usr/bin/env node
/**
 * dev-skills — Claude Code skill installer for impakers
 *
 * Usage:
 *   npx -y github:impakers/dev-skills add <skill>       ~/.claude/skills/<skill>/ 에 설치
 *   npx -y github:impakers/dev-skills add               (기본 스킬이 하나뿐이면 자동 선택)
 *   npx -y github:impakers/dev-skills remove <skill>    제거
 *   npx -y github:impakers/dev-skills list              내장/설치된 스킬 목록
 *
 * Flags:
 *   --project   현재 CWD 의 .claude/skills/ 에 설치 (default: ~/.claude/skills/)
 *   --symlink   복사 대신 심볼릭 링크 (npx 에선 임시 경로이므로 비권장, 로컬 체크아웃용)
 *   --force     기존 설치를 프롬프트 없이 덮어쓰기
 *   --silent    출력 최소화
 *
 * 스킬 이름 매칭:
 *   완전 일치 우선 → 그 다음 접두어 매칭 (예: "components-rules" → "impakers-components-rules")
 */

import { mkdirSync, rmSync, cpSync, symlinkSync, existsSync, lstatSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PKG_ROOT = resolve(__dirname, '..');
const SKILLS_DIR = join(PKG_ROOT, 'skills');

const rawArgs = process.argv.slice(2);
const flags = new Set(rawArgs.filter((a) => a.startsWith('--')));
const positional = rawArgs.filter((a) => !a.startsWith('--'));

const cmd = (positional[0] || 'help').toLowerCase();
const requestedSkill = positional[1];

const isSilent = flags.has('--silent');
const isProject = flags.has('--project');
const useSymlink = flags.has('--symlink');
const isForce = flags.has('--force');

const log = (...args) => { if (!isSilent) console.log(...args); };
const err = (...args) => console.error(...args);

function listAvailableSkills() {
  if (!existsSync(SKILLS_DIR)) return [];
  return readdirSync(SKILLS_DIR)
    .filter((name) => {
      try { return statSync(join(SKILLS_DIR, name)).isDirectory(); } catch { return false; }
    })
    .filter((name) => existsSync(join(SKILLS_DIR, name, 'SKILL.md')));
}

function resolveSkill(name) {
  const available = listAvailableSkills();
  if (!name) {
    if (available.length === 1) return available[0];
    err(`❌ 스킬 이름을 지정하세요. 사용 가능:`);
    for (const s of available) err(`   - ${s}`);
    process.exit(2);
  }
  if (available.includes(name)) return name;
  // 접두어 매칭: "components-rules" → "impakers-components-rules"
  const match = available.find((s) => s === `impakers-${name}` || s.endsWith(`-${name}`));
  if (match) return match;
  err(`❌ 스킬을 찾을 수 없습니다: ${name}`);
  err(`   사용 가능:`);
  for (const s of available) err(`   - ${s}`);
  process.exit(2);
}

function targetDirFor(skillName) {
  return isProject
    ? join(process.cwd(), '.claude', 'skills', skillName)
    : join(homedir(), '.claude', 'skills', skillName);
}

function existsAsDirOrLink(p) {
  try { lstatSync(p); return true; } catch { return false; }
}

function installSkill(skillName) {
  const src = join(SKILLS_DIR, skillName);
  const dst = targetDirFor(skillName);

  mkdirSync(dirname(dst), { recursive: true });

  if (existsAsDirOrLink(dst)) {
    if (!isForce) {
      err(`⚠️  이미 존재: ${dst}`);
      err(`    --force 플래그로 덮어쓸 수 있습니다.`);
      process.exit(1);
    }
    rmSync(dst, { recursive: true, force: true });
  }

  if (useSymlink) {
    symlinkSync(src, dst, 'dir');
    log(`✅ Linked: ${dst} → ${src}`);
  } else {
    cpSync(src, dst, { recursive: true });
    log(`✅ Installed: ${dst}`);
  }

  log('');
  log('다음 단계:');
  log('  1. Claude Code 를 재시작하세요 (스킬 목록 재스캔).');
  log('  2. 관련 파일 편집 시 자동 주입 여부 확인.');
  log(`  3. 업데이트: npx -y github:impakers/dev-skills add ${skillName} --force`);
}

function uninstallSkill(skillName) {
  const dst = targetDirFor(skillName);
  if (!existsAsDirOrLink(dst)) {
    log(`ℹ️  설치되어 있지 않음: ${dst}`);
    return;
  }
  rmSync(dst, { recursive: true, force: true });
  log(`✅ Uninstalled: ${dst}`);
}

function listSkills() {
  const available = listAvailableSkills();
  console.log('[Available in package]');
  for (const s of available) console.log(`  - ${s}`);
  console.log('');
  const userDir = join(homedir(), '.claude', 'skills');
  const projectDir = join(process.cwd(), '.claude', 'skills');
  for (const [label, dir] of [['user', userDir], ['project', projectDir]]) {
    if (!existsSync(dir)) continue;
    const entries = readdirSync(dir).filter((d) => existsSync(join(dir, d, 'SKILL.md')));
    if (entries.length === 0) continue;
    console.log(`[Installed · ${label}] ${dir}`);
    for (const e of entries) console.log(`  - ${e}`);
  }
}

function printHelp() {
  console.log('dev-skills — impakers Claude Code skill installer');
  console.log('');
  console.log('Commands:');
  console.log('  add <skill>       스킬 설치 (~/.claude/skills/<skill>/)');
  console.log('  remove <skill>    스킬 제거');
  console.log('  list              내장/설치된 스킬 목록');
  console.log('');
  console.log('Flags:');
  console.log('  --project   현재 프로젝트(.claude/skills/)에 설치');
  console.log('  --symlink   복사 대신 심볼릭 링크');
  console.log('  --force     덮어쓰기');
  console.log('  --silent    출력 최소화');
  console.log('');
  console.log('Examples:');
  console.log('  npx -y github:impakers/dev-skills add impakers-components-rules');
  console.log('  npx -y github:impakers/dev-skills add components-rules  # 접두어 생략 가능');
  console.log('  npx -y github:impakers/dev-skills list');
}

switch (cmd) {
  case 'add':
  case 'install':
  case 'i':
    installSkill(resolveSkill(requestedSkill));
    break;
  case 'remove':
  case 'uninstall':
  case 'rm':
    uninstallSkill(resolveSkill(requestedSkill));
    break;
  case 'list':
  case 'ls':
    listSkills();
    break;
  case 'help':
  case '--help':
  case '-h':
    printHelp();
    break;
  default:
    err(`Unknown command: ${cmd}`);
    printHelp();
    process.exit(2);
}
