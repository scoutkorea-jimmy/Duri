#!/usr/bin/env node
/* ============================================================
   두리손잡고 — 국내 웹 접근성(KWCAG 2.2) 자동 검증
   개발용 스크립트. 배포 산출물(duri-website/)에 포함되지 않는다.

   준비:  cd /tmp && npm i puppeteer-core
          cd <저장소> && ln -sfn /tmp/node_modules node_modules
   실행:  python3 -m http.server 5599 --directory duri-website &
          node tools/verify-a11y.mjs

   자동으로 판정할 수 있는 항목만 검사한다. 스크린리더 실제 낭독,
   콘텐츠의 논리적 순서, 대체 텍스트의 '적절성' 같은 항목은
   사람이 확인해야 한다 — rules/40-verify.md 의 수동 체크리스트 참조.
   ============================================================ */
import puppeteer from "puppeteer-core";

const BASE = "http://localhost:5599";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PAGES = ["index", "about", "operation", "org", "business", "history", "work",
  "products", "notice", "gallery", "family", "internship", "volunteer", "market", "rehab"];

const results = [];
const ok = (item, name, pass, extra = "") => {
  results.push({ item, name, pass, extra });
  console.log(`${pass ? "PASS" : "FAIL"} [${item}] ${name}${extra ? "   — " + extra : ""}`);
};

/* ---------- 명도 대비 계산 ---------- */
function srgb(v) { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }
function parse(c) {
  const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
  if (!m) return null;
  return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
}
function over(fg, bg) { // 반투명 전경을 배경 위에 합성
  const a = fg.a;
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 };
}
function lum(c) { return 0.2126 * srgb(c.r) + 0.7152 * srgb(c.g) + 0.0722 * srgb(c.b); }
function contrast(fgStr, bgStr) {
  const f = parse(fgStr), b = parse(bgStr);
  if (!f || !b) return null;
  const fc = f.a < 1 ? over(f, b) : f;
  const l1 = lum(fc), l2 = lum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "shell", args: ["--no-sandbox"] });

async function load(name, opts = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width: opts.w || 1440, height: opts.h || 900 });
  const errors = [];
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });
  await page.goto(`${BASE}/${name}.html`, { waitUntil: "networkidle2" });
  await page.evaluate(() => localStorage.setItem("duri.site.v1", "coop"));
  await page.reload({ waitUntil: "networkidle2" });
  return { page, errors };
}

/* ============================================================
   5.1.1 적절한 대체 텍스트 — 장식 이미지/아이콘은 보조기기에서 숨긴다
   ============================================================ */
{
  const bad = [];
  for (const n of PAGES) {
    const { page } = await load(n);
    const r = await page.evaluate(() => {
      const out = { svg: 0, img: 0 };
      document.querySelectorAll("svg").forEach(s => {
        const named = s.getAttribute("aria-label") || s.getAttribute("role") === "img" ||
          s.querySelector("title");
        if (s.getAttribute("aria-hidden") !== "true" && !named) out.svg++;
      });
      document.querySelectorAll("img").forEach(i => { if (!i.hasAttribute("alt")) out.img++; });
      return out;
    });
    if (r.svg || r.img) bad.push(`${n}(svg ${r.svg}, img ${r.img})`);
    await page.close();
  }
  ok("5.1.1", "장식 SVG·이미지에 대체 텍스트 처리 누락 없음", bad.length === 0, bad.join(" "));
}

/* ============================================================
   5.2.1 색에 무관한 콘텐츠 인식 — 선택 상태를 색 외 수단으로도 전달
   ============================================================ */
{
  const { page } = await load("family");
  const r = await page.evaluate(() => {
    const g = document.querySelector(".amt-row");
    const btns = [...g.querySelectorAll("button")];
    return {
      role: g.getAttribute("role"),
      labelled: !!(g.getAttribute("aria-label") || g.getAttribute("aria-labelledby")),
      radios: btns.filter(b => b.getAttribute("role") === "radio").length,
      checked: btns.filter(b => b.getAttribute("aria-checked") === "true").length,
      total: btns.length
    };
  });
  ok("5.2.1", "후원 금액 버튼 그룹이 radiogroup + aria-checked 로 상태 전달",
    r.role === "radiogroup" && r.labelled && r.radios === r.total && r.checked === 1,
    `role=${r.role} 라벨=${r.labelled} radio ${r.radios}/${r.total} checked=${r.checked}`);
}
{
  const { page } = await load("notice");
  const r = await page.evaluate(() => {
    const t = [...document.querySelectorAll("#tabs .tab")];
    return { radios: t.filter(b => b.getAttribute("role") === "radio").length, total: t.length,
             checked: t.filter(b => b.getAttribute("aria-checked") === "true").length };
  });
  ok("5.2.1", "공지 분류 탭이 선택 상태를 aria-checked 로 전달",
    r.radios === r.total && r.checked === 1, `radio ${r.radios}/${r.total} checked=${r.checked}`);
}

