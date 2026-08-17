#!/usr/bin/env node
/* ============================================================
   두리손잡고 — 헤드리스 기능 검증 (개발용, 배포 산출물 아님)
   준비:  cd /tmp && npm i puppeteer-core
   실행:  python3 -m http.server 5599 --directory duri-website &
          NODE_PATH=/tmp/node_modules node tools/verify-headless.mjs
   검사: 진입 게이트 / 사이트 전환 바 / rehab 테마 / 접근성 버그 2건
         / 게시판 로그인·글쓰기·삭제 / 폼 검증 / 콘솔 에러 0
   ============================================================ */
import puppeteer from "puppeteer-core";

const BASE = "http://localhost:5599";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const results = [];
const ok = (n, pass, extra = "") => {
  results.push({ n, pass, extra });
  console.log((pass ? "PASS " : "FAIL ") + n + (extra ? "   — " + extra : ""));
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "shell", args: ["--no-sandbox"] });

async function fresh(path = "/index.html", w = 1440, h = 900) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h });
  const errors = [];
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });
  await page.goto(BASE + path, { waitUntil: "networkidle2" });
  return { page, errors };
}

/* ---------- 1. 첫 방문 게이트 ---------- */
{
  const { page, errors } = await fresh("/index.html");
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle2" });
  const g = await page.evaluate(() => {
    const gate = document.querySelector(".gate");
    if (!gate) return null;
    const halves = [...gate.querySelectorAll(".gate-half")];
    const r = halves.map(h => h.getBoundingClientRect());
    return {
      count: halves.length,
      widths: r.map(x => Math.round(x.width)),
      full: Math.round(r[0].height) >= window.innerHeight - 2,
      classes: halves.map(h => h.className),
      names: halves.map(h => h.querySelector(".gate-name").textContent),
      hrefs: halves.map(h => h.getAttribute("href")),
      vw: window.innerWidth,
      focused: document.activeElement && document.activeElement.className
    };
  });
  ok("게이트: 첫 방문 시 표시", !!g);
  ok("게이트: 좌우 2분할 50/50", g && g.count === 2 && Math.abs(g.widths[0] - g.widths[1]) <= 1 && Math.abs(g.widths[0] - g.vw / 2) <= 1, g && `폭 ${g.widths} / 뷰포트 ${g.vw}`);
  ok("게이트: 전체화면 높이", g && g.full);
  ok("게이트: 좌=조합 / 우=직업재활센터", g && /사회적협동조합/.test(g.names[0]) && /직업재활센터/.test(g.names[1]) && g.hrefs[1] === "rehab.html", g && g.hrefs.join(" | "));
  ok("게이트: 진입 시 첫 선택지에 포커스(키보드 접근)", g && /gate-half/.test(g.focused || ""), g && `activeElement=${g.focused}`);
  ok("게이트 페이지: 콘솔 에러 0", errors.length === 0, errors.join(" / "));
  await page.close();
}

/* ---------- 2. 좌측(조합) 선택 → 게이트 소멸 + 재방문 미노출 ---------- */
{
  const { page, errors } = await fresh("/index.html");
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle2" });
  await page.evaluate(() => document.querySelector(".gate-half.coop").click());
  await new Promise(r => setTimeout(r, 500));
  const after = await page.evaluate(() => ({
    gate: !!document.querySelector(".gate"),
    stored: localStorage.getItem("duri.site.v1"),
    overflow: document.body.style.overflow
  }));
  ok("조합 선택: 게이트 DOM 제거", after.gate === false);
  ok("조합 선택: localStorage 에 coop 저장", after.stored === "coop", `저장값=${after.stored}`);
  ok("조합 선택: 스크롤 잠금 해제", after.overflow === "", `overflow="${after.overflow}"`);
  await page.reload({ waitUntil: "networkidle2" });
  const revisit = await page.evaluate(() => !!document.querySelector(".gate"));
  ok("재방문: 게이트 다시 뜨지 않음", revisit === false);
  ok("조합 홈: 콘솔 에러 0", errors.length === 0, errors.join(" / "));
  await page.close();
}

