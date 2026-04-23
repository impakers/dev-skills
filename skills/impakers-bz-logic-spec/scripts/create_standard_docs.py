#!/usr/bin/env python3
"""Create an IMPAKERS/Harness-friendly project spec docs skeleton.

This script is intentionally dependency-free so a Programming agent can run it
in a fresh project without installing packages.
"""

from __future__ import annotations

import argparse
from datetime import date
from pathlib import Path


DIRS = [
    "docs/raw-specs",
    "docs/references",
    "docs/product-specs",
    "docs/design-docs",
    "docs/generated",
    "docs/exec-plans/active",
    "docs/exec-plans/completed",
    "docs/test-plans",
]


def write_file(path: Path, content: str, force: bool) -> bool:
    if path.exists() and not force:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return True


def render_templates(project_name: str, client_name: str, vendor_name: str) -> dict[str, str]:
    today = date.today().isoformat()
    return {
        "README.md": f"""# {project_name}

클라이언트: {client_name}
개발사: {vendor_name}

## 문서 시작점

- [AGENTS.md](AGENTS.md): 에이전트 라우팅 및 프로젝트 불변 규칙
- [ARCHITECTURE.md](ARCHITECTURE.md): 시스템 구조
- [docs/PRODUCT_SENSE.md](docs/PRODUCT_SENSE.md): 도메인 맥락
- [docs/product-specs/](docs/product-specs/): 기능별 제품 스펙
- [docs/design-docs/](docs/design-docs/): 설계 결정 및 비즈니스 규칙
""",
        "AGENTS.md": f"""# AGENTS.md - {project_name}

## Project Identity

**{project_name}**는 **{client_name}**를 위한 임패커스 개발 프로젝트입니다.

## Documentation Map

| Path | Purpose |
|---|---|
| [docs/PRODUCT_SENSE.md](docs/PRODUCT_SENSE.md) | 도메인 맥락, 페르소나, 안티패턴 |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 시스템 구조와 데이터 흐름 |
| [docs/product-specs/](docs/product-specs/) | 기능별 제품 스펙 |
| [docs/design-docs/](docs/design-docs/) | 설계 결정, ADR, 비즈니스 규칙 |
| [docs/raw-specs/](docs/raw-specs/) | 클라이언트 원본 요구사항 |
| [docs/references/](docs/references/) | API/ERP/샘플/템플릿/레거시 참조 |
| [docs/generated/](docs/generated/) | ERD/SQL/codegen 생성 산출물 |
| [docs/exec-plans/](docs/exec-plans/) | 실행 계획과 완료 기록 |

## Raw Specs Naming Rule

`docs/raw-specs/` 원본 파일명은 `yy-mm-dd-[purpose]-raw-file.{{ext}}` 형식을 따른다.

예: `26-04-03-kickoff-meeting-raw-file.md`, `26-04-08-feature-spec-raw-file.xlsx`

## Core Invariants

- TODO: 클라이언트 요구에서 절대 어기면 안 되는 규칙을 적는다.
- TODO: 권한/보안/데이터 소유권 규칙을 적는다.
- TODO: 비즈니스 검증 규칙을 적는다.

## 작업 원칙 (필수)

### 자기 개선 루프 (Self-Improvement Loop)

- 비즈니스 로직을 변경한 뒤에는 항상 `docs/**/*.md` 하위의 관련 스펙 문서를 같은 변경 패턴으로 갱신한다.
- 같은 실수가 반복되지 않도록 자신에게 적용할 규칙을 작성한다.
- 실수율이 줄어들 때까지 해당 교훈을 엄격하게 반복 개선한다.
- 관련 프로젝트 작업을 시작할 때 이전 교훈과 작업 규칙을 먼저 검토한다.

### 완료 전 검증 (Verification Before Done)

- 작동을 증명하지 못한 작업은 완료로 표시하지 않는다.
- 필요한 경우 `main` 기준 동작과 변경 후 동작의 차이를 비교한다.
- 스스로 "스태프 엔지니어가 이 변경을 승인할까?"를 질문한다.
- 테스트를 실행하고, 로그를 확인하며, 정확성을 입증한다.

### 균형 잡힌 우아함 요구 (Demand Elegance)

- 단순하지 않은 변경에서는 잠시 멈추고 "더 우아한 방법이 있는가?"를 검토한다.
- 수정이 임시방편처럼 느껴지면, 지금 아는 모든 것을 기준으로 더 우아한 해법을 구현한다.
- 단순하고 명백한 수정에는 이 기준을 과하게 적용하지 않는다. 불필요하게 과설계하지 않는다.

### 자율 버그 수정 (Autonomous Bug Fixing)

- 버그 리포트를 받으면 사용자에게 세부 지시를 요구하지 말고 직접 원인을 찾아 수정한다.
- 로그, 오류, 실패 테스트를 근거로 문제를 특정한 뒤 해결한다.
- 사용자의 추가 컨텍스트 전환 없이 끝까지 처리한다.
- 실패한 CI 테스트는 별도 지시가 없어도 원인을 찾아 고친다.

## 핵심 원칙 (Core Principles)

- **Simplicity First**: 모든 변경은 가능한 한 단순하게 만들고, 영향 범위를 최소화한다.
- **No Laziness**: 근본 원인을 찾는다. 임시방편을 남기지 않는다. 시니어 개발자 기준으로 마무리한다.


## Agent Routing

| Task | Primary Agent | Required Docs |
|---|---|---|
| 기능 구현 | Programming agent | `docs/product-specs/*.md`, 관련 `docs/design-docs/*.md` |
| DB/API 변경 | Backend agent | `ARCHITECTURE.md`, `docs/generated/`, 관련 spec |
| UI 구현 | Frontend agent | `docs/DESIGN.md`, `docs/FRONTEND.md`, 관련 spec |
| QA | QA agent | `docs/test-plans/`, 수용 기준 |
| 계획 변경 | Planning agent | `docs/PLANS.md`, `docs/exec-plans/` |
""",
        "CLAUDE.md": f"""# CLAUDE.md

## Project

- 프로젝트: {project_name}
- 클라이언트: {client_name}
- 개발사: {vendor_name}

## Working Rules

- 구현 전 관련 `docs/product-specs/*.md`와 `docs/design-docs/*.md`를 먼저 읽는다.
- 클라이언트 원본은 `docs/raw-specs/` 또는 `docs/references/`에 보존한다.
- `docs/raw-specs/` 파일명은 `yy-mm-dd-[purpose]-raw-file.{{ext}}` 규칙을 따른다.
- 코드 변경으로 스펙이 바뀌면 관련 문서도 같이 갱신한다.

## 작업 원칙 (필수)

### 자기 개선 루프 (Self-Improvement Loop)

- 비즈니스 로직을 변경한 뒤에는 항상 `docs/**/*.md` 하위의 관련 스펙 문서를 같은 변경 패턴으로 갱신한다.
- 같은 실수가 반복되지 않도록 자신에게 적용할 규칙을 작성한다.
- 실수율이 줄어들 때까지 해당 교훈을 엄격하게 반복 개선한다.
- 관련 프로젝트 작업을 시작할 때 이전 교훈과 작업 규칙을 먼저 검토한다.

### 완료 전 검증 (Verification Before Done)

- 작동을 증명하지 못한 작업은 완료로 표시하지 않는다.
- 필요한 경우 `main` 기준 동작과 변경 후 동작의 차이를 비교한다.
- 스스로 "스태프 엔지니어가 이 변경을 승인할까?"를 질문한다.
- 테스트를 실행하고, 로그를 확인하며, 정확성을 입증한다.

### 균형 잡힌 우아함 요구 (Demand Elegance)

- 단순하지 않은 변경에서는 잠시 멈추고 "더 우아한 방법이 있는가?"를 검토한다.
- 수정이 임시방편처럼 느껴지면, 지금 아는 모든 것을 기준으로 더 우아한 해법을 구현한다.
- 단순하고 명백한 수정에는 이 기준을 과하게 적용하지 않는다. 불필요하게 과설계하지 않는다.

### 자율 버그 수정 (Autonomous Bug Fixing)

- 버그 리포트를 받으면 사용자에게 세부 지시를 요구하지 말고 직접 원인을 찾아 수정한다.
- 로그, 오류, 실패 테스트를 근거로 문제를 특정한 뒤 해결한다.
- 사용자의 추가 컨텍스트 전환 없이 끝까지 처리한다.
- 실패한 CI 테스트는 별도 지시가 없어도 원인을 찾아 고친다.

## 핵심 원칙 (Core Principles)

- **Simplicity First**: 모든 변경은 가능한 한 단순하게 만들고, 영향 범위를 최소화한다.
- **No Laziness**: 근본 원인을 찾는다. 임시방편을 남기지 않는다. 시니어 개발자 기준으로 마무리한다.

## Commands

```bash
# TODO: 프로젝트 실행/테스트 명령 작성
```
""",
        "ARCHITECTURE.md": f"""# Architecture - {project_name}

## Overview

TODO: 시스템 경계, 주요 모듈, 외부 연동을 요약한다.

## Data Flow

```mermaid
flowchart LR
    User[User] --> App[Application]
    App --> DB[(Database)]
    App --> External[External Systems]
```

## Constraints

- TODO: 데이터 흐름 제약
- TODO: 인증/권한 제약
- TODO: 외부 연동 제약

## Source Documents

- `docs/raw-specs/yy-mm-dd-[purpose]-raw-file.{{ext}}`
""",
        "docs/PRODUCT_SENSE.md": f"""# PRODUCT_SENSE.md - {project_name}

## Client Context

- 클라이언트: {client_name}
- 작성일: {today}

## Users

| Persona | Needs | Pain Points |
|---|---|---|
| TODO | TODO | TODO |

## Problem

TODO: 현재 클라이언트 업무 문제를 적는다.

## Anti-patterns

- TODO: 만들면 안 되는 방향을 적는다.

## Success Metrics

| Metric | Target |
|---|---|
| TODO | TODO |
""",
        "docs/PLANS.md": f"""# PLANS.md - {project_name}

## Milestones

| Phase | Goal | Owner | Status |
|---|---|---|---|
| 1 | 요구사항 정리 | {vendor_name} | Draft |

## Risks

- TODO: 일정/범위/연동 리스크를 적는다.
""",
        "docs/raw-specs/README.md": """# raw-specs

클라이언트가 준 원본 요구사항을 보관한다. 이 폴더의 파일은 정규화된 스펙이 아니라 증거 자료다.

## Naming Rule

모든 파일명 앞부분은 아래 형식을 따른다.

```text
yy-mm-dd-[purpose]-raw-file.{ext}
```

예:

```text
26-04-03-kickoff-meeting-raw-file.md
26-04-08-feature-spec-raw-file.xlsx
26-04-17-dev-standards-raw-file.md
```
""",
        "docs/references/index.md": """# References Index

API/ERP 문서, 출력 템플릿, 샘플 데이터, 레거시 코드, 테스트 샘플을 정리한다.

| File | Type | Description | Used By |
|---|---|---|---|
| TODO | TODO | TODO | TODO |
""",
        "docs/product-specs/index.md": """# Product Specs Index

| Spec | Priority | Status | Description |
|---|---|---|---|
| [_feature-template.md](_feature-template.md) | - | Template | 기능 스펙 템플릿 |

## Spec Format

각 기능 스펙은 개요, 사용자 플로우, 데이터 모델, 비즈니스 규칙, 수용 기준, 출처 문서를 포함한다.
""",
        "docs/product-specs/_feature-template.md": """# Feature Spec: <기능명>

## 개요

TODO: 이 기능이 해결하는 클라이언트 업무 문제와 사용자 가치를 적는다.

## 사용자 플로우

1. TODO

## 데이터 모델

| 엔티티/테이블 | 역할 | 주요 필드 |
|---|---|---|
| TODO | TODO | TODO |

## 비즈니스 규칙

- TODO

## 수용 기준

- [ ] TODO

## 출처 문서

- `docs/raw-specs/yy-mm-dd-[purpose]-raw-file.{ext}` §TODO
""",
        "docs/design-docs/index.md": """# Design Docs Index

| Doc | Status | Description |
|---|---|---|
| [_adr-template.md](_adr-template.md) | Template | ADR 템플릿 |

## When To Add

- source of truth 결정
- 되돌리기 어려운 아키텍처 결정
- 여러 기능에 영향을 주는 비즈니스 규칙
- 레거시 로직/출력 포맷/파이프라인 해석
""",
        "docs/design-docs/_adr-template.md": """# ADR-000: <결정명>

## Status

Draft

## Context

TODO: 어떤 클라이언트 요구/제약 때문에 결정이 필요한지 적는다.

## Decision

TODO: 결정한 내용을 적는다.

## Consequences

- TODO

## Source Documents

- `docs/raw-specs/yy-mm-dd-[purpose]-raw-file.{ext}` §TODO
""",
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Create IMPAKERS standard project docs skeleton.")
    parser.add_argument("--target", default=".", help="Target project directory")
    parser.add_argument("--project-name", default="프로젝트명", help="Project display name")
    parser.add_argument("--client-name", default="클라이언트명", help="Client display name")
    parser.add_argument("--vendor-name", default="임패커스 (IMPAKERS)", help="Vendor display name")
    parser.add_argument("--force", action="store_true", help="Overwrite existing files")
    args = parser.parse_args()

    target = Path(args.target).resolve()
    target.mkdir(parents=True, exist_ok=True)

    for rel in DIRS:
        (target / rel).mkdir(parents=True, exist_ok=True)

    templates = render_templates(args.project_name, args.client_name, args.vendor_name)
    written = []
    skipped = []
    for rel, content in templates.items():
        if write_file(target / rel, content, args.force):
            written.append(rel)
        else:
            skipped.append(rel)

    for rel in [
        "docs/generated/.gitkeep",
        "docs/exec-plans/active/.gitkeep",
        "docs/exec-plans/completed/.gitkeep",
        "docs/test-plans/.gitkeep",
    ]:
        if write_file(target / rel, "\n", args.force):
            written.append(rel)
        else:
            skipped.append(rel)

    print(f"Created docs skeleton at: {target}")
    print(f"Written: {len(written)} files")
    if skipped:
        print(f"Skipped existing files: {len(skipped)}")
        print("Use --force to overwrite.")


if __name__ == "__main__":
    main()