/* ============================================================
   5.3.1 텍스트 콘텐츠의 명도 대비 — 일반 4.5:1, 큰 텍스트 3:1
   ============================================================ */
{
  const bad = [];
  const manual = new Set();
  for (const n of PAGES) {
    const { page } = await load(n);
    const found = await page.evaluate(() => {
      // 배경을 위로 훑어 '칠해진 색'을 찾는다.
      // 그라데이션·배경이미지를 만나면 색을 계산할 수 없으므로 unknown 으로 표시한다
      // (자동 판정 불가 → 사람이 확인. rules/40-verify.md 수동 체크리스트)
      // 배경을 위로 훑으며 반투명 레이어를 아래에서 위로 합성한다.
      // 그라데이션·배경이미지를 만나면 색을 계산할 수 없어 unknown 으로 표시한다
      // (자동 판정 불가 → 사람이 확인. rules/40-verify.md 수동 체크리스트)
      function bgOf(el) {
        const layers = [];   // [0] = 가장 위(요소 자신)
        let e = el, hitOpaque = false;
        while (e) {
          const cs = getComputedStyle(e);
          if (cs.backgroundImage && cs.backgroundImage !== "none") return { unknown: true };
          const m = cs.backgroundColor.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
          if (m) {
            const a = m[4] === undefined ? 1 : +m[4];
            if (a > 0) layers.push({ r: +m[1], g: +m[2], b: +m[3], a });
            if (a >= 0.999) { hitOpaque = true; break; }
          }
          e = e.parentElement;
        }
        if (!hitOpaque) layers.push({ r: 255, g: 255, b: 255, a: 1 });  // 캔버스 기본 흰색
        let base = layers.pop();                                        // 가장 아래 = 불투명
        while (layers.length) {
          const t = layers.pop();
          base = { r: t.r * t.a + base.r * (1 - t.a),
                   g: t.g * t.a + base.g * (1 - t.a),
                   b: t.b * t.a + base.b * (1 - t.a), a: 1 };
        }
        return { color: `rgb(${Math.round(base.r)}, ${Math.round(base.g)}, ${Math.round(base.b)})` };
      }
      const out = [];
      const seen = new Set();
      document.querySelectorAll("main *, header *, footer *, .site-switch *").forEach(el => {
        if (!el.firstChild) return;
        const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
        if (!hasText) return;
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity < 0.1) return;
        if (el.closest(".skip-nav, .sr-only")) return;
        const bg = bgOf(el);
        const size = parseFloat(cs.fontSize), weight = +cs.fontWeight || 400;
        const large = size >= 24 || (size >= 18.66 && weight >= 700);
        const key = `${cs.color}|${bg.unknown ? "grad" : bg.color}|${large}`;
        if (seen.has(key)) return;
        seen.add(key);
        out.push({ sel: el.className || el.tagName, color: cs.color,
                   bg: bg.color || null, unknown: !!bg.unknown, large,
                   sample: el.textContent.trim().slice(0, 22) });
      });
      return out;
    });
    for (const f of found) {
      if (f.unknown) { manual.add(`${n}: "${f.sample}" (${f.color} on 그라데이션/이미지)`); continue; }
      const r = contrast(f.color, f.bg);
      if (r === null) continue;
      const need = f.large ? 3 : 4.5;
      if (r < need - 0.01) bad.push(`${n}: ${r.toFixed(2)}<${need} "${f.sample}" (${f.color} on ${f.bg})`);
    }
    await page.close();
  }
  ok("5.3.1", "텍스트 명도 대비 (일반 4.5:1 / 큰 텍스트 3:1)", bad.length === 0,
    bad.length ? bad.slice(0, 8).join(" | ") + (bad.length > 8 ? ` …외 ${bad.length - 8}건` : "") : "단색 배경 위 텍스트 15페이지 위반 0건");
  console.log(`     ↳ 자동 판정 불가(그라데이션·이미지 배경) ${manual.size}종 — 사람이 확인해야 함`);
}