/* ---------- 3. 우측(직업재활센터) 선택 → rehab.html 이동 + 오션 블루 ---------- */
{
  const { page, errors } = await fresh("/index.html");
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle2" });
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2" }),
    page.click(".gate-half.rehab")
  ]);
  const r = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    return {
      url: location.pathname,
      site: document.documentElement.getAttribute("data-site"),
      brand: cs.getPropertyValue("--brand").trim(),
      brandDeep: cs.getPropertyValue("--brand-deep").trim(),
      stored: localStorage.getItem("duri.site.v1"),
      nav: !!document.querySelector(".nav-main"),
      donate: !!document.querySelector('.nav-cta a[href="family.html"]'),
      switchOn: (document.querySelector(".site-switch .sw-item.on") || {}).textContent,
      footerBg: getComputedStyle(document.querySelector(".site-footer")).backgroundColor,
      primaryBg: getComputedStyle(document.querySelector(".btn-primary")).backgroundColor
    };
  });
  ok("직업재활센터 선택: rehab.html 로 이동", /rehab\.html$/.test(r.url), r.url);
  ok("직업재활센터 선택: localStorage 에 rehab 저장", r.stored === "rehab", `저장값=${r.stored}`);
  ok("rehab: --brand 가 오션 블루로 계산", /#1f6f9e/i.test(r.brand) || r.brand === "var(--blue-600)", `--brand=${r.brand} / 버튼 실제색=${r.primaryBg}`);
  ok("rehab: 프라이머리 버튼 실제 렌더색 = rgb(31,111,158)", r.primaryBg.replace(/\s/g, "") === "rgb(31,111,158)", r.primaryBg);
  ok("rehab: 푸터가 블루 딥으로 렌더", r.footerBg.replace(/\s/g, "") === "rgb(13,44,64)", r.footerBg);
  ok("rehab: 조합 메뉴 미주입", r.nav === false);
  ok("rehab: 후원 버튼 미주입", r.donate === false);
  ok("rehab: 전환 바 활성 항목이 직업재활센터", /직업재활센터/.test(r.switchOn || ""), r.switchOn);
  ok("rehab: 콘솔 에러 0", errors.length === 0, errors.join(" / "));
  await page.close();
}

