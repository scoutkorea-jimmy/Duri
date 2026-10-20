import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
mkdirSync('work/gpt-feedback-20261019',{recursive:true});
import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'shell',args:['--no-sandbox']});
try {
 const page = await browser.newPage();
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 const base='http://localhost:5599/';
 await page.goto(base+'coop-notice.html',{waitUntil:'domcontentloaded'});
 await page.evaluate(()=>{localStorage.setItem('duri.posts.v1',JSON.stringify([{id:'u1',title:'시설만의 글',body:'test',cat:'공지',date:'2026.10.19'}])); localStorage.setItem('duri.coop.posts.v1',JSON.stringify([{id:'u2',title:'조합 공지',body:'test',cat:'공지',date:'2026.10.19'}])); localStorage.setItem('duri.coop.board.v1',JSON.stringify([{id:'u3',title:'조합 게시판 글',body:'test',cat:'새소식',date:'2026.10.19'}]));});
 for(const [path,wanted,absent] of [['notice.html','시설만의 글','조합 공지'],['coop-notice.html','조합 공지','조합 게시판 글'],['coop-board.html','조합 게시판 글','시설만의 글']]){
  await page.goto(base+path,{waitUntil:'domcontentloaded'});
  const text=await page.$eval('#board',e=>e.textContent); assert(text.includes(wanted));assert(!text.includes(absent));
 }
 await page.goto(base+'coop-calendar.html',{waitUntil:'domcontentloaded'});
 const start=await page.$eval('#calendarTitle',e=>e.textContent);
 await page.click('#nextMonth'); assert.notEqual(await page.$eval('#calendarTitle',e=>e.textContent),start);
 await page.click('#prevMonth'); assert.equal(await page.$eval('#calendarTitle',e=>e.textContent),start);
 // Navigate to leap February and check rollover through December/January.
 const steps=await page.evaluate(()=> (2028-new Date().getFullYear())*12+1-new Date().getMonth());
 for(let i=0;i<Math.abs(steps);i++)await page.click(steps>0?'#nextMonth':'#prevMonth');
 assert.equal(await page.$eval('#calendarTitle',e=>e.textContent),'2028년 2월');
 assert.equal(await page.$$eval('#calendarDays time',e=>e.length),29);
 await page.click('#thisMonth');assert.equal(await page.$eval('#calendarTitle',e=>e.textContent),start);
 for(const [path,href] of [['coop.html','coop-family.html'],['index.html','family.html']]) {
  await page.goto(base+path,{waitUntil:'domcontentloaded'});
  assert(await page.$('.nav-cta a[href="'+href+'"]'));
 }
 const paths=['coop','coop-history','coop-notice','coop-board','coop-gallery','coop-calendar','coop-family','coop-volunteer'];
 for(const name of paths){
  await page.goto(base+name+'.html',{waitUntil:'domcontentloaded'});
  assert.equal(await page.$eval('html',e=>e.dataset.site),'coop');
  assert.equal(await page.$$eval('header a[href="internship.html"],main a[href="internship.html"],footer a[href="internship.html"]',e=>e.length),0);
  assert((await page.$eval('footer',e=>e.textContent)).includes('031-853-3360'));
  assert(!(await page.$eval('body',e=>e.textContent)).includes('실습 신청'));
  for(const width of [1440,360,320]){
   await page.setViewport({width,height:900});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name+' overflow '+width);
  }
 }
 await page.setViewport({width:1440,height:1000});
 for(const name of ['coop','coop-history','coop-calendar','market']){
  await page.goto(base+name+'.html',{waitUntil:'domcontentloaded'});await new Promise(r=>setTimeout(r,1500));
  await page.screenshot({path:`work/gpt-feedback-20261019/${name}-desktop.png`,fullPage:true});
 }
 await page.setViewport({width:320,height:900});await page.goto(base+'coop-calendar.html',{waitUntil:'domcontentloaded'});await page.screenshot({path:'work/gpt-feedback-20261019/calendar-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('PASS storage isolation, month navigation, leap year, all 8 cooperative pages, no internship links, fax, responsive widths, browser errors');
} finally {await browser.close();}
