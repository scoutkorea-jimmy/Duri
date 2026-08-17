# 10 · 파일 구조와 공유 코어

> 코드·파일을 건드리기 전에 읽습니다. 절대 규칙은 [00-core.md](00-core.md).

---

## 1. 폴더 구조

```
(저장소 루트)
├─ CLAUDE.md                작업 진입점 — rules/ 참조 의무만 명시
├─ rules/                   ★ 모든 개발 규칙
│  ├─ README.md  00-core.md  10-structure.md  20-design.md
│  ├─ 30-content.md  40-verify.md  50-roadmap.md
│  └─ WORKLOG.md            지시·개선 이력(성공/실패 사유)
├─ .github/workflows/deploy.yml
└─ duri-website/            ★ 배포 산출물
   ├─ index.html            조합 메인(히어로/소식/제품/프로그램/CTA/파트너 마퀴) + 진입 게이트
   ├─ rehab.html            직업재활센터 — 준비중 페이지 (data-site="rehab")
   ├─ about · operation · org · business · history   소개 계열
   ├─ work · products                                사업안내
   ├─ notice.html           공지 게시판  ← board.js 사용
   ├─ gallery.html          사진갤러리(필터 + 라이트박스)
   ├─ family · internship · volunteer                가족되기(후원·신청 폼)
   ├─ market.html           마켓(구매 문의 폼)
   ├─ assets/
   │  ├─ styles.css         디자인 시스템 + 공유 컴포넌트  → 규칙은 20-design.md
   │  ├─ site.js            ★공유 코어
   │  └─ board.js           공지 게시판 로직
   └─ README.md
```

---

## 2. 공유 코어 — `assets/site.js`

**모든 페이지가 로드**합니다. 한 IIFE 안에서 순서대로:

| 블록 | 하는 일 |
|---|---|
| 사이트 판별 | `<html data-site>` 를 읽어 `SITE` = `"coop"` \| `"rehab"` 결정. favicon도 갈래 색으로 주입 |
| 진입 게이트 | `SITE==="coop"` 이고 `localStorage["duri.site.v1"]`가 비었을 때만 전체화면 `.gate` 삽입 |
| 상단 전환 바 | `.site-switch` 를 `<body>` 최상단에 삽입. 현재 갈래에 `.on` |
| 헤더·메가메뉴 | `NAV` / `NAV_REHAB` 배열로 마크업 생성·주입. 버거 메뉴, 스크롤 시 `.scrolled` |
| 푸터 | 갈래별 푸터 주입 (`rehab`은 간략형) |
| 인증 `Auth` | `admin/admin` 데모 로그인. 상태 `localStorage["duri.auth.v1"]`. 변경 시 `document`에 **`duri:auth`** 이벤트 발생 |
| 모달 헬퍼 | `openModal` / `closeModal` / `wireModal` (ESC·배경 클릭 닫힘) |
| 공통 UI 와이어링 | 토글 그룹(`.seg`/`.amt-row`/`.filter-row`), 갤러리 필터(`data-cat`)+라이트박스, 폼 제출 → 접수 완료 모달(필수 `.req` 검증) |
| 스크롤 reveal | `.reveal` → `.in`. 동적 렌더 후 `window.__revealRescan()` 호출 |

**노출 API**
```js
window.DURI = { SITE, ICON, NAV, Auth, openLogin, openModal, closeModal, wireModal }
```

> 메뉴·연락처·푸터는 `site.js`의 `NAV` 배열과 footer HTML만 고치면 **전 페이지에 반영**됩니다.

### localStorage 키 목록

| 키 | 용도 | 지우면 |
|---|---|---|
| `duri.site.v1` | 진입 게이트 선택(`coop`/`rehab`) | 게이트가 다시 뜸 |
| `duri.auth.v1` | 관리자 로그인 상태 | 로그아웃됨 |
| `duri.posts.v1` | 사용자가 작성한 공지글 | 작성 글 전부 사라짐 |

---

## 3. 게시판 — `assets/board.js` (notice.html 전용)

- **모델**: `{ id, cat, pinned, date:"YYYY.MM.DD", title, body }`
  `cat` ∈ `공지 | 새소식 | 언론보도`. 시드 글 id는 `s*`, 사용자 글은 `u*`.
- **저장소**: `localStorage["duri.posts.v1"]`(사용자 글). 시드 글은 `SEED` 상수(코드에 하드코딩).
- **기능**: 목록(고정 먼저 → 날짜 내림차순, 10개/페이지) · 탭 · 검색 · 페이지네이션 · 행 클릭 상세 모달.
- **글쓰기/삭제**: **로그인(관리자) 시에만** 글쓰기 버튼 노출(`duri:auth` 이벤트로 토글). 사용자 글(`u*`)만 삭제 가능, 시드 글은 삭제 불가.
- `notice.html`은 빈 컨테이너만 두고 board.js가 채웁니다:
  `#board` · `#pager` · `#tabs` · `#postCount` · `#searchInput` · `#writeBtn`

⚠️ 사용자가 화면에서 쓴 글은 **그 브라우저에만** 저장됩니다. 모든 방문자에게 보여야 하는 공지는 `SEED`에 넣으세요 → [30-content.md](30-content.md)

---

## 4. 새 페이지 만드는 법

1. 성격이 가장 비슷한 기존 페이지를 복제합니다.
2. `<head>`에 `<link rel="stylesheet" href="assets/styles.css">` — **상대경로**.
3. `<body>` 끝에 `<script src="assets/site.js"></script>`.
4. **헤더·푸터·전환 바는 자동 주입**되므로 본문(`<main>` 상당 영역)만 작성합니다.
5. 직업재활센터 쪽 페이지라면 `<html lang="ko" data-site="rehab">`.
6. 메뉴에 노출하려면 `site.js`의 `NAV`(조합) 또는 `NAV_REHAB`(직업재활센터) 배열에 추가 → [30-content.md](30-content.md)
7. 페이지 전용 CSS는 해당 HTML의 `<style>` 블록에 둡니다. **2개 이상 페이지가 쓰는 순간 `styles.css`로 승격**시키세요.

---

## 5. 코드 관례

- ES5~ES2017 수준의 평이한 JS. 트랜스파일이 없으므로 최신 문법 남용 금지(옵셔널 체이닝·`??`는 사용 가능, 모듈 `import`는 불가).
- 사용자 입력을 DOM에 넣을 때는 **반드시 `esc()`로 이스케이프**합니다(board.js 참고).
- 전역 오염 금지 — 모든 스크립트는 IIFE로 감싸고, 공유가 필요한 것만 `window.DURI`에 노출합니다.
- 클릭 가능한 요소는 `<a>`/`<button>`을 우선 사용하고, 부득이 `div`를 쓰면 `role="button" tabindex="0"` + Enter/Space 핸들러를 반드시 붙입니다.

---
© 사회적협동조합 두리손잡고
