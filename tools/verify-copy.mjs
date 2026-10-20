import assert from 'node:assert/strict';
import {readdirSync,mkdirSync} from 'node:fs';
import puppeteer from 'puppeteer-core';
const out='work/gpt-copy-final-20261019';mkdirSync(out,{recursive:true});
const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'shell',args:['--no-sandbox']});
try {
 const page=await browser.newPage();const errors=[],posts=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(r.method()==='POST')posts.push(r.url());});
 await page.evaluateOnNewDocument(()=>localStorage.setItem('duri.site.v1','rehab'));
 const base='http://localhost:5599/';
 const timeline=[];
 for(const name of ['coop-history','history']){
  await page.goto(base+name+'.html',{waitUntil:'domcontentloaded'});
  timeline.push(await page.$eval('.editorial-body',e=>e.textContent));
 }
 assert.equal(timeline[0],timeline[1]);assert(timeline[0].includes('2026년'));assert(timeline[0].includes('2018년'));
 for(const name of ['volunteer','coop-volunteer','internship','market']){
  await page.goto(base+name+'.html',{waitUntil:'domcontentloaded'});
  assert((await page.$eval('main',e=>e.textContent)).includes('기관에 전달되지 않습니다'));
  if(name==='market') assert.equal(await page.$eval('#inquiry .grid',e=>e.children.length),2);
  const phone=name.startsWith('coop-')?'031-853-3359':'031-878-3366';
  await page.evaluate(()=>{
   document.querySelectorAll('form .field').forEach(f=>{if(!f.querySelector('.req'))return;const el=f.querySelector('input,select,textarea');if(el)el.value=el.type==='email'?'test@example.com':el.type==='tel'?'010-0000-0000':'검증용 입력';});
   document.querySelectorAll('form input[type="checkbox"]').forEach(el=>el.checked=true);
   document.querySelector('form button[type="submit"],form button:not([type])').click();
  });
  const message=await page.$eval('.modal.open',e=>e.textContent);
  assert(message.includes('전송되지 않았습니다'));assert(message.includes(phone));assert(!message.includes('접수 완료'));
  assert.equal(await page.$eval('form input',e=>e.value),'검증용 입력');
 }
 for(const file of readdirSync('duri-website').filter(n=>n.endsWith('.html'))){
  await page.goto(base+file,{waitUntil:'domcontentloaded'});
  assert(await page.$eval('meta[name="description"]',e=>e.content.length>20));
  const text=await page.$eval('main',e=>e.textContent);assert(!/시설는|복사용지을|정상적으로 접수/.test(text));
  for(const width of [1440,360,320]){
   await page.setViewport({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),file+' overflow '+width);
  }
 }
 for(const name of ['index','coop','history','products','family','coop-family','market','volunteer']){
  await page.setViewport({width:1440,height:1000});await page.goto(base+name+'.html',{waitUntil:'domcontentloaded'});await new Promise(r=>setTimeout(r,1500));await page.screenshot({path:`${out}/${name}-desktop.png`,fullPage:true});
  if(['index','coop','products','volunteer'].includes(name)){
   await page.setViewport({width:320,height:900});await page.screenshot({path:`${out}/${name}-mobile.png`,fullPage:false});
  }
 }
 assert.deepEqual(errors,[]);assert.deepEqual(posts,[]);
 console.log('PASS identical 2018–2026 history; all four forms truthful, preserve input, route correct phone, no POST; 22 descriptions; 22 pages at 1440/360/320; browser errors 0');
}finally{await browser.close();}