/* ---------- 3-1. 선택 후 게이트로 되돌아가기 ---------- */
{
  // (a) 홈이 아닌 페이지: 푸터 링크가 index.html?gate=1 로 향한다
  const { page, errors } = await fresh("/about.html");
  await page.evaluate(() => localStorage.setItem("duri.site.v1", "coop"));
  await page.reload({ waitUntil: "networkidle2" });
  const link = await page.evaluate(() => {
    const a = document.getElementById("reopenGate");
    if (!a) return null;
    const r = a.getBoundingClientRect();
    return { href: a.getAttribute("href"), text: a.textContent.trim(), h: Math.round(r.height) };
  });
  ok("되돌아가기: 하위 페이지 푸터에 '처음 선택 화면 다시 보기' 링크", !!link && /gate=1/.test(link.href),
    link ? `${link.text} → ${link.href} (h=${link.h})` : "없음");
  ok("되돌아가기: 링크 터치 타깃 44px 이상", !!link && link.h >= 43.5, link ? `${link.h}px` : "");
  ok("되돌아가기 링크 페이지: 콘솔 에러 0", errors.length === 0, errors.join(" / "));
  await page.close();
}
{
  // (b) 선택이 이미 있는 상태에서 ?gate=1 로 들어가면 게이트가 다시 뜨고, 닫을 수 있다
  const { page, errors } = await fresh("/index.html");
  await page.evaluate(() => localStorage.setItem("duri.site.v1", "coop"));
  await page.goto(BASE + "/index.html?gate=1", { waitUntil: "networkidle2" });
  const r = await page.evaluate(() => ({
    gate: !!document.querySelector(".gate"),
    close: !!document.getElementById("gateClose"),
    stored: localStorage.getItem("duri.site.v1")
  }));
  ok("되돌아가기: 선택이 있어도 ?gate=1 로 게이트 재노출", r.gate, `저장값 유지=${r.stored}`);
  ok("되돌아가기: 재노출된 게이트에 닫기 버튼 존재", r.close);
  const closed = await page.evaluate(async () => {
    document.getElementById("gateClose").click();
    await new Promise(r => setTimeout(r, 250));
    return { gate: !!document.querySelector(".gate"), overflow: document.body.style.overflow,
             stored: localStorage.getItem("duri.site.v1") };
  });
  ok("되돌아가기: 닫기 버튼으로 닫히고 기존 선택이 유지됨",
    closed.gate === false && closed.overflow === "" && closed.stored === "coop",
    `게이트=${closed.gate} overflow="${closed.overflow}" 저장값=${closed.stored}`);
  ok("되돌아가기: 재노출 게이트 콘솔 에러 0", errors.length === 0, errors.join(" / "));
  await page.close();
}
{
  // (c) 홈에서 푸터 링크를 누르면 이동 없이 바로 열리고, 고르면 주소창의 ?gate=1 이 정리된다
  const { page } = await fresh("/index.html");
  await page.evaluate(() => localStorage.setItem("duri.site.v1", "coop"));
  await page.reload({ waitUntil: "networkidle2" });
  const inline = await page.evaluate(async () => {
    document.getElementById("reopenGate").click();
    await new Promise(r => setTimeout(r, 250));
    return { gate: !!document.querySelector(".gate"), url: location.pathname + location.search };
  });
  ok("되돌아가기: 홈에서는 페이지 이동 없이 즉시 열림",
    inline.gate && !/gate=1/.test(inline.url), `${inline.url}`);
  await page.goto(BASE + "/index.html?gate=1", { waitUntil: "networkidle2" });
  const cleaned = await page.evaluate(async () => {
    document.querySelector(".gate-half.coop").click();
    await new Promise(r => setTimeout(r, 300));
    return location.search;
  });
  ok("되돌아가기: 선택 후 주소창의 ?gate=1 정리", cleaned === "", `search="${cleaned}"`);
  await page.close();
}
{
  // (d) 첫 방문 게이트에는 닫기 버튼이 없다(선택 자체가 진행 경로)
  const { page } = await fresh("/index.html");
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle2" });
  const r = await page.evaluate(() => ({
    gate: !!document.querySelector(".gate"), close: !!document.getElementById("gateClose")
  }));
  ok("첫 방문 게이트에는 닫기 버튼 없음", r.gate && r.close === false, `닫기버튼=${r.close}`);
  await page.close();
}

/* ---------- 4. 전환 바 — 전 페이지 존재 / 높이 / 헤더 겹침 ---------- */
{
  const pages = ["/index.html", "/about.html", "/notice.html", "/gallery.html", "/market.html", "/rehab.html"];
  let allPresent = true, detail = [];
  for (const p of pages) {
    const { page } = await fresh(p);
    await page.evaluate(() => localStorage.setItem("duri.site.v1", "coop"));
    await page.reload({ waitUntil: "networkidle2" });
    const s = await page.evaluate(() => {
      const sw = document.querySelector(".site-switch");
      if (!sw) return null;
      const sr = sw.getBoundingClientRect();
      const hd = document.querySelector(".site-header").getBoundingClientRect();
      const items = [...sw.querySelectorAll(".sw-item")].map(a => Math.round(a.getBoundingClientRect().width));
      return {
        h: Math.round(sr.height), top: Math.round(sr.top),
        headerTop: Math.round(hd.top), items,
        onCount: sw.querySelectorAll(".sw-item.on").length,
        ariaCurrent: sw.querySelectorAll('[aria-current="page"]').length,
        firstEl: document.body.firstElementChild.className,
        secondEl: document.body.children[1] ? document.body.children[1].className : ""
      };
    });
    if (!s) { allPresent = false; detail.push(`${p}: 없음`); }
    else detail.push(`${p}: h=${s.h} headerTop=${s.headerTop} on=${s.onCount} 첫요소=${s.firstEl}`);
    if (s && p === "/index.html") {
      ok("전환 바: 높이가 5vh 구간(38~52px)", s.h >= 38 && s.h <= 52, `${s.h}px @900h`);
      // KWCAG 6.4.1 에 따라 body 최상단은 건너뛰기 링크이고, 전환 바가 그 다음이다
      ok("전환 바: 건너뛰기 링크 다음(문서 최상단 영역)에 위치",
        /skip-nav/.test(s.firstEl) && /site-switch/.test(s.secondEl), `1st=${s.firstEl} 2nd=${s.secondEl}`);
      ok("전환 바: 헤더가 바 아래에 붙음(겹침 없음)", s.headerTop >= s.h - 1, `headerTop=${s.headerTop} barH=${s.h}`);
      ok("전환 바: 두 항목 균등 분할", Math.abs(s.items[0] - s.items[1]) <= 1, `${s.items}`);
      ok("전환 바: 현재 갈래 1개만 활성 + aria-current", s.onCount === 1 && s.ariaCurrent === 1, `on=${s.onCount} aria=${s.ariaCurrent}`);
    }
    await page.close();
  }
  ok("전환 바: 검사한 6개 페이지 전부 존재", allPresent, detail.join(" | "));
}