/* ============================================================
   6.1.1 키보드 사용 보장 / 6.1.2 초점 이동과 표시
   ============================================================ */
{
  const { page } = await load("about");
  const r = await page.evaluate(async () => {
    const item = document.querySelector(".nav-item");
    const m = item.querySelector(".mega");
    item.querySelector(".nav-top").focus();
    await new Promise(r => setTimeout(r, 350));
    const megaOpen = getComputedStyle(m).visibility === "visible";
    const a = document.querySelector(".nav-top");
    a.focus();
    const ow = getComputedStyle(a).outlineWidth;
    return { megaOpen, ow };
  });
  ok("6.1.1", "키보드 포커스로 메가메뉴 열림", r.megaOpen);
  ok("6.1.2", "포커스 표시(:focus-visible) 존재", r.ow !== "0px", `outline-width=${r.ow}`);
}
{
  const { page } = await load("gallery");
  const r = await page.evaluate(() => {
    const t = [...document.querySelectorAll(".tile")];
    return { total: t.length,
             kb: t.filter(x => x.getAttribute("role") === "button" && x.getAttribute("tabindex") === "0").length,
             named: t.filter(x => x.getAttribute("aria-label")).length };
  });
  ok("6.1.1", "갤러리 타일이 키보드로 조작 가능 (role=button · tabindex=0 · 이름)",
    r.total > 0 && r.kb === r.total && r.named === r.total, `${r.kb}/${r.total} 조작가능, ${r.named} 이름있음`);
  const opened = await page.evaluate(async () => {
    const t = document.querySelector(".tile");
    t.focus();
    t.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await new Promise(r => setTimeout(r, 250));
    return !!document.querySelector(".modal.open");
  });
  ok("6.1.1", "갤러리 타일 Enter 키로 확대 보기 열림", opened);
}

/* ============================================================
   6.1.3 조작 가능 — 컨트롤 최소 크기 44×44
   ============================================================ */
{
  const bad = [];
  for (const n of ["index", "notice", "gallery", "family", "market"]) {
    const { page } = await load(n);
    const small = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll("button, a.btn, .btn-login, .tab, .fb, .amt, .pager button, .m-close").forEach(el => {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") return;
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        if (r.height < 43.5 || r.width < 43.5)
          out.push(`${el.className || el.tagName}:${Math.round(r.width)}×${Math.round(r.height)}`);
      });
      return out;
    });
    if (small.length) bad.push(`${n}: ${small.join(", ")}`);
    await page.close();
  }
  ok("6.1.3", "컨트롤 최소 크기 44×44", bad.length === 0, bad.join(" | "));
}

/* ============================================================
   6.2.2 정지 기능 제공 — 자동으로 움직이는 콘텐츠를 두지 않는다
   ============================================================ */
{
  const bad = [];
  for (const n of PAGES) {
    const { page } = await load(n);
    const anim = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll("*").forEach(el => {
        const cs = getComputedStyle(el);
        if (cs.animationName !== "none" && (cs.animationIterationCount === "infinite" ||
            parseFloat(cs.animationIterationCount) > 3))
          out.push(`${el.className || el.tagName}:${cs.animationName}`);
      });
      return out;
    });
    if (anim.length) bad.push(`${n}: ${anim.join(", ")}`);
    await page.close();
  }
  ok("6.2.2", "무한 반복 자동 애니메이션 없음", bad.length === 0, bad.join(" | ") || "15페이지 0건");
}

