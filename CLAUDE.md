# 두리손잡고 — 작업 가이드 (CLAUDE.md)

이 저장소(`두리손잡고` 홈페이지)에서 작업하기 전 반드시 이 문서를 먼저 확인하세요.
**디자인(컬러·타이포·컴포넌트) 규칙은 [DESIGN.md](DESIGN.md)** 를 보세요. 이 문서는 **작업 절차·구조·규칙**을 다룹니다.

---

## 0. 절대 규칙 (어기면 화면/배포가 깨집니다)

1. **빌드 도구 없음.** 순수 HTML/CSS/JS 정적 사이트. npm 빌드·번들러·프레임워크 도입 금지.
2. **서버/DB 없음.** GitHub Pages(정적 호스팅)에 배포. 로그인·게시글은 **브라우저 localStorage** 기반.
3. **헤더/푸터/네비는 HTML에 직접 넣지 말 것.** 전부 [duri-website/assets/site.js](duri-website/assets/site.js)가 주입. 메뉴 변경은 `site.js`의 `NAV` 배열만 수정.
4. **디자인은 leaf 팔레트 + split 히어로로 고정.** 과거 "디자인 옵션" 토글은 제거됨 — 되살리지 말 것.
5. **경로는 모두 상대경로**(`href="about.html"`, `href="assets/..."`). GitHub Pages가 `/Duri/` 하위로 서빙하므로 `/`로 시작하는 절대경로는 깨짐.
6. 변경 후 **로컬에서 헤드리스로 검증**(아래 6번) → 그다음 커밋·푸시.

## 0-1. 표준 작업 흐름 (사용자 요구 — 매번 자동)

작업이 끝나면 **별도 지시가 없어도 항상** `main`에 **커밋·푸시하고 배포까지** 완료합니다.
`main` 푸시 → GitHub Actions가 자동 배포. **배포 성공과 라이브 URL 반영을 확인**하세요.

---

## 1. 개요

- **사이트**: 사회적협동조합 두리손잡고 공식 홈페이지(정적 멀티페이지).
- **라이브**: https://scoutkorea-jimmy.github.io/Duri/
- **저장소**: `scoutkorea-jimmy/Duri` (브랜치 `main`).
- **사이트 루트 폴더**: `duri-website/` (이 폴더가 곧 배포 산출물).

## 2. 파일 구조

```
duri-website/
├─ index.html          메인(히어로/소식/제품/프로그램/CTA/파트너 로고 마퀴)
├─ about, operation, org, business, history   소개 계열
├─ work, products      사업안내
├─ notice.html         공지사항 게시판  ← board.js 사용
├─ gallery.html        사진갤러리(필터 + 라이트박스)
├─ family/internship/volunteer  가족되기(후원·신청 폼)
├─ market.html         마켓(구매 문의 폼)
├─ assets/
│  ├─ styles.css       디자인 시스템 + 공유 컴포넌트  → 규칙은 DESIGN.md
│  ├─ site.js          ★공유 코어: 헤더·푸터·네비·인증·모달·폼·갤러리·reveal
│  └─ board.js         공지 게시판 로직(목록/작성/상세/검색/페이지)
└─ README.md
(저장소 루트) CLAUDE.md(작업) · DESIGN.md(디자인) · .github/workflows/deploy.yml
```

## 3. 공유 코어 — `assets/site.js`

모든 페이지가 로드. 한 IIFE 안에서:
- **헤더·푸터·메가메뉴** 마크업 생성·주입(`NAV`/`ICON` 상수). **favicon** 자동 주입.
- **인증(`Auth`)**: `admin/admin` 데모 로그인, 상태 `localStorage["duri.auth.v1"]`. 계정 컨트롤 렌더 + 로그인 모달. 상태 변경 시 `document`에 **`duri:auth`** 이벤트 발생.
- **모달 헬퍼**: `openModal/closeModal/wireModal`(ESC·배경 클릭 닫힘).
- **공통 UI 와이어링**: 토글 그룹(`.seg/.amt-row/.filter-row`), 갤러리 필터(`data-cat`)+라이트박스, 신청/문의 **폼 제출 → 접수 완료 모달**(필수 `.req` 검증).
- **스크롤 reveal**: `.reveal`. 동적 렌더 후 `window.__revealRescan()`.
- 노출: `window.DURI = { ICON, NAV, Auth, openLogin, openModal, closeModal, wireModal }`.