/* ---------- 5. 버그 수정 검증 — select 포커스 링 / 키보드 메가메뉴 ---------- */
{
  const { page } = await fresh("/market.html");
  await page.evaluate(() => localStorage.setItem("duri.site.v1", "coop"));
  await page.reload({ waitUntil: "networkidle2" });
  const sel = await page.evaluate(() => {
    const s = document.querySelector(".field select");
    if (!s) return null;
    const base = getComputedStyle(s).boxShadow;
    s.focus();
    const focused = getComputedStyle(s).boxShadow;
    return { base, focused, count: document.querySelectorAll(".field select").length };
  });
  ok("버그A: 셀렉트 기본 상태에 포커스 링 없음", sel && sel.base === "none", sel && `기본 box-shadow="${sel.base}"`);
  ok("버그A: 셀렉트 포커스 시에만 링 표시", sel && sel.focused !== "none", sel && `포커스 box-shadow="${sel.focused}"`);
  await page.close();
}
{
  const { page } = await fresh("/about.html");
  await page.evaluate(() => localStorage.setItem("duri.site.v1", "coop"));
  await page.reload({ waitUntil: "networkidle2" });
  const mega = await page.evaluate(async () => {
    const item = document.querySelector(".nav-item");
    const m = item.querySelector(".mega");
    const before = getComputedStyle(m).visibility;
    item.querySelector(".nav-top").focus();
    await new Promise(r => setTimeout(r, 400));
    const afterTop = getComputedStyle(m).visibility;
    m.querySelector("a").focus();
    await new Promise(r => setTimeout(r, 400));
    const afterInner = getComputedStyle(m).visibility;
    return { before, afterTop, afterInner };
  });
  ok("버그B: 포커스 전에는 메가메뉴 숨김", mega.before === "hidden", mega.before);
  ok("버그B: 키보드 포커스로 메가메뉴 열림", mega.afterTop === "visible" && mega.afterInner === "visible", `상단링크=${mega.afterTop} 내부링크=${mega.afterInner}`);
  const fv = await page.evaluate(() => {
    const a = document.querySelector(".nav-top");
    a.focus();
    return getComputedStyle(a).outlineWidth;
  });
  ok("포커스 표시(:focus-visible) 스타일 존재", fv !== "0px", `outline-width=${fv}`);
  await page.close();
}

/* ---------- 6. 게이트 반응형 (≤760px 상하 분할) ---------- */
{
  const { page } = await fresh("/index.html", 390, 780);
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle2" });
  const m = await page.evaluate(() => {
    const halves = [...document.querySelectorAll(".gate-half")].map(h => h.getBoundingClientRect());
    return { w: halves.map(r => Math.round(r.width)), h: halves.map(r => Math.round(r.height)), vw: window.innerWidth };
  });
  ok("게이트 모바일: 상하 50/50 분할", m.w[0] === m.vw && m.w[1] === m.vw && Math.abs(m.h[0] - m.h[1]) <= 1, `폭 ${m.w} 높이 ${m.h} vw=${m.vw}`);
  await page.close();
}

