import assert from 'node:assert/strict';
import {readFileSync,readdirSync,mkdirSync} from 'node:fs';
import puppeteer from 'puppeteer-core';
const out='work/gpt-market-20261020';mkdirSync(out,{recursive:true});
const expected=['두리 점보롤 300m','두리 점보롤 500m','두리 핸드타월 고급지','두리 핸드타월 일반지','두리 미용티슈','순수 복사용지 A4 80g','순수 복사용지 A4 85g'];
const css=readFileSync('duri-website/assets/styles.css','utf8');
assert(css.includes('@import url("https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.1/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css")'));
assert(!css.includes('Pretendard'));
const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'shell',args:['--no-sandbox']});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.evaluateOnNewDocument(()=>localStorage.setItem('duri.site.v1','rehab'));
 for(const name of readdirSync('duri-website').filter(n=>n.endsWith('.html'))){
  await page.goto('http://localhost:5599/'+name,{waitUntil:'networkidle2'});await page.evaluate(async()=>{await document.fonts.load('16px "Wanted Sans Variable"','두리손잡고 제품 안내');await document.fonts.ready;});
  assert.equal(await page.evaluate(()=>document.fonts.check('16px "Wanted Sans Variable"','두리손잡고 제품 안내')) ,true,name+' font loaded');
  const fontFaces=await page.evaluate(()=>[...document.fonts].filter(f=>f.family.includes('Wanted Sans')&&f.status==='loaded').length);
  assert(fontFaces>0,name+' no actual Wanted font face loaded');
  assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('body,body *')].filter(e=>e.textContent.trim()&&getComputedStyle(e).display!=='none'&&!getComputedStyle(e).fontFamily.includes('Wanted Sans Variable')).map(e=>e.tagName+' '+e.className)),[],name+' inconsistent font');
  assert(!/직업재활센터|보호작업장/.test(await page.$eval('body',e=>e.textContent)),name+' legacy facility name');
  for(const width of [1440,360,320]){
   await page.setViewport({width,height:1000});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' overflow '+width);
  }
 }
 await page.goto('http://localhost:5599/market.html',{waitUntil:'networkidle2'});
 assert.deepEqual(await page.$$eval('.shop h3',els=>els.map(e=>e.textContent)),expected);
 assert.deepEqual(await page.$$eval('#market-f3 option',els=>els.map(e=>e.textContent)),[...expected,'혼합 / 기타']);
 assert(!/입점 예정|\d[\d,]*원/.test(await page.$eval('main',e=>e.textContent)));
 for(const img of await page.$$('.shop img')){await img.scrollIntoView();await img.evaluate(e=>e.decode());assert(await img.evaluate(e=>e.naturalWidth>0&&e.alt.length>0));}
 assert.deepEqual(await page.$$eval('.shop .info p',els=>els.map(e=>e.textContent)),['300m · 2겹 · 1박스 16롤','500m · 1겹 · 1박스 16롤','100매 × 50속 · 총 5,000매','100매 × 50속 · 총 5,000매','250매 × 24상자','A4 · 80g/㎡','A4 · 85g/㎡']);
 for(const name of ['market','products','coop','index'])for(const width of [1440,320]){
  await page.setViewport({width,height:1000});await page.goto('http://localhost:5599/'+name+'.html',{waitUntil:'networkidle2'});
  await page.evaluate(async()=>{for(const img of document.querySelectorAll('img')){img.loading='eager';await img.decode().catch(()=>{});}document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));await document.fonts.ready;});
  await new Promise(r=>setTimeout(r,700));
  await page.screenshot({path:`${out}/${name}-${width}.png`,fullPage:true});
 }
 assert.deepEqual(errors,[]);console.log('PASS 7 products/specs/photos/options, no prices/placeholders, 22 pages actual Wanted Sans font loaded and inherited, names, 1440/360/320px, browser errors 0');
}finally{await browser.close();}
