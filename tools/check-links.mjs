#!/usr/bin/env node
/* ============================================================
   두리손잡고 — 정적 사이트 정합성 검사 (빌드 도구 아님, 개발용 스크립트)
   실행: node tools/check-links.mjs
   검사: 없는 파일 href / 없는 #앵커 / 없는 src / 절대경로 / img alt 누락
   ============================================================ */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "duri-website");
if (!fs.existsSync(ROOT)) { console.error("duri-website/ 폴더를 찾을 수 없습니다."); process.exit(2); }

const pages = fs.readdirSync(ROOT).filter(f => f.endsWith(".html"));
const src = {};
const ids = {};
for (const f of pages) {
  const s = fs.readFileSync(path.join(ROOT, f), "utf8");
  src[f] = s;
  ids[f] = new Set([...s.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
}

// site.js / board.js 가 주입하는 id 도 유효한 앵커 대상이다
const injected = new Set();
for (const js of ["assets/site.js", "assets/board.js"]) {
  const p = path.join(ROOT, js);
  if (!fs.existsSync(p)) continue;
  const s = fs.readFileSync(p, "utf8");
  for (const m of s.matchAll(/id="([^"]+)"|\.id\s*=\s*"([^"]+)"/g)) injected.add(m[1] || m[2]);
}

const problems = [];
const add = (file, kind, detail) => problems.push({ file, kind, detail });

// 문자열 리터럴 안(JS 템플릿 등)의 href/src 는 검사 대상에서 제외한다
const stripScripts = s => s.replace(/<script[\s\S]*?<\/script>/gi, "");

for (const f of pages) {
  const body = stripScripts(src[f]);

  for (const m of body.matchAll(/href="([^"]*)"/g)) {
    const h = m[1];
    if (!h || /^(https?:|mailto:|tel:|javascript:|#)/.test(h)) continue;
    if (h.startsWith("/")) { add(f, "절대경로", h); continue; }
    const [page, frag] = h.split("#");
    const target = page || f;
    if (page && !fs.existsSync(path.join(ROOT, target))) { add(f, "없는 파일", h); continue; }
    if (frag && ids[target] && !ids[target].has(frag) && !injected.has(frag)) add(f, "없는 앵커", h);
  }

  for (const m of body.matchAll(/src="([^"]*)"/g)) {
    const s = m[1];
    if (!s || /^(https?:|data:)/.test(s)) continue;
    if (s.startsWith("/")) { add(f, "절대경로", s); continue; }
    if (!fs.existsSync(path.join(ROOT, s))) add(f, "없는 리소스", s);
  }

  for (const m of body.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\salt=/.test(m[0])) add(f, "img alt 누락", m[0].slice(0, 70));
  }
}

// css 안의 절대경로 url()
for (const css of ["assets/styles.css"]) {
  const p = path.join(ROOT, css);
  if (!fs.existsSync(p)) continue;
  for (const m of fs.readFileSync(p, "utf8").matchAll(/url\(\s*["']?(\/[^"')]+)/g)) add(css, "절대경로", m[1]);
}

if (problems.length === 0) {
  console.log(`✅ 이상 없음 — 페이지 ${pages.length}개 검사`);
  process.exit(0);
}
console.error(`❌ ${problems.length}건 발견\n`);
for (const p of problems) console.error(`  [${p.kind}] ${p.file} → ${p.detail}`);
process.exit(1);
