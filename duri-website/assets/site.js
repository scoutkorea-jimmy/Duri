/* ============================================================
   두리손잡고 — shared header (mega menu) + footer + interactions
   ============================================================ */
(function(){
  // apply persisted palette early (set on index.html switcher)
  try{ var saved=JSON.parse(localStorage.getItem("duri-design")||"{}"); if(saved.palette) document.documentElement.dataset.palette=saved.palette; }catch(e){}
  // hand-holding mark: two interlocking rounded links
  const MARK = `<svg class="wm-mark" viewBox="0 0 40 28" width="40" height="28" aria-hidden="true">
    <circle cx="14" cy="14" r="9.5" fill="none" stroke="var(--brand)" stroke-width="4.4"/>
    <circle cx="26" cy="14" r="9.5" fill="none" stroke="var(--accent)" stroke-width="4.4"/>
  </svg>`;

  const NAV = [
    { label:"두리손잡고 소개", href:"about.html", sub:[
      ["인사말","about.html"],["운영현황","operation.html"],["조직도","org.html"],
      ["사업안내 및 비전","business.html"],["연혁","history.html"],["오시는 길","operation.html#location"]
    ]},
    { label:"사업안내", href:"work.html", sub:[
      ["임가공 사업","work.html"],["생산 공정","work.html#process"],["두리손잡고 화장지","products.html"],["친환경 인증","products.html#cert"]
    ]},
    { label:"두리손잡고 소식", href:"notice.html", sub:[
      ["공지사항","notice.html"],["사진갤러리","gallery.html"]
    ]},
    { label:"가족되기", href:"family.html", sub:[
      ["후원·가족되기","family.html"],["실습 신청하기","internship.html"],["자원봉사 신청하기","volunteer.html"]
    ]},
    { label:"두리손잡고 마켓", href:"market.html", sub:[
      ["점보롤 화장지","market.html"],["페이퍼타올","market.html"],["각티슈","market.html"]
    ]}
  ];

  const ICON = {
    pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7A2 2 0 0 1 22 16.9Z"/></svg>',
    mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
    heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5.5a5 5 0 0 0-7 0L12 6l-.5-.5a5 5 0 1 0-7 7l7.5 7.5 7.5-7.5a5 5 0 0 0 0-7Z"/></svg>'
  };

  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  /* ---------- header ---------- */
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="container nav-inner">
      <a class="wm" href="index.html" aria-label="두리손잡고 홈">
        ${MARK}
        <span class="wm-text">두리<b>손잡고</b></span>
      </a>
      <nav class="nav-main" aria-label="주 메뉴">
        ${NAV.map(m=>`
          <div class="nav-item">
            <a class="nav-top${m.href.toLowerCase()===here?" active":""}" href="${m.href}">${m.label}</a>
            <div class="mega">
              <div class="mega-inner">
                ${m.sub.map(s=>`<a href="${s[1]}">${s[0]}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></a>`).join("")}
              </div>
            </div>
          </div>`).join("")}
      </nav>
      <div class="nav-cta">
        <a class="btn btn-accent" href="family.html">${ICON.heart}<span>후원하기</span></a>
        <button class="nav-burger" aria-label="메뉴 열기"><span></span><span></span><span></span></button>
      </div>
    </div>
    <div class="mobile-nav" hidden>
      ${NAV.map(m=>`
        <div class="m-group">
          <a class="m-top" href="${m.href}">${m.label}</a>
          <div class="m-sub">${m.sub.map(s=>`<a href="${s[1]}">${s[0]}</a>`).join("")}</div>
        </div>`).join("")}
      <a class="btn btn-accent btn-lg" style="margin-top:20px;width:100%" href="family.html">${ICON.heart}<span>후원하기</span></a>
    </div>`;
  document.body.insertBefore(header, document.body.firstChild);

  // mobile toggle
  const burger = header.querySelector(".nav-burger");
  const mnav = header.querySelector(".mobile-nav");
  burger.addEventListener("click", ()=>{
    const open = header.classList.toggle("menu-open");
    mnav.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  });

  // scrolled state
  const onScroll = ()=> header.classList.toggle("scrolled", window.scrollY > 12);
  onScroll(); window.addEventListener("scroll", onScroll, {passive:true});

  /* ---------- footer ---------- */
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="container">
      <div class="foot-top">
        <div class="foot-brand">
          <div class="wm" >${MARK}<span>두리<b style="color:var(--green-400)">손잡고</b></span></div>
          <p style="max-width:300px;line-height:1.7">서로의 손을 맞잡고 함께 나아가는 길. 모두가 존중받는 따뜻한 공동체를 만들어갑니다.</p>
          <div class="foot-contact" style="margin-top:22px">
            <div class="row">${ICON.pin}<span>경기도 의정부시 오목로 225번길 100, 3층 (민락동, CY타워)</span></div>
            <div class="row">${ICON.phone}<span>주간센터 031-853-3359 · 직업재활센터 031-853-3360</span></div>
          </div>
        </div>
        <div class="foot-col">
          <h4>두리손잡고 소개</h4>
          <ul>
            <li><a href="about.html">인사말</a></li>
            <li><a href="operation.html">운영현황</a></li>
            <li><a href="org.html">조직도</a></li>
            <li><a href="business.html">사업안내 및 비전</a></li>
            <li><a href="history.html">연혁</a></li>
          </ul>
        </div>
        <div class="foot-col">
          <h4>사업·소식</h4>
          <ul>
            <li><a href="work.html">임가공 사업</a></li>
            <li><a href="products.html">두리손잡고 화장지</a></li>
            <li><a href="notice.html">공지사항</a></li>
            <li><a href="gallery.html">사진갤러리</a></li>
            <li><a href="market.html">두리손잡고 마켓</a></li>
          </ul>
        </div>
        <div class="foot-col">
          <h4>함께하기</h4>
          <ul>
            <li><a href="family.html">후원·가족되기</a></li>
            <li><a href="internship.html">실습 신청하기</a></li>
            <li><a href="volunteer.html">자원봉사 신청하기</a></li>
          </ul>
        </div>
      </div>
      <div class="foot-bottom">
        <span>© 2026 사회적협동조합 두리손잡고. All rights reserved.</span>
        <span>시설장 유선희 · 설립 2018년 10월 · 중증장애인생산품 생산시설</span>
      </div>
    </div>`;
  document.body.appendChild(footer);

  /* ---------- scroll reveal (rAF-based; robust w/o IntersectionObserver) ---------- */
  let ticking = false;
  function check(){
    ticking = false;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll(".reveal:not(.in)").forEach(el=>{
      if(!el.style.transitionDelay && el.dataset.delay) el.style.transitionDelay = el.dataset.delay;
      const r = el.getBoundingClientRect();
      if(r.top < vh*0.9 && r.bottom > 0) el.classList.add("in");
    });
  }
  function onScrollReveal(){ if(!ticking){ ticking = true; requestAnimationFrame(check); } }
  window.addEventListener("scroll", onScrollReveal, {passive:true});
  window.addEventListener("resize", onScrollReveal, {passive:true});
  check();
  // safety net: reveal everything shortly after load no matter what
  setTimeout(()=>document.querySelectorAll(".reveal:not(.in)").forEach(el=>el.classList.add("in")), 1400);
  window.__revealRescan = check;

  // expose icons for pages
  window.DURI = { ICON, NAV };
})();
