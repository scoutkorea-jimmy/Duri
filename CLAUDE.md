# 두리손잡고 — 작업 진입점 (CLAUDE.md)

이 저장소의 **유일한 루트 문서**입니다. 규칙 본문은 여기에 쓰지 않습니다.
**모든 개발 규칙(작업 절차·구조·디자인·검증)은 [rules/](rules/) 폴더에 있습니다.**

---

## ⛔ 이 저장소의 제1규칙 — HANDOFF 먼저, 그다음 rules/

지시를 받으면 **조사·수정보다 먼저** 아래 순서를 지킵니다. 예외 없습니다.

> **① [rules/HANDOFF.md](rules/HANDOFF.md)를 연다.** 진행 중·보류된 작업이 있는지 확인하고,
>   **받은 지시를 코드에 손대기 전에 HANDOFF에 항목으로 등록**한다.
> **② [rules/README.md](rules/README.md)를 읽고**, 거기서 지정한 규칙 파일을 열어 확인한 뒤 작업을 시작한다.

"간단한 수정이니까", "이미 알고 있으니까"는 건너뛸 사유가 되지 않습니다.
규칙과 진행 상황은 계속 갱신되므로 **기억이 아니라 파일을 읽어야** 합니다.

작업이 끝나면 **[rules/WORKLOG.md](rules/WORKLOG.md)에 결과와 성공/실패 사유를 기록**하고
HANDOFF 항목을 종료로 옮깁니다. 기록하지 않은 작업은 완료된 것으로 보지 않습니다.

---

## 규칙 파일 지도

| 파일 | 언제 읽는가 |
|---|---|
| [rules/HANDOFF.md](rules/HANDOFF.md) | **①  무조건 가장 먼저.** 진행 중 작업 확인 + 받은 지시 등록 |
| [rules/README.md](rules/README.md) | **② 항상.** 규칙 인덱스 |
| [rules/00-core.md](rules/00-core.md) | **항상.** 절대 규칙 · 표준 작업 흐름 |
| [rules/10-structure.md](rules/10-structure.md) | 코드·파일을 건드릴 때 |
| [rules/20-design.md](rules/20-design.md) | 화면에 보이는 것을 바꿀 때 |
| [rules/30-content.md](rules/30-content.md) | 메뉴·글·사진·로고를 추가할 때 |
| [rules/40-verify.md](rules/40-verify.md) | 커밋 전 검증 · 배포 확인 |
| [rules/50-roadmap.md](rules/50-roadmap.md) | 무엇을 다음에 할지 정할 때 |
| [rules/WORKLOG.md](rules/WORKLOG.md) | 작업 시작 시(과거 이력 확인) · **종료 시(결과·사유 기록)** |

> **HANDOFF = 지금 진행 중인 것 / WORKLOG = 끝난 것.** 역할을 섞지 마세요.

---

## 30초 요약 (rules/ 를 대신하지 않습니다)

- **사회적협동조합 두리손잡고** 공식 홈페이지. 순수 HTML/CSS/JS 정적 사이트, 빌드 도구·서버 없음.
- 라이브: https://scoutkorea-jimmy.github.io/Duri/ · 저장소: `scoutkorea-jimmy/Duri` (`main`)
- 사이트 루트 폴더: `duri-website/` (이 폴더가 곧 배포 산출물)
- **두 갈래 사이트**: 조합(그린) / 직업재활센터(오션 블루). 첫 방문 시 전체화면 게이트로 선택.
- 헤더·푸터·네비·인증·폼은 전부 `duri-website/assets/site.js`가 주입. HTML에 직접 쓰지 말 것.
- 작업 후 **별도 지시 없이** `main` 커밋·푸시 → 배포 성공 확인까지 완료.

---
© 사회적협동조합 두리손잡고
