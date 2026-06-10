# 두리손잡고 홈페이지 — 작업 가이드 (먼저 읽어주세요)

> **이 파일은 이 프로젝트에서 어떤 작업을 하기 전에 가장 먼저 읽어야 하는 문서입니다.**
> 새로운 기능 추가·수정·배포 전에 아래 구조와 규칙을 반드시 확인하세요.

---

## 0. 절대 규칙 (지키지 않으면 화면/배포가 깨집니다)

1. **빌드 도구 없음.** 순수 HTML/CSS/JS 정적 사이트입니다. npm 빌드·번들러·프레임워크를 도입하지 마세요.
2. **서버/DB 없음.** GitHub Pages(정적 호스팅)에 배포됩니다. 로그인·게시글은 **브라우저 localStorage** 기반입니다.
3. **헤더/푸터/네비게이션은 절대 각 HTML에 직접 넣지 마세요.** 전부 [assets/site.js](assets/site.js)가 주입합니다. 메뉴를 바꾸려면 `site.js`의 `NAV` 배열만 수정.
4. **디자인은 리프(leaf) 팔레트 · 분할형(split) 히어로로 고정**입니다. 과거의 "디자인 옵션" 토글은 제거되었습니다. 다시 추가하지 마세요.
5. **경로는 모두 상대경로**(`href="about.html"`, `href="assets/..."`)로 작성하세요. GitHub Pages가 `/Duri/` 하위 경로로 서빙하므로 `/`로 시작하는 절대경로는 깨집니다.
6. 변경 후에는 **로컬에서 헤드리스 테스트로 검증**하고(아래 9번), 그다음 커밋·푸시하세요.

---

## 1. 개요

- **사이트**: 사회적협동조합 두리손잡고 공식 홈페이지 (정적 멀티페이지).
- **배포 URL**: https://scoutkorea-jimmy.github.io/Duri/
- **저장소**: `scoutkorea-jimmy/Duri` (브랜치 `main` 푸시 시 자동 배포)
- **사이트 루트 폴더**: `duri-website/` (이 폴더가 곧 배포 산출물)

## 2. 기술 스택 & 제약

| 항목 | 내용 |
|---|---|
| 언어 | HTML5 / CSS3 / Vanilla JS (ES5~ES6, IIFE 패턴) |
| 폰트 | Pretendard (CDN) |
| 빌드 | 없음 (파일 그대로 서빙) |
| 호스팅 | GitHub Pages (Actions 워크플로 배포) |
| 데이터 | `localStorage` (로그인 상태, 게시글) — **브라우저 1대 한정, 공유 안 됨** |

## 3. 파일 구조

```
duri-website/
├─ index.html          메인(히어로/소식/제품/프로그램/CTA/파트너)
├─ about, operation, org, business, history   소개 계열
├─ work, products      사업안내
├─ notice.html         공지사항 게시판  ← board.js 사용
├─ gallery.html        사진갤러리(필터+라이트박스)
├─ family/internship/volunteer  가족되기(후원·신청 폼)
├─ market.html         마켓(구매 문의 폼)
├─ assets/
│  ├─ styles.css       디자인 시스템 + 공유 컴포넌트(모달/계정/게시판 등)
│  ├─ site.js          ★공유 코어: 헤더·푸터·네비·인증·모달·폼·갤러리·reveal
│  └─ board.js         공지사항 게시판 로직(목록/작성/상세/검색/페이지)
├─ GUIDE.md            (이 문서)
└─ README.md
```

## 4. 공유 코어 — `assets/site.js`

모든 페이지가 로드합니다. 한 IIFE 안에서 아래를 담당:

- **MARK / NAV / ICON** 상수 → 헤더·푸터·메가메뉴 마크업 생성·주입.
- **favicon** 자동 주입(브랜드 마크 SVG) — 모든 페이지 404 방지.
- **인증(`Auth`)**: `admin / admin` 데모 로그인. 상태는 `localStorage["duri.auth.v1"]`.
  헤더 우측 계정 컨트롤(로그인/로그아웃) 렌더, 로그인 모달 제공.
  로그인 상태 변경 시 `document`에 **`duri:auth`** 커스텀 이벤트 발생.
- **모달 헬퍼**: `openModal/closeModal/wireModal` (ESC·배경 클릭 닫힘).
- **공통 UI 와이어링**:
  - 토글 버튼 그룹(`.seg`, `.amt-row`, `.filter-row`) 단일 선택.
  - 갤러리 필터(`data-cat` 기준 표시/숨김) + 타일 클릭 라이트박스.
  - 신청/문의 **폼 제출** → 필수항목(`.req`) 검증 후 "접수 완료" 모달.
- **스크롤 reveal**: `.reveal` 요소 등장 애니메이션. 동적 렌더 후 `window.__revealRescan()` 호출.
- 외부 노출: `window.DURI = { ICON, NAV, Auth, openLogin, openModal, closeModal, wireModal }`.

