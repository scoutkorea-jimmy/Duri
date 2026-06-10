# 두리손잡고 홈페이지

사회적협동조합 **두리손잡고** 공식 홈페이지 (정적 멀티페이지 사이트).
순수 HTML / CSS / JavaScript로 작성되어 별도 빌드 과정 없이 바로 실행됩니다.

## 실행 방법 (Visual Studio Code)

빌드 도구가 필요 없습니다. 아래 중 편한 방법을 쓰세요.

1. **Live Server 확장** (권장)
   - VS Code 확장에서 `Live Server` 설치
   - `index.html` 우클릭 → **Open with Live Server**
2. 또는 로컬 서버 직접 실행
   ```bash
   # Python
   python -m http.server 5500
   # Node
   npx serve .
   ```
   브라우저에서 `http://localhost:5500` 접속

> `file://` 로 그냥 열어도 동작하지만, 공유 헤더/푸터가 JS로 주입되므로 로컬 서버 실행을 권장합니다.

## 폴더 구조

```
.
├─ index.html            메인 홈
├─ about.html            소개 - 인사말 / 주요사업
├─ operation.html        소개 - 운영현황 (시설·설비·오시는 길)  ※ #location
├─ org.html              소개 - 조직도
├─ business.html         소개 - 사업안내 및 비전
├─ history.html          소개 - 연혁 (타임라인)
├─ work.html             사업안내 - 임가공 사업 / 생산공정  ※ #process
├─ products.html         사업안내 - 두리손잡고 화장지 / 친환경 인증  ※ #cert
├─ notice.html           소식 - 공지사항 게시판
├─ gallery.html          소식 - 사진갤러리
├─ family.html           가족되기 - 후원·가족되기  ※ #donate
├─ internship.html       가족되기 - 실습 신청하기
├─ volunteer.html        가족되기 - 자원봉사 신청하기
├─ market.html           두리손잡고 마켓
└─ assets/
   ├─ styles.css         디자인 시스템 (전 페이지 공유)
   └─ site.js            헤더(메가메뉴)·푸터·스크롤 인터랙션 (전 페이지 공유)
```

## 디자인 시스템

- **서체**: Pretendard (CDN). 오프라인 배포 시 로컬 폰트로 교체 권장.
- **컬러**: `assets/styles.css` 상단 `:root` 의 CSS 변수로 일괄 관리.
  - 핵심 토큰: `--brand`, `--brand-deep`, `--brand-soft`, `--brand-tint`, `--accent`
- **팔레트**: 현재 **leaf 팔레트 · split 히어로로 고정**되어 있습니다. (구 "디자인 옵션" 토글은 제거됨)
- **게시판/로그인**: 공지사항 게시판 글 작성은 관리자 로그인(임시 계정 `admin`/`admin`) 후 가능하며, 데이터는 브라우저 `localStorage` 에 저장됩니다. 자세한 내용은 [GUIDE.md](GUIDE.md) 참고.

## 헤더 / 푸터 수정

메뉴 구성, 연락처, 푸터 링크는 모두 `assets/site.js` 상단의 `NAV` 배열과 footer HTML에서 한 곳에서 관리합니다.

## 교체가 필요한 항목 (기획안 기준)

- 로고: 현재 '두리손잡고' 텍스트 워드마크 (추후 실제 로고 교체)
- 이미지: 그린 추상 배경 자리 → 실제 사진 (`.media` / `.tile` / `.hero-panel` 요소)
- 인증서류 이미지 (`products.html #cert`)
- 후원 계좌번호, 실습비 등 미정 수치
- 공지사항·갤러리·조직도의 예시 콘텐츠

---
© 2026 사회적협동조합 두리손잡고
