# 50 · 알려진 결함과 개선 로드맵

> 기준: **2026-08-17 전수 점검**. 다음에 무엇을 할지 정할 때 읽습니다.
> 항목을 해결하면 여기서 지우고 [WORKLOG.md](WORKLOG.md)에 옮겨 적습니다.

**점검 시점 규모**: HTML 15개 + 에셋 3개(styles.css / site.js / board.js). 빌드 없음. 배포 파이프라인 정상.

---

## A. 사이트로서 치명적 (실사용 차단)

| # | 내용 | 근거 | 해결 방향 |
|---|---|---|---|
| A1 | **게시판·로그인이 localStorage** → 관리자가 쓴 공지가 다른 방문자에게 보이지 않는다. 공지 게시판으로서 기능하지 않음 | `board.js` `duri.posts.v1` | 정적 호스팅 유지 + 서버리스 백엔드(Cloudflare Pages Functions / Firebase / Supabase). 또는 공지를 `SEED`에 커밋하는 운영 방식으로 확정 |
| A2 | **모든 폼이 실제로 전송되지 않는다.** "접수 완료" 모달만 표시 | `site.js` 폼 핸들러 | 메일 전송(서버리스 함수) 또는 Google Form / Formspree 등 외부 엔드포인트 연결 |
| A3 | **실제 이미지가 0개.** 전부 그라데이션 플레이스홀더. `assets/logos/` 폴더 자체가 없어 파트너 로고도 텍스트 | 전 페이지 | 사진·로고 자산 확보가 선행 조건. 확보되면 `.media`/`.tile`/`PARTNERS` 교체 |
| A4 | **직업재활센터 사이트가 준비중 페이지 하나뿐** | `rehab.html` | 콘텐츠 확정 후 페이지 세트 신설 + `site.js`의 `NAV_REHAB` 채우기 |

---

## B. 접근성 (KWCAG 2.2) — ✅ 2026-08-17 1차 완료

`tools/verify-a11y.mjs` **23건 전부 통과**. 해결된 항목:

| # | 내용 |
|---|---|
| B1 | ~~`.field select`에 `:focus` 누락~~ ✅ |
| B2 | ~~메가메뉴 `:hover` 전용~~ ✅ `:focus-within` + 전역 `:focus-visible` |
| B3 | ~~`aria-*` 사실상 없음~~ ✅ 장식 SVG 48개 `aria-hidden`, 랜드마크(`main`/`nav`/`footer`), 대화상자 `role`/`aria-modal`/`aria-labelledby`, 버튼 그룹 `radiogroup`/`aria-checked`, 페이저 `aria-current` |
| B4 | ~~갤러리 `.tile` 키보드 조작 불가~~ ✅ 12개 전부 `role="button" tabindex="0"` + 이름 + Enter/Space |
| B5 | ~~색 대비 미검증~~ ✅ 15페이지 전수 계산. `--muted` 4.04→5.97, 전환 바 3.49→9.4, 앰버 글자 2.42→5.22, `--brand` 는 면 색으로만 |
| B6 | ~~`alt` 누락 위험~~ ✅ `check-links.mjs` + `verify-a11y.mjs` 이중 검사 |
| B7 | ~~폼 레이블 `for` 결속 전무(25개 필드)~~ ✅ 21개 결속 + 필수 3중 표시 + `novalidate` |
| B8 | ~~skip navigation 없음~~ ✅ 전 페이지 "본문 바로가기" → `<main id="main">` |
| B9 | ~~컨트롤 44×44 미달~~ ✅ 탭·필터·금액·페이저·닫기 버튼 전부 44 이상 |

**남은 접근성 과제 (자동 검사로는 판정 불가 — 사람이 확인)**

| # | 내용 |
|---|---|
| B10 | 그라데이션·이미지 배경 위 텍스트 55종의 실제 판독성 (`.page-hero`, `.media`, 히어로) |
| B11 | 화면 낭독기(VoiceOver/NVDA) 실사용 점검 — 읽는 순서, 대체 텍스트의 *적절성* |
| B12 | 확대 200% 레이아웃 붕괴 여부 |
| B13 | 실제 사진이 들어올 때 `alt` 내용의 적절성 (A3 와 함께) |

---

## C. SEO · 공유 (미착수)

| # | 내용 |
|---|---|
| C1 | 15페이지 전부 `meta description` 없음 |
| C2 | `og:*` / `twitter:card` 없음 → 카톡·SNS 공유 시 미리보기 안 나옴 |
| C3 | `canonical` 없음 |
| C4 | `sitemap.xml` / `robots.txt` 없음 |
| C5 | 단체 정보 JSON-LD(`Organization` / `LocalBusiness`) 없음 → 지역 검색·지도 노출 불리 |
| C6 | `404.html` 없음 |

> C1~C4는 정적 파일 추가와 `<head>` 편집만으로 끝납니다. **비용 대비 효과가 가장 큰 구간.**

---

## D. 성능

| # | 내용 | 근거 |
|---|---|---|
| D1 | Pretendard를 CSS `@import`로 jsDelivr에서 로드 → **렌더 블로킹**. `preconnect`/`preload` 없음, 서브셋도 아님(가변 폰트 전체) | `styles.css:6` |
| D2 | 페이지별 인라인 `<style>` 합계 약 330줄(index만 100줄) → 브라우저 캐시 불가·중복 | 14페이지 |
| D3 | ~~히어로 블롭 무한 애니메이션 → 저사양 기기 발열~~ ✅ 2026-08-17 제거(모션 전면 제거) |

---

## E. 개발 인프라

| # | 내용 |
|---|---|
| E1 | ~~`puppeteer-core` 미설치 → 헤드리스 검증 불가~~ ✅ 2026-08-17 해결(`tools/verify-headless.mjs` 40건). 단 `puppeteer-core`는 저장소 밖(`/tmp`)에 설치해야 함 |
| E2 | CI에 검증 단계 없음. `deploy.yml`은 곧바로 배포함 → `check-links` / `verify-a11y` 를 배포 전 게이트로 넣을 여지 |
| E4 | 검증 스크립트가 `puppeteer-core` 를 저장소 밖 심볼릭 링크로 참조. 새 기기에서는 [40-verify.md](40-verify.md) 4절 준비 단계를 먼저 해야 함 |
| E3 | `admin/admin`이 `site.js`에 평문. 데모 게이트임을 문서에 명시했으나 실운영 전 반드시 교체(A1과 함께) |

---

## 권장 진행 순서

1. **C1~C4 + C6** — 싸고 즉시 효과. 정적 파일 추가만
2. **B10~B12** — 접근성 수동 점검(낭독기·확대). 자동 검사가 못 보는 구간
3. **D1~D2** — 폰트 로딩과 CSS 통합
4. **A3** — 실제 사진·로고 확보 (외부 의존) → B13 동반
5. **A1 + A2 + E3** — 서버리스 백엔드 도입. 게시판·폼·인증을 한 번에
6. **A4** — 직업재활센터 사이트 본격 구축

---
© 사회적협동조합 두리손잡고
