/* ============================================================
   두리손잡고 — shared header (mega menu) + footer + interactions
   ============================================================ */
(function(){
  // favicon (brand mark) — avoids 404 across all pages
  if(!document.querySelector('link[rel="icon"]')){
    var fav=document.createElement("link"); fav.rel="icon";
    fav.href='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 28"><circle cx="14" cy="14" r="9.5" fill="none" stroke="#2a8159" stroke-width="4.4"/><circle cx="26" cy="14" r="9.5" fill="none" stroke="#e0913a" stroke-width="4.4"/></svg>');
    document.head.appendChild(fav);
  }
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
    heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5.5a5 5 0 0 0-7 0L12 6l-.5-.5a5 5 0 1 0-7 7l7.5 7.5 7.5-7.5a5 5 0 0 0 0-7Z"/></svg>',
    login:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5M15 12H3"/></svg>',
    user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    pen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>'
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
        <div class="acct" id="acct"></div>
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

  /* ---------- auth (client-side demo gate — NOT real security) ---------- */
  const AUTH_KEY = "duri.auth.v1";
  const ADMIN = { id:"admin", pw:"admin" };
  const Auth = {
    user(){ try{ return JSON.parse(localStorage.getItem(AUTH_KEY)) || null; }catch(e){ return null; } },
    isAdmin(){ return !!Auth.user(); },
    login(id, pw){
      if(id === ADMIN.id && pw === ADMIN.pw){
        localStorage.setItem(AUTH_KEY, JSON.stringify({ id:id, name:"관리자", at:Date.now() }));
        fireAuth(); return true;
      }
      return false;
    },
    logout(){ localStorage.removeItem(AUTH_KEY); fireAuth(); }
  };
  function fireAuth(){ renderAcct(); document.dispatchEvent(new CustomEvent("duri:auth", { detail:Auth.user() })); }

  const acctEl = header.querySelector("#acct");
  function renderAcct(){
    const u = Auth.user();
    if(u){
      acctEl.innerHTML =
        `<span class="acct-name">${ICON.user}<span>${u.name}</span></span>`+
        `<button class="btn-login" id="logoutBtn">로그아웃</button>`;
      acctEl.querySelector("#logoutBtn").addEventListener("click", ()=>Auth.logout());
    }else{
      acctEl.innerHTML = `<button class="btn-login" id="loginBtn">${ICON.login}<span>로그인</span></button>`;
      acctEl.querySelector("#loginBtn").addEventListener("click", openLogin);
    }
  }

  /* ---------- generic modal helpers ---------- */
  function openModal(el){ el.classList.add("open"); document.body.style.overflow="hidden"; }
  function closeModal(el){ el.classList.remove("open"); if(!document.querySelector(".modal.open")) document.body.style.overflow=""; }
  function wireModal(el){
    el.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click", ()=>closeModal(el)));
  }
  document.addEventListener("keydown", e=>{
    if(e.key==="Escape") document.querySelectorAll(".modal.open").forEach(closeModal);
  });

  /* ---------- login modal ---------- */
  const loginModal = document.createElement("div");
  loginModal.className = "modal";
  loginModal.id = "loginModal";
  loginModal.innerHTML = `
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card">
      <button class="m-close" data-close aria-label="닫기">${ICON.x}</button>
      <h3 class="m-title">관리자 로그인</h3>
      <p class="m-sub">게시판 글 작성은 로그인 후 이용할 수 있습니다.</p>
      <div class="form-err" id="loginErr">아이디 또는 비밀번호가 올바르지 않습니다.</div>
      <form id="loginForm" novalidate>
        <div class="field"><label for="loginId">아이디</label><input id="loginId" autocomplete="username" placeholder="admin"></div>
        <div class="field"><label for="loginPw">비밀번호</label><input id="loginPw" type="password" autocomplete="current-password" placeholder="admin"></div>
        <p class="hint">임시 관리자 계정 — 아이디 <b>admin</b> / 비밀번호 <b>admin</b></p>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" data-close>취소</button>
          <button type="submit" class="btn btn-primary">로그인</button>
        </div>
      </form>
    </div>`;
  document.body.appendChild(loginModal);
  wireModal(loginModal);
  const loginErr = loginModal.querySelector("#loginErr");
  function openLogin(){
    loginErr.classList.remove("show");
    loginModal.querySelector("#loginForm").reset();
    openModal(loginModal);
    setTimeout(()=>loginModal.querySelector("#loginId").focus(), 60);
  }
  loginModal.querySelector("#loginForm").addEventListener("submit", e=>{
    e.preventDefault();
    const id = loginModal.querySelector("#loginId").value.trim();
    const pw = loginModal.querySelector("#loginPw").value;
    if(Auth.login(id, pw)){ closeModal(loginModal); }
    else { loginErr.classList.add("show"); }
  });

  renderAcct();

  /* ============================================================
     generic UI wiring — make every interactive control work
     ============================================================ */

  /* ---------- shared success modal ---------- */
  const okModal = document.createElement("div");
  okModal.className = "modal";
  okModal.innerHTML = `
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card">
      <button class="m-close" data-close aria-label="닫기">${ICON.x}</button>
      <div style="width:58px;height:58px;border-radius:16px;background:var(--brand-soft);color:var(--brand-deep);display:grid;place-items:center;margin-bottom:18px">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <h3 class="m-title" id="okTitle">접수 완료</h3>
      <p class="m-sub" id="okMsg" style="white-space:pre-line"></p>
      <div class="modal-actions"><button class="btn btn-primary" data-close>확인</button></div>
    </div>`;
  document.body.appendChild(okModal);
  wireModal(okModal);
  function showOk(title, msg){
    okModal.querySelector("#okTitle").textContent = title;
    okModal.querySelector("#okMsg").textContent = msg;
    openModal(okModal);
  }

  /* ---------- single-select toggle button groups (.seg / .amt-row / .filter-row) ---------- */
  function makeToggleGroup(container, onChange){
    const btns = Array.prototype.slice.call(container.querySelectorAll("button"));
    btns.forEach(b=>{
      if(b.getAttribute("type") === null) b.type = "button"; // 그룹 버튼이 폼을 제출하지 않도록
      b.addEventListener("click", ()=>{
        btns.forEach(x=>x.classList.remove("active"));
        b.classList.add("active");
        if(onChange) onChange(b);
      });
    });
  }
  document.querySelectorAll(".seg, .amt-row").forEach(g=>makeToggleGroup(g));

  /* ---------- gallery: filter + lightbox ---------- */
  const masonry = document.querySelector(".masonry");
  if(masonry){
    const tiles = Array.prototype.slice.call(masonry.querySelectorAll(".tile"));
    const fr = document.querySelector(".filter-row");
    if(fr) makeToggleGroup(fr, b=>{
      const cat = b.textContent.trim();
      tiles.forEach(t=>{ t.style.display = (cat==="전체" || t.dataset.cat===cat) ? "" : "none"; });
      if(window.__revealRescan) window.__revealRescan();
    });
    const gModal = document.createElement("div");
    gModal.className = "modal";
    gModal.innerHTML = `
      <div class="modal-backdrop" data-close></div>
      <div class="modal-card lg" style="padding:0;overflow:hidden">
        <button class="m-close" data-close aria-label="닫기" style="background:rgba(255,255,255,.85)">${ICON.x}</button>
        <div id="gPhoto" style="height:330px;position:relative"></div>
        <div style="padding:22px 28px">
          <h3 class="m-title" id="gCap" style="font-size:20px;margin:0"></h3>
          <p class="m-sub" id="gMeta" style="margin:6px 0 0"></p>
        </div>
      </div>`;
    document.body.appendChild(gModal);
    wireModal(gModal);
    tiles.forEach(t=>t.addEventListener("click", ()=>{
      const ph = t.querySelector(".ph"), cap = t.querySelector(".cap"), yr = t.querySelector(".yr");
      const grad = ph ? Array.prototype.slice.call(ph.classList).find(c=>/^g\d$/.test(c)) : "";
      gModal.querySelector("#gPhoto").innerHTML = `<div class="ph ${grad||""}" style="position:absolute;inset:0"></div>`;
      gModal.querySelector("#gCap").textContent = cap ? cap.textContent : "두리손잡고 갤러리";
      gModal.querySelector("#gMeta").textContent = (yr ? yr.textContent + " · " : "") + "실제 사진은 추후 교체됩니다.";
      openModal(gModal);
    }));
  }

  /* ---------- application / inquiry forms ---------- */
  Array.prototype.slice.call(document.querySelectorAll("form")).forEach(form=>{
    if(form.id === "loginForm" || form.id === "writeForm") return;
    const err = document.createElement("div");
    err.className = "form-err";
    err.textContent = "필수 항목(*)을 모두 입력해 주세요.";
    form.insertBefore(err, form.firstChild);
    form.addEventListener("submit", e=>{
      e.preventDefault();
      let missing = null;
      Array.prototype.slice.call(form.querySelectorAll(".field")).forEach(f=>{
        if(missing) return;
        if(f.querySelector(".req")){
          const c = f.querySelector("input, select, textarea");
          if(c && !c.value.trim()) missing = c;
        }
      });
      if(!missing){
        const agree = Array.prototype.slice.call(form.querySelectorAll('input[type="checkbox"]'))
          .find(c=>/동의/.test((c.parentElement||{}).textContent||""));
        if(agree && !agree.checked) missing = agree;
      }
      if(missing){
        err.classList.add("show");
        missing.focus();
        missing.scrollIntoView({ behavior:"smooth", block:"center" });
        return;
      }
      err.classList.remove("show");
      const btn = form.querySelector('button[type="submit"], button:not([type])');
      const label = (btn ? btn.textContent : "신청").trim();
      form.reset();
      showOk("접수 완료", `'${label}' 요청이 정상적으로 접수되었습니다.\n빠른 시일 내 담당자가 연락드리겠습니다.\n\n※ 데모 환경으로, 실제 전송은 운영 서버 연동 시 처리됩니다.`);
    });
  });

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

  // expose icons + auth + modal helpers for pages
  window.DURI = { ICON, NAV, Auth, openLogin, openModal, closeModal, wireModal };
})();
