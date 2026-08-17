# 20 · 디자인 시스템

> 화면에 보이는 것을 바꿀 때 읽습니다. 작업 절차·구조·배포는 [00-core.md](00-core.md) · [10-structure.md](10-structure.md), 인덱스는 [README.md](README.md).
> 모든 토큰·컴포넌트의 원본은 [duri-website/assets/styles.css](../duri-website/assets/styles.css) 입니다. 이 문서와 코드가 다르면 **코드가 정답**이며, 변경 시 둘 다 맞춰주세요.

---

## 0. 디자인 원칙

- **무드**: Nature Green — 따뜻하고, 희망적이며, 사람 중심(warm / hopeful / human).
- **그린이 주인공, 앰버는 조연.** 앰버(`--accent`)는 후원·가족되기·CTA 등 "행동"을 유도하는 곳에만 절제해서 사용.
- **부드러운 곡률 + 낮은 채도 그림자**로 포근함을 표현. 날카로운 직각·강한 그림자 지양.
- **여백을 넉넉하게.** 섹션 상하 패딩이 크고(104px), 타이포 letter-spacing은 음수로 단정하게.
- **사진 전 단계**: 실제 사진이 없는 자리는 그라데이션 플레이스홀더(`.media`, `.tile`)로 채우고 추후 교체.
- 디자인은 현재 **leaf 팔레트 + split 히어로로 고정**(과거 "디자인 옵션" 토글 제거). 되살리지 말 것.
- **두 갈래 사이트**: 조합=그린, 직업재활센터=오션 블루. 무드·타이포·컴포넌트는 **완전히 동일**하고 **키 컬러만** 다릅니다 → 1-1절.

---

## 1. 컬러 토큰 (`:root`)

색은 항상 **CSS 변수로** 쓰세요. 하드코딩 금지.

### 그린 코어
| 토큰 | HEX | 용도 |
|---|---|---|
| `--green-900` | `#103127` | 푸터 배경, 가장 어두운 면 |
| `--green-800` | `#184a35` | 딥 섹션(`.section--deep`) |
| `--green-700` | `#1f6242` | = `--brand-deep`, 진한 제목/강조 |
| `--green-600` | `#2a8159` | = `--brand`, **프라이머리** |
| `--green-500` | `#37a06d` | 그라데이션, 보조 |
| `--green-400` | `#62bd8f` | |
| `--green-300` | `#97d6b3` | |
| `--green-200` | `#c6e9d4` | 카드 hover 보더 등 |
| `--green-100` | `#e4f4ea` | = `--brand-soft` |
| `--green-50`  | `#f1faf4` | = `--brand-tint`, 가장 옅은 면 |

### 앰버 액센트 (절제 사용)
| 토큰 | HEX | 용도 |
|---|---|---|
| `--amber-600` | `#d98a2b` | 앰버 텍스트 |
| `--amber-500` | `#eda23c` | = `--accent`, 후원/CTA 버튼·필수표시(*) |
| `--amber-200` | `#f8dcab` | 그라데이션 포인트 |
| `--amber-100` | `#fcefd6` | 앰버 배지 배경 |

### 중성 (그린 톤 따뜻한 회색)
| 토큰 | HEX | 용도 |
|---|---|---|
| `--cream` | `#f8f7f0` | `body` 배경 |
| `--paper` | `#ffffff` | 카드/패널 |
| `--ink` | `#19271f` | 제목 텍스트 |
| `--body` | `#3b4a41` | 본문 텍스트 |
| `--muted` | `#6e7d73` | 보조 텍스트 |
| `--line` | `#e3ece6` | 기본 보더 |
| `--line-strong` | `#cfddd4` | 입력 필드 보더 등 |

### 테마 훅 (컴포넌트는 이 4개를 참조)
`--brand`=green-600 · `--brand-deep`=green-700 · `--brand-soft`=green-100 · `--brand-tint`=green-50 · `--accent`=amber-500
→ 컴포넌트는 가급적 `--brand*`/`--accent`를 쓰면 팔레트 교체에도 안전합니다.

---

## 1-1. 사이트별 테마 — 직업재활센터 (오션 블루)

