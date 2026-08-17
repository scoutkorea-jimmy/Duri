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
7. **웹 접근성(KWCAG 2.2)은 타협 대상이 아닙니다.** 이 사이트는 장애인 직업재활시설의 공식 홈페이지입니다.
   아래 7-1을 어기는 변경은 "디자인이 더 예뻐서"를 포함한 어떤 이유로도 넣지 않습니다.
8. **자동으로 움직이는 것을 새로 만들지 마세요.** 무한 반복 애니메이션·자동 슬라이드·마퀴 금지
   (KWCAG 6.2.2). 상태 변화에 따른 즉각적 전환만 허용합니다.
9. **한글 줄바꿈은 단어(어절) 단위입니다.** `styles.css` 상단의 `word-break:keep-all` +
   `overflow-wrap:break-word` 블록을 **되돌리거나 개별 컴포넌트에서 덮어쓰지 마세요.**
   새 CSS를 쓸 때 `word-break:normal` 을 넣지 않습니다. → [20-design.md](20-design.md) 2절
10. **새 페이지·새 레이아웃에는 반응형 분기를 반드시 넣습니다.** 2열 이상 그리드는 좁은 폭에서 접혀야 하고,
   **320px에서 가로 스크롤이 생기면 안 됩니다.** `tools/verify-headless.mjs` 가 360px·320px를 검사합니다.

---

## 1-1. 접근성 최소선 (KWCAG 2.2 · 한국형 웹 콘텐츠 접근성 지침)

새 마크업을 쓸 때마다 지켜야 하는 것들입니다. 전체 검사 항목과 근거는 [40-verify.md](40-verify.md).

| 무엇을 만들 때 | 반드시 |
|---|---|
| 입력 컨트롤 | `<label for>` ↔ `id` 결속. **placeholder 는 레이블이 아닙니다.** 필수는 `required` + `aria-required` + `.req`(*) + `<span class="sr-only">(필수 항목)</span>` |
| 장식 아이콘·SVG | `aria-hidden="true" focusable="false"` |
| 의미 있는 이미지 | `alt` 작성. 장식이면 `alt=""` |
| 클릭되는 요소 | `<a>`/`<button>` 우선. `div` 를 쓰면 `role="button" tabindex="0"` + Enter/Space 핸들러 |
| 컨트롤 크기 | 최소 **44×44px** |
| 색으로 상태를 표시 | 색 외 단서를 하나 더 (기호·보더·`aria-checked`·`aria-current`) |
| 텍스트 색 | 배경과 **4.5:1** 이상(큰 텍스트 3:1). `--brand` 는 **면 색**이고, 글자에는 `--brand-deep` 을 씁니다. 앰버 글자는 `--amber-700` |
| 단일 선택 버튼 그룹 | `role="radiogroup"` + `aria-label`, 각 버튼 `role="radio"` + `aria-checked`, 화살표 키 이동 |
| 대화상자(모달) | `role="dialog"` + `aria-modal="true"` + `aria-labelledby`, 열 때 내부로 초점, Tab 갇힘, ESC 닫힘, 닫을 때 원래 위치 복귀 → `wireModal()` 이 처리 |
| 오류 안내 | `role="alert"` + 어느 항목인지 말해주는 문구 + `aria-invalid` + 해당 입력으로 초점 |
| 새 페이지 | `<html lang="ko">` · `<title>` 고유 · `<h1>` 1개 · `<main id="main">` 1개 (건너뛰기 링크 도착지) |

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
4. **선택 화면으로 되돌아갈 수 있습니다.** 모든 페이지 푸터 맨 아래의 **"처음 선택 화면 다시 보기"**(`.foot-reset`, `index.html?gate=1`).
   - 홈에서 누르면 페이지 이동 없이 즉시 열립니다. 하위 페이지에서는 `index.html?gate=1` 로 이동합니다.
   - `?gate=1` 또는 `#gate` 로 직접 진입해도 열립니다(북마크·공유 가능).
   - **다시 열린 게이트는 닫기 버튼과 ESC 로 닫을 수 있고**, 닫으면 기존 선택이 그대로 유지됩니다.
     첫 방문 게이트에는 닫기 버튼이 없습니다 — 두 선택지 자체가 진행 경로이기 때문입니다.
   - 선택을 마치면 주소창의 `?gate=1` 은 `history.replaceState` 로 정리해, 새로고침 때 다시 뜨지 않게 합니다.
5. 갈래 판별은 **`<html data-site="...">` 속성**입니다. 값이 없으면 `coop`. `rehab.html`만 `data-site="rehab"`.

**규칙**

- `data-site="rehab"` 페이지에서는 `site.js`가 **조합 메뉴(NAV)·후원 버튼·조합 푸터 링크를 주입하지 않습니다.** 직업재활센터 메뉴가 생기면 `site.js`의 `NAV_REHAB` 배열을 채우세요.
- 게이트를 다시 보려면 푸터의 "처음 선택 화면 다시 보기" 또는 `index.html?gate=1`. 저장값을 지우는 방법(`localStorage.removeItem("duri.site.v1")`)은 첫 방문 상태를 재현할 때만 쓰세요.
- ⚠️ **되돌아갈 경로를 없애지 마세요.** 한 번 고르면 못 돌아가던 상태가 사용자 지적으로 드러나 추가된 기능입니다(2026-08-17).
- **게이트를 회피 불가능한 벽으로 만들지 말 것.** 키보드로 두 선택지에 모두 도달 가능해야 하고, JS가 실패해도 본문이 가려지면 안 됩니다(게이트는 JS가 삽입하며, 삽입 실패 시 그냥 조합 홈이 보입니다).

---

## 5. 인증 / 관리자 계정

- **임시 계정: 아이디 `admin` / 비밀번호 `admin`** (`site.js`의 `ADMIN` 상수)
- ⚠️ **클라이언트 사이드 데모 게이트 — 실제 보안이 아닙니다.** 자격증명이 JS에 그대로 노출됩니다.
- 실제 운영(공개 게시판·회원)에는 서버 인증으로 교체 필요 → [50-roadmap.md](50-roadmap.md)

---
© 사회적협동조합 두리손잡고