/* ============================================================
   6.4.1 반복 영역 건너뛰기 / 6.4.2 제목 제공 / 7.3.1 선형 구조
   ============================================================ */
{
  const bad = { skip: [], main: [], title: [], h1: [] };
  for (const n of PAGES) {
    const { page } = await load(n);
    const r = await page.evaluate(() => {
      const s = document.querySelector(".skip-nav");
      return {
        skipFirst: !!s && document.body.firstElementChild === s && /^#/.test(s.getAttribute("href") || ""),
        skipTarget: !!(s && document.querySelector(s.getAttribute("href"))),
        main: document.querySelectorAll("main").length,
        title: (document.title || "").trim().length > 0,
        h1: document.querySelectorAll("h1").length,
        landmarks: {
          header: document.querySelectorAll("header").length,
          nav: document.querySelectorAll("nav").length,
          footer: document.querySelectorAll("footer").length
        }
      };
    });
    if (!r.skipFirst || !r.skipTarget) bad.skip.push(n);
    if (r.main !== 1) bad.main.push(`${n}(${r.main})`);
    if (!r.title) bad.title.push(n);
    if (r.h1 !== 1) bad.h1.push(`${n}(${r.h1})`);
    await page.close();
  }
  ok("6.4.1", "건너뛰기 링크가 문서 최상단에 있고 도착지가 존재", bad.skip.length === 0, bad.skip.join(" "));
  ok("6.4.2", "페이지마다 <main> 1개 · <title> 존재 · <h1> 1개",
    bad.main.length === 0 && bad.title.length === 0 && bad.h1.length === 0,
    [bad.main.length ? "main:" + bad.main.join(",") : "", bad.title.length ? "title:" + bad.title.join(",") : "",
     bad.h1.length ? "h1:" + bad.h1.join(",") : ""].filter(Boolean).join(" / ") || "15페이지 정상");
}

/* ============================================================
   6.4.3 적절한 링크 텍스트 / 6.5.3 레이블과 네임
   ============================================================ */
{
  const bad = [];
  for (const n of PAGES) {
    const { page } = await load(n);
    const r = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll("a[href], button").forEach(el => {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") return;
        const name = (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim();
        if (!name) out.push(`<${el.tagName.toLowerCase()} class="${el.className}">`);
      });
      return out;
    });
    if (r.length) bad.push(`${n}: ${r.join(", ")}`);
    await page.close();
  }
  ok("6.5.3", "모든 링크·버튼에 읽히는 이름이 있음", bad.length === 0, bad.join(" | ") || "15페이지 0건");
}

/* ============================================================
   7.1.1 기본 언어 표시 / 8.1.1 마크업 오류 방지
   ============================================================ */
{
  const bad = { lang: [], dup: [] };
  for (const n of PAGES) {
    const { page } = await load(n);
    const r = await page.evaluate(() => {
      const ids = [...document.querySelectorAll("[id]")].map(e => e.id);
      const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
      return { lang: document.documentElement.getAttribute("lang"), dup: [...new Set(dup)] };
    });
    if (r.lang !== "ko") bad.lang.push(`${n}(${r.lang})`);
    if (r.dup.length) bad.dup.push(`${n}: ${r.dup.join(",")}`);
    await page.close();
  }
  ok("7.1.1", 'html lang="ko" 지정', bad.lang.length === 0, bad.lang.join(" "));
  ok("8.1.1", "중복 id 없음", bad.dup.length === 0, bad.dup.join(" | "));
}

/* ============================================================
   7.4.1 레이블 제공 — 모든 입력에 결속된 레이블
   ============================================================ */
{
  const bad = [];
  for (const n of PAGES) {
    const { page } = await load(n);
    const r = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll("input, select, textarea").forEach(el => {
        if (el.type === "hidden") return;
        const byFor = el.id && document.querySelector(`label[for="${el.id}"]`);
        const wrapped = el.closest("label");
        const aria = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby");
        if (!byFor && !wrapped && !aria)
          out.push(`${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}[${el.type || ""}]`);
      });
      return out;
    });
    if (r.length) bad.push(`${n}: ${r.join(", ")}`);
    await page.close();
  }
  ok("7.4.1", "모든 입력 컨트롤에 결속된 레이블", bad.length === 0, bad.join(" | ") || "15페이지 0건");
}