이 저장소는 두 갈래 사이트를 운영합니다([00-core.md](00-core.md) 4절).
갈래는 **`<html data-site="...">`** 로 판별하고, 색은 **토큰 재정의로만** 바꿉니다.

```css
html[data-site="rehab"]{ --brand:#1f6f9e; ... }   /* styles.css 하단 */
```

| 역할 | 조합 `coop`(기본) | 직업재활센터 `rehab` |
|---|---|---|
| `--brand` (프라이머리) | `#2a8159` | **`#1f6f9e`** |
| `--brand-deep` | `#1f6242` | `#17567b` |
| `--brand-soft` | `#e4f4ea` | `#e2eff7` |
| `--brand-tint` | `#f1faf4` | `#f1f7fb` |
| 딥 섹션 / 푸터 | `#184a35` / `#103127` | `#12466a` / `#0d2c40` |
| `--accent` (앰버) | `#eda23c` | `#eda23c` — **공통 유지** |
| body 배경 | `--cream` `#f8f7f0` | `#f6f8fa` (쿨 톤) |
| 텍스트 `--ink` / `--body` / `--muted` | `#19271f` / `#3b4a41` / `#6e7d73` | `#17222b` / `#3b4650` / `#6b7783` |
| 보더 `--line` / `--line-strong` | `#e3ece6` / `#cfddd4` | `#e2e9ee` / `#ccd7e0` |

**규칙**

- ❌ `rehab` 전용 컴포넌트 CSS를 새로 만들지 마세요. **토큰만 갈아끼우면** 기존 `.btn`·`.card`·`.page-hero`·`.modal` 등이 그대로 새 색으로 렌더됩니다.
- ❌ 색 하드코딩 금지. `green-*` 스케일을 직접 참조하는 컴포넌트는 갈래 전환 시 색이 어긋납니다. `--brand*` / `--line` / `--ink` 계열을 쓰세요.
- 앰버(`--accent`)는 **두 갈래 공통**입니다. "행동"의 색을 통일해 한 단체라는 인상을 유지합니다.
- 갈래를 새로 추가할 일이 생기면 `styles.css` 하단의 `html[data-site]` 블록만 늘립니다.

---

## 2. 타이포그래피

- **서체**: `Pretendard Variable`(CDN), 폴백 `Apple SD Gothic Neo / Noto Sans KR / system-ui`.
- **본문 기본**: 17px / line-height 1.72 / letter-spacing −0.01em, 색 `--body`.
- **제목**: `color:--ink`, line-height 1.25, letter-spacing −0.025em, weight 700~800.

| 클래스 | 크기(clamp) | weight | 용도 |
|---|---|---|---|
| `.h-display` | 38–64px | 800 | 큰 히어로 타이틀 |
| `.h1` | 32–46px | 800 | 페이지 대표 제목 |
| `.h2` | 26–36px | 800 | 섹션 제목 |
| `.h3` | 21px | 700 | 카드/블록 제목 |
| `.lead` | 18–21px | — | 도입 문단(색 `--body`) |
| `.eyebrow` | 13px | 700 | 섹션 라벨(대문자, letter-spacing .14em, 앞에 짧은 막대). `.eyebrow--center`로 중앙정렬 |
| `.kicker` | 15px | 600 | 보조 라벨 |

숫자 강조에는 `.stat .n`(34–46px, 800, `font-feature-settings:"tnum"`)을 사용.

---

## 3. 레이아웃 · 간격

- **컨테이너**: `.container` = `max-width:1200px`(`--container`), 좌우 패딩 28px(모바일 20px).
- **섹션 패딩**: `.section` 104px(상하) / `.section--tight` 72px.
- **섹션 배경**: `--tint`(brand-tint) · `--soft`(brand-soft) · `--cream` · `--paper` · `--deep`(green-800, 글자 흰색). 섹션을 번갈아 칠해 리듬을 만듭니다.
- **그리드**: `.grid` + `.grid-2/3/4` (gap 26px). 반응형은 980px에서 3·4→2열, 680px에서 1열.
- **섹션 헤더**: `.section-head`(margin-bottom 54px), 내부 `.eyebrow`→`.h2`→`p` 순.
- 정렬 유틸: `.center` · `.maxw`(720) · `.maxw-sm`(560) · `.mx-auto`.