> 메뉴/연락처/푸터는 `site.js`의 `NAV` 배열·footer HTML만 고치면 전 페이지 반영.

## 4. 게시판 — `assets/board.js` (notice.html 전용)

- **모델**: `{ id, cat, pinned, date:"YYYY.MM.DD", title, body }`. `cat` ∈ `공지|새소식|언론보도`. 시드 id `s*`, 사용자 글 `u*`.
- **저장소**: `localStorage["duri.posts.v1"]`(사용자 글). 시드 글은 `SEED` 상수.
- **기능**: 목록(고정 먼저, 날짜 내림차순, 10개/페이지)·탭·검색·페이지네이션·행 클릭 상세.
- **글쓰기/삭제**: **로그인(관리자) 시에만** 글쓰기 버튼 노출(`duri:auth`로 토글). 사용자 글(`u*`)만 삭제 가능, 시드 글 불가.
- notice.html은 빈 컨테이너(`#board`/`#pager`/`#tabs`/`#postCount`/`#searchInput`/`#writeBtn`)만 두고 board.js가 채움.

## 5. 인증 / 관리자 계정

- **임시 계정: 아이디 `admin` / 비밀번호 `admin`** (`site.js`의 `ADMIN` 상수).
- ⚠️ **클라이언트 사이드 데모 게이트 — 실제 보안 아님**(자격증명이 JS에 노출). 실제 운영(공개 게시판/회원)에는 서버 인증으로 교체 필요(아래 8번).

## 6. 콘텐츠 추가 & 로컬 검증

**추가 방법**
- 메뉴: `site.js`의 `NAV` 배열.
- 새 페이지: 기존 페이지 복제 → `<head>`에 `styles.css`, `<body>` 끝에 `<script src="assets/site.js"></script>`. 헤더/푸터는 자동 주입되므로 본문만 작성.
- 모든 방문자에게 보일 공지: board.js의 `SEED`에 추가(사용자가 화면에서 쓴 글은 그 브라우저에만 저장됨).
- 갤러리: gallery.html `.masonry`에 `.tile` + `data-cat` 추가.
- 파트너 로고: index.html `PARTNERS`에 `{ name, logo:"assets/logos/..." }` 추가(이미지 자동 표시).

**로컬 실행 & 검증**
```bash
python3 -m http.server 5599 --directory duri-website   # http://localhost:5599
```
기능 변경 후에는 **헤드리스 검증 권장**: 설치된 Google Chrome + `puppeteer-core`로 로그인→글쓰기→삭제, 탭/검색/페이지네이션, 폼 제출, 갤러리 필터, 헤더 반응형, 마퀴 동작을 점검하고 **콘솔 에러 0** 확인.

## 7. 배포

- `main` 푸시 → [.github/workflows/deploy.yml](.github/workflows/deploy.yml)가 `duri-website/`를 Pages로 배포.
- Pages 소스 = **GitHub Actions**. 라이브: https://scoutkorea-jimmy.github.io/Duri/
- 상태: 저장소 **Actions** 탭, **Settings → Pages**.

## 8. 향후: 게시글을 모든 방문자가 공유하려면

현재 게시판·로그인은 localStorage라 기기 간 공유가 안 됨. 공유 게시판이 필요하면 정적 호스팅 유지 + **서버리스 백엔드**(Cloudflare Pages Functions / Firebase / Supabase 등)로 저장·인증 이전. 이 저장소에는 `functions/api/posts`, `functions/post` 작업 디렉터리가 연결되어 참고 가능.

---
참고: 디자인 토큰·컴포넌트 상세는 [DESIGN.md](DESIGN.md). © 사회적협동조합 두리손잡고
