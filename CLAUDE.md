# Duri 저장소 — 작업 시작 전 필수 규칙

## ⚠️ 가장 먼저 할 일 (MANDATORY)

이 저장소에서 **어떤 코드도 읽거나 수정하기 전에, 반드시 [duri-website/GUIDE.md](duri-website/GUIDE.md)를 먼저 읽으세요.**
그 가이드에 프로젝트 구조·제약·디자인 규칙·게시판/인증 동작·배포 방법이 모두 정리되어 있습니다.
가이드를 읽지 않고 추측으로 수정하면 화면 주입 구조(헤더/푸터)나 배포가 깨질 수 있습니다.

## 30초 요약 (자세한 내용은 GUIDE.md)

- **정적 사이트**: 순수 HTML/CSS/JS. 빌드 도구·프레임워크 도입 금지. 사이트 루트는 `duri-website/`.
- **헤더·푸터·메뉴·인증·모달·폼**은 전부 `duri-website/assets/site.js`가 주입/처리. 각 HTML에 직접 넣지 말 것.
- **공지 게시판**은 `duri-website/assets/board.js` (localStorage 기반).
- **관리자(데모)**: `admin / admin` — 클라이언트 사이드 게이트일 뿐 실제 보안 아님.
- **디자인 고정**: leaf 팔레트 + split 히어로. "디자인 옵션" 토글은 제거됨, 되살리지 말 것.
- **경로는 상대경로만** (GitHub Pages가 `/Duri/` 하위로 서빙).
- **배포**: `main` 푸시 → GitHub Actions → https://scoutkorea-jimmy.github.io/Duri/
- 기능 변경 후에는 로컬 서버(`python3 -m http.server 5599 --directory duri-website`)로 검증 후 커밋·푸시.
- **표준 작업 흐름(사용자 요구)**: 작업이 끝나면 **별도 지시가 없어도 항상 `main`에 커밋·푸시하고 배포까지 완료**하세요. 배포 성공과 라이브 URL 반영을 확인합니다.

> 위 요약과 GUIDE.md가 충돌하면 GUIDE.md가 우선입니다.