---

## 4. 모양 토큰 (반경 · 그림자 · 모션)

- **반경**: `--radius-sm`10 · `--radius`16 · `--radius-lg`24 · `--radius-xl`34 · 알약형은 `999px`.
- **그림자**: `--shadow-sm`(은은) · `--shadow`(카드 hover) · `--shadow-lg`(모달·플로팅).
- **이징**: `--ease` = `cubic-bezier(.22,.61,.36,1)`. 전환은 보통 `.2~.3s var(--ease)`.
- **hover 관용구**: 카드·버튼은 `transform:translateY(-2~-4px)` + 그림자 강화.
- **등장 애니메이션**: `.reveal` 요소가 뷰포트 진입 시 `.in`이 붙어 `riseIn`(translateY 18→0). 콘텐츠를 절대 가리지 않도록 기본 상태는 항상 보이게 설계됨. 동적 렌더 후 `window.__revealRescan()` 호출.
- `prefers-reduced-motion`을 존중(마퀴·reveal 모두 모션 축소 시 정지/비활성).

---

## 5. 컴포넌트

### 버튼 `.btn`
알약형(999px), weight 700, gap 9px, `--ease` 전환. 변형:
- `.btn-primary` — 그린 채움(주요 행동). hover 시 brand-deep + 상승.
- `.btn-accent` — 앰버 채움(후원/CTA 전용). 글자색 `#3c2606`.
- `.btn-outline` — 투명+보더, 보조 행동.
- `.btn-ghost` — 흰 배경+옅은 보더+`--shadow-sm`.
- `.btn-white` — 어두운 배경 위 흰 버튼.
- 크기: 기본 / `.btn-lg`(17px). 묶음은 `.btn-row`(gap 14, wrap).
- 텍스트 링크는 `.link`(그린, 화살표 svg는 hover 시 `translateX(4px)` — `.arrow`).

### 칩 · 배지
- `.chip` — 알약 보더 칩(흰 배경). `.chip--soft`는 brand-soft 배경. 페이지 히어로 안에서는 반투명 흰색으로 자동 변형.
- `.badge` — 작은 상태 배지(brand-soft). `.badge--amber`.
- 게시판 태그 `.tag-pill` — `.notice`(그린) / `.news`(앰버) / `.press`(보라 `#5b3fa0`).

### 카드 `.card`
흰 배경, 보더 `--line`, 반경 `--radius-lg`, `--shadow-sm`. hover 시 `--shadow-lg` + 상승 + 보더 green-200. 패딩 헬퍼 `.card-pad`(30) / `.card-pad-lg`(38).

### 아이콘 박스
- `.icon-badge` 56×56(반경16, brand-soft, svg 28). `.icon-badge--amber`.
- `.num-badge` 46×46(brand 채움, 흰 숫자) — 단계/순번 표기.
- 인라인 SVG는 **stroke 스타일**(`fill:none; stroke:currentColor; stroke-width:2; round cap/join`), viewBox `0 0 24 24` 기준.

### 미디어 플레이스홀더 (사진 대체)
- `.media` — 그린 그라데이션 + soft-light 블롭 + 점 패턴 오버레이. 변형 `.media-2/3/4`. 라벨은 `.media-tag`.
- 갤러리 타일 `.tile`(gallery.html)도 같은 결의 `.ph` 그라데이션(`g1~g5`)을 사용. 실제 사진으로 교체 예정.

### 페이지 히어로 `.page-hero` (하위 페이지 상단)
green-700→600 그라데이션 배경 + 방사형 오버레이, 글자 흰색. 내부: `.crumb`(브레드크럼) → `h1` → `p` → `.pills`(반투명 칩, 실제 링크로 연결).

### 폼 `.field`
라벨(700, `--ink`) + 입력(보더 `--line-strong`, 반경 12, 16px). 포커스 시 `--brand` 보더 + `--brand-soft` 4px 링. 필수 표시는 라벨 안 `.req`(앰버 `*`). 2열 배치는 `.form-grid`. textarea 최소 130px.
- 제출 동작은 site.js가 처리: 필수(`.req`) 검증 → "접수 완료" 모달. 이메일 등은 브라우저 기본 검증도 함께 동작.