> 메뉴/연락처/푸터를 바꾸려면 `site.js` 상단의 `NAV` 배열과 footer HTML만 고치면 전 페이지에 반영됩니다.

## 5. 게시판 — `assets/board.js` (notice.html 전용)

- **데이터 모델**: `{ id, cat, pinned, date:"YYYY.MM.DD", title, body }`
  - `cat` ∈ `"공지" | "새소식" | "언론보도"` (태그색: notice/news/press)
  - 시드 글 id는 `s*`, 사용자 작성 글 id는 `u*`.
- **저장소 키**: `localStorage["duri.posts.v1"]` (사용자 작성 글 배열). 시드 글은 코드 내 `SEED` 상수.
- **목록**: 시드+사용자 글 병합 → 고정(공지) 먼저, 날짜 내림차순. 페이지당 10개.
- **기능**: 탭 필터 / 제목 검색 / 페이지네이션 / 행 클릭 상세 모달.
- **글쓰기**: **로그인(관리자)했을 때만** "글쓰기" 버튼 노출(`duri:auth` 이벤트로 토글).
  작성 시 분류·제목·내용·상단고정 입력 → `duri.posts.v1`에 prepend.
- **삭제**: 관리자가 자신이 쓴 글(`u*`)의 상세 모달에서 삭제 가능. 시드 글은 삭제 불가.
- notice.html은 빈 컨테이너(`#board`, `#pager`, `#tabs`, `#postCount`, `#searchInput`, `#writeBtn`)만 두고 board.js가 채웁니다.

## 6. 인증 / 관리자 계정

- **임시 계정: 아이디 `admin` / 비밀번호 `admin`** ([assets/site.js](assets/site.js)의 `ADMIN` 상수).
- ⚠️ **이것은 클라이언트 사이드 데모 게이트이며 실제 보안이 아닙니다.** 자격증명이 JS에 노출됩니다.
  실제 운영(공개적으로 글을 받는 게시판/회원)에는 반드시 서버 인증으로 교체해야 합니다(아래 12번).

## 7. 콘텐츠 추가 방법

- **메뉴 항목 추가/변경**: `site.js`의 `NAV` 배열 수정.
- **새 페이지 추가**: 기존 페이지를 복제 → `<head>`에 `styles.css` 링크, `<body>` 끝에 `<script src="assets/site.js"></script>`. 헤더/푸터는 자동 주입되므로 본문만 작성.
- **공지 글 기본값 추가**(모든 방문자에게 보이게): board.js의 `SEED` 배열에 추가. (사용자가 화면에서 쓴 글은 그 브라우저에만 저장됨에 유의)
- **갤러리 항목**: gallery.html `.masonry`에 `.tile` 추가 + `data-cat` 지정(필터 동작).

## 8. 디자인 규칙

- 컬러/반경/그림자 토큰은 `styles.css` 상단 `:root` 변수로 일괄 관리. 하드코딩 대신 변수 사용.
- 팔레트: **leaf 고정**(`--brand:#2a8159`대 계열). forest/sage 및 hero center 변형 CSS는 제거됨 — 되살리지 말 것.
- 버튼: `.btn` + `.btn-primary/-accent/-outline/-ghost/-white`. 모달: `.modal/.modal-card`. 폼: `.field`.

## 9. 로컬 실행 & 검증

```bash
# 로컬 서버
python3 -m http.server 5599 --directory duri-website
# http://localhost:5599 접속
```

기능 변경 후에는 헤드리스 검증을 권장합니다(과거 작업 시 puppeteer-core + 설치된 Google Chrome으로
로그인→글쓰기→삭제, 탭/검색/페이지네이션, 폼 제출, 갤러리 필터 등을 자동 점검함). 콘솔 에러 0 확인.

## 10. 배포

- `main`에 푸시하면 [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)가 `duri-website/`를 Pages로 배포.
- Pages 소스 = **GitHub Actions**. 배포 후 https://scoutkorea-jimmy.github.io/Duri/ 에서 확인.
- 상태 확인: 저장소 **Actions** 탭, **Settings → Pages**.

## 11. 아직 교체가 필요한 자리표시자(placeholder)

- 실제 로고/사진(`.media`, `.tile`, `.hero-panel`), 인증서류 이미지.
- 후원 계좌번호(현재 `000-...`), 실습비 등 미정 수치.
- 공지/갤러리/조직도 예시 콘텐츠.

## 12. 향후: 게시글을 모든 방문자가 공유하려면

현재 게시판·로그인은 localStorage라 기기 간 공유가 안 됩니다. 실제 공유 게시판이 필요하면:
- 정적 호스팅 유지 + **서버리스 백엔드**(예: Cloudflare Pages Functions / Firebase / Supabase)로 글 저장·인증 이전.
- 이 저장소에는 이미 `functions/api/posts`, `functions/post` 작업 디렉터리가 연결되어 있어 참고 가능.

---
© 사회적협동조합 두리손잡고
