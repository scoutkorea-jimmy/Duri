# 00 · 절대 규칙과 작업 흐름

> 이 파일은 **모든 작업에서 예외 없이** 읽습니다. 인덱스는 [README.md](README.md).

---

## 1. 절대 규칙 (어기면 화면·배포가 깨집니다)

1. **빌드 도구 없음.** 순수 HTML/CSS/JS 정적 사이트. npm 빌드·번들러·프레임워크 도입 금지.
2. **서버·DB 없음.** GitHub Pages(정적 호스팅)에 배포. 로그인·게시글은 **브라우저 localStorage** 기반.
3. **헤더/푸터/네비/상단 전환 바를 HTML에 직접 넣지 말 것.** 전부 [duri-website/assets/site.js](../duri-website/assets/site.js)가 주입합니다. 메뉴 변경은 `site.js`의 `NAV` 배열만 수정.
4. **디자인은 조합=leaf 그린 팔레트 + split 히어로로 고정.** 과거 "디자인 옵션" 토글은 제거됨 — 되살리지 말 것. 직업재활센터는 `data-site="rehab"` 토큰 오버라이드로만 색을 바꿉니다([20-design.md](20-design.md) 참조).
5. **경로는 모두 상대경로**(`href="about.html"`, `href="assets/..."`). GitHub Pages가 `/Duri/` 하위로 서빙하므로 `/`로 시작하는 절대경로는 깨집니다.
6. **커밋 전 검증 필수.** [40-verify.md](40-verify.md)의 절차를 거친 뒤에만 푸시합니다.

---

## 2. 표준 작업 흐름 (사용자 요구 — 매번 자동)

```
① rules/HANDOFF.md 열기 → 진행 중·보류 확인 + 받은 지시를 항목으로 등록   ← 코드에 손대기 전
② rules/README.md 확인 → 해당 규칙 파일 읽기
③ rules/WORKLOG.md 에서 과거 동일·유사 지시 확인
④ 작업 (진행 상황은 HANDOFF 에 계속 갱신)
⑤ rules/40-verify.md 절차로 검증
⑥ rules/WORKLOG.md 에 결과 + 성공/실패 사유 기록
⑦ rules/HANDOFF.md 항목을 "최근 종료" 로 이동
⑧ main 커밋 · 푸시
⑨ 배포 성공(gh run list)과 라이브 URL 반영 확인
```

**①은 조사·수정보다 먼저입니다.** 지시를 받았는데 HANDOFF에 아무것도 없는 상태로 코드를 열지 마세요.
**⑤~⑨는 별도 지시가 없어도 항상 수행합니다.** `main` 푸시 → GitHub Actions가 자동 배포.

---

## 3. 사이트 개요

- **사이트**: 사회적협동조합 두리손잡고 공식 홈페이지(정적 멀티페이지)
- **라이브**: https://scoutkorea-jimmy.github.io/Duri/
- **저장소**: `scoutkorea-jimmy/Duri` (브랜치 `main`)
- **사이트 루트 폴더**: `duri-website/` — 이 폴더가 곧 배포 산출물
- **배포**: [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)이 `duri-website/`를 Pages로 올림. Pages 소스 = GitHub Actions

---

## 4. 두 갈래 사이트 구조

이 저장소는 **두 개의 사이트**를 한 배포 산출물 안에서 운영합니다.

| 갈래 | 식별자 | 키 컬러 | 진입점 | 상태 |
|---|---|---|---|---|
| 사회적협동조합 두리손잡고 | `coop` | 그린 `#2a8159` | `index.html` | 운영 중(14페이지) |
| 두리손잡고 직업재활센터 | `rehab` | 오션 블루 `#1f6f9e` | `rehab.html` | **준비중 페이지만 존재** |

**동작**

1. **첫 방문**에 `index.html`로 들어오면 전체화면 게이트(`.gate`)가 뜹니다. 좌 50% = 조합, 우 50% = 직업재활센터.
2. 선택은 `localStorage["duri.site.v1"]`에 `"coop"` / `"rehab"`으로 저장됩니다. **재방문 시 게이트는 뜨지 않습니다.**
   - 우측(직업재활센터)을 고르면 저장 후 `rehab.html`로 이동합니다.
   - 재방문자가 `index.html`로 오면 저장값이 `rehab`이어도 강제 이동시키지 않습니다. 이동 수단은 상단 전환 바입니다.
3. 선택 후에는 **모든 페이지 최상단에 전환 바(`.site-switch`)** 가 고정으로 붙어 두 갈래를 오갈 수 있습니다. 높이 `clamp(38px, 5vh, 52px)`.
4. 갈래 판별은 **`<html data-site="...">` 속성**입니다. 값이 없으면 `coop`. `rehab.html`만 `data-site="rehab"`.

**규칙**

- `data-site="rehab"` 페이지에서는 `site.js`가 **조합 메뉴(NAV)·후원 버튼·조합 푸터 링크를 주입하지 않습니다.** 직업재활센터 메뉴가 생기면 `site.js`의 `NAV_REHAB` 배열을 채우세요.
- 게이트를 다시 보게 하려면 `localStorage.removeItem("duri.site.v1")`.
- **게이트를 회피 불가능한 벽으로 만들지 말 것.** 키보드로 두 선택지에 모두 도달 가능해야 하고, JS가 실패해도 본문이 가려지면 안 됩니다(게이트는 JS가 삽입하며, 삽입 실패 시 그냥 조합 홈이 보입니다).

---

## 5. 인증 / 관리자 계정

- **임시 계정: 아이디 `admin` / 비밀번호 `admin`** (`site.js`의 `ADMIN` 상수)
- ⚠️ **클라이언트 사이드 데모 게이트 — 실제 보안이 아닙니다.** 자격증명이 JS에 그대로 노출됩니다.
- 실제 운영(공개 게시판·회원)에는 서버 인증으로 교체 필요 → [50-roadmap.md](50-roadmap.md)

---
© 사회적협동조합 두리손잡고