### 표 · 타임라인 · 통계
- `.dl` — 정의형 표(좌측 라벨 brand-tint). 운영현황 등.
- `.timeline`/`.tl-year`/`.tl-item` — 좌측 연도 sticky, 점+세로선 연혁.
- `.stat .n/.l` — 숫자 강조 + 라벨.

### 게시판 `.board` (notice.html)
상단 2px 잉크 라인, 행 `.board-row`(번호 64 / 제목 1fr / 날짜 130). hover 시 brand-tint. 공지 고정행 `.is-notice`(번호 자리에 확성기 아이콘, 번호색 brand). 행 전체 클릭 가능(cursor pointer) → 상세 모달. 빈 상태 `.board-empty`.

### 모달 `.modal` / `.modal-card`
중앙 정렬 오버레이(z-index 300), 배경 `rgba(16,49,33,.5)`+블러. 카드 반경 `--radius-xl`, `mpop` 등장. `.lg`는 max-width 620. 닫기 `.m-close`(우상단), 제목 `.m-title`(24/800), 부제 `.m-sub`. 오류 박스 `.form-err`(`.show`로 표시). 액션 줄 `.modal-actions`(버튼 균등). ESC·배경 클릭으로 닫힘.
- 용도: 로그인 / 글쓰기 / 게시글 상세 / 폼 접수 완료 / 갤러리 라이트박스 — 전부 동일 컴포넌트 재사용.

### 계정 컨트롤 (헤더)
로그아웃 상태: `.btn-login`(흰 알약). 로그인 상태: `.acct-name`(brand-soft 알약, 사람 아이콘 + "관리자") + 로그아웃 버튼. 좁은 폭(≤520px)에서는 라벨 텍스트 숨김.

### 진입 게이트 `.gate` (첫 방문 시 index.html)

전체화면 `position:fixed` 오버레이(z-index 400). **`site.js`가 주입**하며 HTML에 직접 쓰지 않습니다.

- `.gate-half` 두 장을 `flex:1`로 나란히 → **좌 50% 조합(그린 그라데이션) / 우 50% 직업재활센터(오션 블루 그라데이션)**. 각 면은 `<a>`이므로 키보드로 도달·선택 가능합니다.
- hover / `:focus-visible` 시 해당 면이 `flex:1.12`로 넓어지고 라벨이 밝아집니다(`--ease`, .45s).
- 내부 구조: 마크 → `.gate-name`(clamp 22–38px, 800) → `.gate-desc` → `.gate-go`(알약 버튼 모양 라벨).
- 상단에 `.gate-head`(로고 + "어느 곳을 찾으시나요?"), 하단에 `.gate-foot`(상단 바로 언제든 이동 가능하다는 안내).
- ≤760px에서 `flex-direction:column` → **상하 50/50** 분할, hover 확대 비활성.
- `prefers-reduced-motion` 시 확대·페이드 전환 없음.
- 선택하면 `.gate`에 `.out`이 붙어 페이드아웃 후 DOM에서 제거됩니다. 조합 선택은 제자리, 직업재활센터 선택은 `rehab.html`로 이동.

> ⚠️ 게이트는 **JS가 삽입**합니다. 절대 HTML에 정적으로 넣지 마세요. JS가 실패했을 때 콘텐츠를 영구히 가리게 됩니다.

### 사이트 전환 바 `.site-switch` (전 페이지 최상단 고정)

- `position:sticky; top:0; z-index:120`. 높이 **`clamp(38px, 5vh, 52px)`** — CSS 변수 `--switch-h`로 노출되며 `.site-header`의 `top`이 이 값을 참조합니다.
- 배경은 `--green-900` / `rehab`에서는 `#0d2c40`. 두 개의 `.sw-item`을 균등 분할.
- 현재 갈래에 `.on` — 배경이 `--brand`로 채워지고 글자가 흰색, 좌하단에 3px 하이라이트 바.
- 비활성 쪽은 반투명 흰색 텍스트, hover 시 밝아짐.
- ≤520px에서는 기관명을 축약형(`.sw-short`)으로 교체합니다(`조합` / `직업재활센터`).
- 스크린리더용으로 `<nav aria-label="사이트 선택">` + 현재 항목에 `aria-current="page"`.