/* ---------- 7. 게시판 회귀 (로그인 → 글쓰기 → 삭제) ---------- */
{
  const { page, errors } = await fresh("/notice.html");
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem("duri.site.v1", "coop"); });
  await page.reload({ waitUntil: "networkidle2" });
  const hidden = await page.evaluate(() => getComputedStyle(document.getElementById("writeBtn")).display);
  ok("게시판: 비로그인 시 글쓰기 버튼 숨김", hidden === "none", hidden);

  await page.evaluate(() => document.getElementById("loginBtn").click());
  await new Promise(r => setTimeout(r, 350));
  await page.type("#loginId", "admin");
  await page.type("#loginPw", "admin");
  await page.evaluate(() => document.querySelector("#loginForm button[type=submit]").click());
  await new Promise(r => setTimeout(r, 500));
  const shown = await page.evaluate(() => getComputedStyle(document.getElementById("writeBtn")).display);
  ok("게시판: 로그인 후 글쓰기 버튼 노출", shown !== "none", shown);

  await page.evaluate(() => document.getElementById("writeBtn").click());
  await new Promise(r => setTimeout(r, 350));
  await page.type("#wTitle", "검증용 임시 글");
  await page.type("#wBody", "헤드리스 검증 본문");
  await page.evaluate(() => document.querySelector("#writeForm button[type=submit]").click());
  await new Promise(r => setTimeout(r, 500));
  // 고정(공지) 시드 글이 위에 있으므로 첫 행이 아니라 목록 전체에서 찾는다
  const added = await page.evaluate(() => {
    const rows = [...document.querySelectorAll(".board-row")];
    const hit = rows.findIndex(r => /검증용 임시 글/.test(r.textContent));
    return { hit, first: rows[0] ? rows[0].textContent.trim().slice(0, 40) : "" };
  });
  ok("게시판: 작성한 글이 목록 반영", added.hit >= 0, `행 index=${added.hit} (첫 행은 고정글: ${added.first})`);

  await page.evaluate(() => {
    [...document.querySelectorAll(".board-row")].find(r => /검증용 임시 글/.test(r.textContent)).click();
  });
  await new Promise(r => setTimeout(r, 500));
  const hasDel = await page.evaluate(() => !!document.getElementById("delPost"));
  ok("게시판: 사용자 글에 삭제 버튼 존재", hasDel);
  page.on("dialog", d => d.accept());
  await page.evaluate(() => document.getElementById("delPost").click());
  await new Promise(r => setTimeout(r, 300));
  const gone = await page.evaluate(() => !/검증용 임시 글/.test(document.getElementById("board").textContent));
  ok("게시판: 삭제 반영", gone);
  ok("게시판: 콘솔 에러 0", errors.length === 0, errors.join(" / "));
  await page.close();
}

/* ---------- 8. 폼 회귀 (필수 검증 → 접수 완료) ---------- */
{
  const { page, errors } = await fresh("/volunteer.html");
  await page.evaluate(() => localStorage.setItem("duri.site.v1", "coop"));
  await page.reload({ waitUntil: "networkidle2" });
  await page.evaluate(() => document.querySelector("form").querySelector("button[type=submit], button:not([type])").click());
  await new Promise(r => setTimeout(r, 200));
  const errShown = await page.evaluate(() => !!document.querySelector("form .form-err.show"));
  ok("폼: 필수 미입력 시 오류 표시", errShown);
  ok("폼 페이지: 콘솔 에러 0", errors.length === 0, errors.join(" / "));
  await page.close();
}

await browser.close();

const fail = results.filter(r => !r.pass);
console.log("");
for (const r of results) console.log(`${r.pass ? "✅" : "❌"} ${r.n}${r.extra ? "   — " + r.extra : ""}`);
console.log(`\n총 ${results.length}건 · 통과 ${results.length - fail.length} · 실패 ${fail.length}`);
process.exit(fail.length ? 1 : 0);
