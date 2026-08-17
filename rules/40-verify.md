# 40 · 검증과 배포 확인

> 커밋 전에 읽습니다. **이 절차를 거치지 않은 푸시는 금지**([00-core.md](00-core.md) 절대 규칙 6).

---

## 1. 로컬 실행

```bash
python3 -m http.server 5599 --directory duri-website
# → http://localhost:5599
```

`file://`로 열지 마세요. 상대경로·localStorage 동작이 실제 배포와 달라집니다.

---

## 2. 링크·앵커·리소스 정합성 검사 (필수 · 5초)

```bash
node tools/check-links.mjs
```

- 존재하지 않는 HTML 파일로 가는 `href`
- 존재하지 않는 `id`로 가는 `#앵커`
- 존재하지 않는 `src` 리소스
- `/`로 시작하는 절대경로(GitHub Pages에서 깨짐)
- `<img>`에 `alt` 누락

를 잡아냅니다. **한 건이라도 나오면 커밋하지 않습니다.**

---

## 3. 손으로 확인할 체크리스트

콘솔 에러가 **0**인 상태에서 아래를 확인합니다.

### 진입 게이트 / 사이트 전환
- [ ] `localStorage.clear()` 후 `index.html` 새로고침 → 전체화면 게이트가 좌우 50/50으로 뜬다
- [ ] 좌측(조합) 선택 → 게이트가 사라지고 조합 홈이 보인다. 새로고침해도 다시 뜨지 않는다
- [ ] 우측(직업재활센터) 선택 → `rehab.html`로 이동하고 화면이 **오션 블루**로 바뀐다
- [ ] 상단 전환 바로 두 갈래를 오갈 수 있다. 현재 갈래에 `.on` 표시가 붙는다
- [ ] 좁은 폭(≤760px)에서 게이트가 상하 분할로 바뀐다
- [ ] **키보드만으로** 게이트의 두 선택지에 모두 도달·선택 가능하다

### 게시판 (notice.html)
- [ ] 비로그인 상태: 글쓰기 버튼이 보이지 않는다
- [ ] `admin/admin` 로그인 → 글쓰기 버튼 등장 → 글 작성 → 목록 최상단(고정 시) 반영
- [ ] 작성한 글 상세 → 삭제 동작. 시드 글(`s*`)에는 삭제 버튼이 없다
- [ ] 탭 전환 · 검색 · 페이지네이션이 각각 동작하고 개수 표시가 맞다
- [ ] 로그아웃 → 글쓰기 버튼이 즉시 사라진다

### 폼 (family / internship / volunteer / market)
- [ ] 필수(`.req`) 항목을 비우고 제출 → 오류 박스 표시 + 해당 필드로 스크롤·포커스
- [ ] 전부 채우고 제출 → "접수 완료" 모달, 폼 리셋
- [ ] ESC·배경 클릭으로 모달이 닫힌다

### 그 외
- [ ] 갤러리 필터 5종 + 타일 클릭 라이트박스
- [ ] 헤더 반응형: 1260px 이하에서 버거 메뉴로 전환, 열고 닫힘, 스크롤 잠금
- [ ] 파트너 로고 마퀴가 이음새 없이 흐르고 hover 시 멈춘다
- [ ] `prefers-reduced-motion` 켠 상태에서 마퀴·reveal이 멈추고 **콘텐츠가 가려지지 않는다**
- [ ] 모든 `.reveal` 요소가 결국 보인다(1.4초 안전망)

---

## 4. 헤드리스 검증 (기능을 바꿨으면 필수 · 40건 자동 검사)

`tools/verify-headless.mjs`가 위 체크리스트의 핵심을 자동으로 확인합니다.
설치된 Google Chrome + `puppeteer-core`를 씁니다.

```bash
# 1) 준비 — 저장소 밖에 설치하고 심볼릭 링크만 건다
#    (ESM import 는 NODE_PATH 를 무시하고 스크립트 위치에서 위로 올라가며 찾는다)
cd /tmp && npm i puppeteer-core
cd <저장소> && ln -sfn /tmp/node_modules node_modules   # node_modules/ 는 .gitignore 됨

# 2) 로컬 서버 + 검증
python3 -m http.server 5599 --directory duri-website &
node tools/verify-headless.mjs
```

검사 항목: 진입 게이트(표시·50/50 분할·전체화면·키보드 포커스·모바일 상하 분할) · 선택 저장과 재방문 미노출 · `rehab.html` 이동과 오션 블루 실렌더색 · 전환 바(높이·최상단·헤더 겹침·균등 분할·`aria-current`·6페이지 존재) · 셀렉트 포커스 링 · 키보드 메가메뉴 · `:focus-visible` · 게시판 로그인→글쓰기→삭제 · 폼 필수 검증 · **전 구간 콘솔 에러 0**.

판정 기준: **`실패 0`** 으로 끝나야 합니다. 마지막 줄에 `총 N건 · 통과 N · 실패 0`이 찍힙니다.

⚠️ 스크립트가 새 기능을 커버하지 못하면 **스크립트를 먼저 늘린 뒤** 커밋하세요. 검사 항목이 없는 기능은 "검증됨"이 아닙니다.

---

## 5. 배포 확인

```bash
git push origin main
gh run list --limit 3          # 최상단이 completed / success 인지
gh run watch                   # 진행 중이면
```

- 라이브: https://scoutkorea-jimmy.github.io/Duri/
- 캐시 때문에 즉시 반영되지 않을 수 있습니다. 강력 새로고침(⌘⇧R) 후 확인.
- 실패 시: `gh run view --log-failed`
- 상태 페이지: 저장소 **Actions** 탭, **Settings → Pages**(소스가 GitHub Actions여야 함)

---

## 6. 마지막 단계

배포 성공을 확인한 뒤 **[WORKLOG.md](WORKLOG.md)에 결과와 사유를 기록**합니다. 이걸 안 하면 작업은 미완입니다.

---
© 사회적협동조합 두리손잡고