### 파트너 로고 마퀴 (index.html)
`.logo-marquee`(overflow hidden + 양끝 페이드 mask) 안의 `.logo-track`이 `logo-scroll`로 끊김 없이 가로 무한 스크롤(38s linear, hover 시 일시정지). `.logo-item`은 흰 카드형 로고 슬롯(기본 grayscale, hover 시 컬러). 항목은 JS에서 셔플 후 2배 복제해 이음새 제거. **실제 로고는 `PARTNERS`에 `logo` 경로만 추가하면 `<img>`로 자동 표시**(`assets/logos/`).

---

## 6. 헤더 / 푸터 / 네비게이션

- **전부 [assets/site.js](../duri-website/assets/site.js)가 주입**합니다. 각 HTML에 직접 넣지 마세요. 메뉴는 `NAV` 배열로 관리.
- **최상단은 사이트 전환 바 `.site-switch`** 입니다. 헤더는 그 아래에 `top:var(--switch-h)`로 붙습니다. 헤더 `top`을 `0`으로 되돌리면 전환 바가 가려집니다.
- 헤더 `.site-header`: sticky, 반투명+블러 배경, 스크롤 시 `.scrolled`(흰 배경+보더). 높이 78px.
- `data-site="rehab"` 페이지에서는 헤더가 **메뉴 없는 축약형**(로고 + 계정 컨트롤)으로, 푸터는 간략형으로 주입됩니다. 직업재활센터 메뉴가 생기면 `site.js`의 `NAV_REHAB`를 채우면 됩니다.
- 메뉴 `.nav-top`(현재 페이지 `.active` → 그린 + 하단 밑줄), hover 시 메가드롭다운 `.mega`(흰 패널). 라벨은 **줄바꿈 금지**(`white-space:nowrap`).
- **반응형**: `max-width:1260px`에서 데스크탑 메뉴 → 버거(`.nav-burger`)+풀스크린 `.mobile-nav`로 전환. (로그인 계정 컨트롤까지 한 줄에 들어가도록 1080→1260으로 상향됨)
- 푸터 `.site-footer`: green-900 배경, 4열(브랜드/소개/사업·소식/함께하기).

---

## 7. 반응형 브레이크포인트(요약)

| 폭 | 변화 |
|---|---|
| ≤1260px | 데스크탑 네비 → 버거 메뉴 |
| ≤980px | grid-3/4 → 2열, dl 라벨 축소 |
| ≤880px | 히어로/일부 2열 → 1열, 갤러리 2열 |
| ≤760px | **진입 게이트가 좌우 → 상하 분할** |
| ≤680px | 대부분 1열, 본문 16px, 섹션 패딩 72px |
| ≤520px | 후원/계정 버튼 라벨 텍스트 숨김(아이콘만), **전환 바 기관명 축약** |

---

## 8. 자주 하는 실수 (하지 말 것)

- ❌ 색/간격 하드코딩 → ✅ `--브랜드/토큰` 변수 사용.
- ❌ 페이지에 헤더·푸터 마크업 직접 작성 → ✅ `site.js`가 주입.
- ❌ 앰버를 본문 전반에 남발 → ✅ 행동 유도 지점에만.
- ❌ 절대경로(`/assets/...`) → ✅ 상대경로(GitHub Pages `/Duri/` 하위 서빙).
- ❌ "디자인 옵션" 팔레트/히어로 토글 재도입 → ✅ leaf + split 고정 유지.
- ❌ 직업재활센터용 컴포넌트 CSS를 따로 작성 → ✅ `html[data-site="rehab"]` **토큰 재정의만**.
- ❌ 게이트를 HTML에 정적으로 삽입 → ✅ `site.js`가 주입(JS 실패 시 콘텐츠가 영구히 가려짐).
- ❌ `.site-header{top:0}` 으로 되돌리기 → ✅ `top:var(--switch-h)` 유지(전환 바가 가려짐).
- ❌ 포커스 스타일 제거(`outline:none`만 남기기) → ✅ `:focus-visible` 표시를 반드시 남길 것.

---
© 사회적협동조합 두리손잡고
