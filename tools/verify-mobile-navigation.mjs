#!/usr/bin/env node
// python3 -m http.server 5599 --directory duri-website
// node tools/verify-mobile-navigation.mjs
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const base = "http://localhost:5599";
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  pipe: true
});

try {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);

  for (const viewport of [{ width: 320, height: 700 }, { width: 390, height: 844 }]) {
    await page.setViewport(viewport);
    for (const path of ["work.html", "coop.html"]) {
      const label = `${path} · ${viewport.width}px`;
      await page.goto(`${base}/${path}`, { waitUntil: "networkidle2" });
      await page.click(".nav-burger");
      const menu = await page.$eval("#mobileNav", nav => {
        const bounds = nav.getBoundingClientRect();
        const headerBottom = document.querySelector(".site-header").getBoundingClientRect().bottom;
        const lastLink = [...nav.querySelectorAll("a")].at(-1);
        lastLink.scrollIntoView({ block: "nearest", behavior: "instant" });
        const target = lastLink.getBoundingClientRect();
        const hit = document.elementFromPoint(target.x + target.width / 2, target.y + target.height / 2);
        return { height: bounds.height, available: innerHeight - headerBottom, lastReachable: lastLink.contains(hit) };
      });
      assert.ok(menu.height >= menu.available - 2, `${label} 메뉴 높이 ${menu.height}px / 가용 높이 ${menu.available}px`);
      assert.ok(menu.lastReachable, `${label} 마지막 메뉴 링크 가림`);
      console.log(`PASS ${label} 메뉴 높이 및 마지막 링크`);
    }
  }

  for (const width of [319, 320, 390]) {
    await page.setViewport({ width, height: 844 });
    for (const path of ["notice.html", "coop-notice.html", "coop-board.html"]) {
      const label = `${path}#tab-press · ${width}px`;
      await page.goto(`${base}/${path}#tab-press`, { waitUntil: "networkidle2" });
      assert.equal(await page.$eval("#tab-press", el => el.getAttribute("aria-checked")), "true", label);
      const obscured = await page.$$eval("#tabs .tab", tabs => {
        const headerBottom = document.querySelector(".site-header").getBoundingClientRect().bottom;
        return tabs.filter(tab => {
          const r = tab.getBoundingClientRect();
          const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
          return r.top < headerBottom || !tab.contains(hit);
        }).map(tab => tab.textContent.trim());
      });
      assert.deepEqual(obscured, [], `${label}에서 가려진 분류: ${obscured.join(", ")}`);
      await page.click("#tab-news");
      assert.equal(await page.$eval("#tab-news", el => el.getAttribute("aria-checked")), "true", label);
      console.log(`PASS ${label} 모든 분류 표시 및 새소식 클릭`);
    }
  }

  // 1440×900 화면을 200%로 확대했을 때와 같은 CSS 뷰포트.
  await page.setViewport({ width: 720, height: 450 });
  await page.evaluate(() => localStorage.removeItem("duri.site.v1"));
  await page.goto(`${base}/index.html`, { waitUntil: "networkidle2" });
  const choices = await page.$$(".gate-half");
  assert.equal(choices.length, 2);
  for (const choice of choices) {
    await choice.focus();
    const visible = await choice.evaluate(link => {
      const r = link.querySelector(".gate-go").getBoundingClientRect();
      const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return r.top >= 0 && r.bottom <= innerHeight && link.contains(hit);
    });
    assert.ok(visible, `${await choice.evaluate(el => el.innerText)} 바로가기 잘림`);
  }
  console.log("PASS 720×450 확대 화면에서 양쪽 갈래 바로가기 표시");

  await page.setViewport({ width: 320, height: 700 });
  for (const path of ["family.html", "coop-family.html"]) {
    await page.goto(`${base}/${path}#donate`, { waitUntil: "networkidle2" });
    const fits = await page.$eval('#donate a[href^="tel:"]', link => {
      const card = link.closest(".card").getBoundingClientRect();
      const button = link.getBoundingClientRect();
      const number = document.createRange();
      number.selectNodeContents(link.querySelector(".nb"));
      const lines = number.getClientRects();
      return button.left >= card.left && button.right <= Math.min(card.right, innerWidth)
        && lines.length === 1 && lines[0].left >= button.left && lines[0].right <= button.right;
    });
    assert.ok(fits, `${path} 320px 후원 문의 버튼이나 전화번호가 잘림`);
    console.log(`PASS ${path} · 320px 후원 문의 버튼 및 전체 전화번호 표시`);
  }
} finally {
  await browser.close();
}