/* ============================================================
   7.4.2 오류 정정 — 오류를 즉시 알리고 색 외 단서를 제공
   ============================================================ */
{
  const { page } = await load("volunteer");
  const r = await page.evaluate(async () => {
    const form = document.querySelector("form");
    form.querySelector("button[type=submit], button:not([type])").click();
    await new Promise(r => setTimeout(r, 250));
    const err = form.querySelector(".form-err.show");
    const invalid = form.querySelector('[aria-invalid="true"]');
    return {
      shown: !!err,
      role: err ? err.getAttribute("role") : null,
      msg: err ? err.textContent.trim().slice(0, 40) : "",
      invalid: !!invalid,
      borderW: invalid ? getComputedStyle(invalid).borderTopWidth : null,
      focused: document.activeElement === invalid
    };
  });
  ok("7.4.2", "필수 미입력 시 오류를 role=alert 로 알림", r.shown && r.role === "alert", `"${r.msg}"`);
  ok("7.4.2", "오류난 입력에 aria-invalid + 색 외 단서(두꺼운 보더) + 초점 이동",
    r.invalid && r.borderW === "2px" && r.focused, `aria-invalid=${r.invalid} border=${r.borderW} 초점=${r.focused}`);
}

/* ============================================================
   8.2.1 웹 애플리케이션 접근성 — 대화상자 시맨틱과 초점 관리
   ============================================================ */
{
  const { page } = await load("notice");
  const r = await page.evaluate(async () => {
    const btn = document.getElementById("loginBtn");
    btn.focus();
    btn.click();
    await new Promise(r => setTimeout(r, 300));
    const m = document.getElementById("loginModal");
    const inside = m.contains(document.activeElement);
    // ESC 로 닫고 초점이 원래 버튼으로 되돌아오는지
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await new Promise(r => setTimeout(r, 250));
    return {
      role: m.getAttribute("role"), modal: m.getAttribute("aria-modal"),
      labelled: !!m.getAttribute("aria-labelledby"),
      focusMovedIn: inside,
      closed: !m.classList.contains("open"),
      focusReturned: document.activeElement === document.getElementById("loginBtn")
    };
  });
  ok("8.2.1", "로그인 대화상자에 role=dialog · aria-modal · 이름",
    r.role === "dialog" && r.modal === "true" && r.labelled, `role=${r.role} modal=${r.modal} 이름=${r.labelled}`);
  ok("8.2.1", "열 때 대화상자로 초점 이동, ESC 로 닫고 원래 위치 복귀",
    r.focusMovedIn && r.closed && r.focusReturned,
    `진입=${r.focusMovedIn} 닫힘=${r.closed} 복귀=${r.focusReturned}`);
}
{
  const page = (await browser.newPage());
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle2" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle2" });
  const r = await page.evaluate(() => {
    const g = document.querySelector(".gate");
    const halves = [...g.querySelectorAll(".gate-half")].map(h => Math.round(h.getBoundingClientRect().width));
    return {
      role: g.getAttribute("role"), modal: g.getAttribute("aria-modal"),
      labelled: !!g.getAttribute("aria-labelledby"),
      focused: document.activeElement && document.activeElement.classList.contains("gate-half"),
      halves, vw: window.innerWidth
    };
  });
  ok("8.2.1", "진입 게이트에 대화상자 시맨틱 + 첫 선택지로 초점",
    r.role === "dialog" && r.modal === "true" && r.labelled && r.focused,
    `role=${r.role} 이름=${r.labelled} 초점=${r.focused}`);
  ok("—", "게이트 좌우 50/50 유지", Math.abs(r.halves[0] - r.halves[1]) <= 1 && Math.abs(r.halves[0] - r.vw / 2) <= 1,
    `${r.halves} / ${r.vw}`);
  await page.close();
}

/* ============================================================
   콘솔 에러 0 (견고성)
   ============================================================ */
{
  const bad = [];
  for (const n of PAGES) {
    const { page, errors } = await load(n);
    if (errors.length) bad.push(`${n}: ${errors.join(" ")}`);
    await page.close();
  }
  ok("8.1.1", "전 페이지 콘솔 에러 0", bad.length === 0, bad.join(" | ") || "15페이지 0건");
}

await browser.close();

const fail = results.filter(r => !r.pass);
console.log(`\n총 ${results.length}건 · 통과 ${results.length - fail.length} · 실패 ${fail.length}`);
if (fail.length) {
  console.log("\n실패 항목:");
  for (const f of fail) console.log(`  [${f.item}] ${f.name}\n    ${f.extra}`);
}
process.exit(fail.length ? 1 : 0);
