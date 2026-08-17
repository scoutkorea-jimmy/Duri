/* ============================================================
   두리손잡고 — shared header (mega menu) + footer + interactions
   ============================================================ */
(function(){
  /* ============================================================
     사이트 갈래 판별 — <html data-site="coop|rehab">, 없으면 coop
     규칙: rules/00-core.md 4절 · rules/20-design.md 1-1절
     ============================================================ */
  const SITE_KEY = "duri.site.v1";
  const SITE = document.documentElement.getAttribute("data-site") === "rehab" ? "rehab" : "coop";
  const SITES = {
    coop: {
      full:"사회적협동조합 두리손잡고", short:"조합", line1:"두리손잡고", line2:"사회적협동조합",
      home:"index.html", key:"#2a8159",
      desc:"임가공 사업과 친환경 화장지 생산, 후원·자원봉사로 함께하는 길"
    },
    rehab:{
      full:"두리손잡고 직업재활센터", short:"직업재활센터", line1:"두리손잡고", line2:"직업재활센터",
      home:"rehab.html", key:"#1f6f9e",
      desc:"직업재활·주간보호 프로그램과 실습 안내"
    }
  };
  const ME = SITES[SITE];
  const OTHER_KEY = SITE === "coop" ? "rehab" : "coop";

  function storedSite(){ try{ return localStorage.getItem(SITE_KEY); }catch(e){ return null; } }
  function rememberSite(v){ try{ localStorage.setItem(SITE_KEY, v); }catch(e){} }
  // 선택을 이미 했어도 게이트를 다시 볼 수 있는 경로 (푸터 링크 · 북마크 · 공유용)
  function gateRequested(){
    return /(^|[?&])gate=1(&|$)/.test(location.search) || location.hash === "#gate";
  }

  // favicon (brand mark) — 갈래 키 컬러로 주입. avoids 404 across all pages
  if(!document.querySelector('link[rel="icon"]')){
    var fav=document.createElement("link"); fav.rel="icon";
    fav.href='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 28"><circle cx="14" cy="14" r="9.5" fill="none" stroke="'+ME.key+'" stroke-width="4.4"/><circle cx="26" cy="14" r="9.5" fill="none" stroke="#e0913a" stroke-width="4.4"/></svg>');
    document.head.appendChild(fav);
  }
  // hand-holding mark: two interlocking rounded links
  const MARK = `<svg class="wm-mark" aria-hidden="true" focusable="false" viewBox="0 0 40 28" width="40" height="28">
    <circle cx="14" cy="14" r="9.5" fill="none" stroke="var(--brand)" stroke-width="4.4"/>
    <circle cx="26" cy="14" r="9.5" fill="none" stroke="var(--accent)" stroke-width="4.4"/>
  </svg>`;
  // 게이트·전환 바처럼 어두운 면 위에 올라가는 흰 마크
  const MARK_W = `<svg class="gate-mark" aria-hidden="true" focusable="false" viewBox="0 0 40 28">
    <circle cx="14" cy="14" r="9.5" fill="none" stroke="#fff" stroke-width="4.4"/>
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

  /* 직업재활센터 메뉴 — 페이지가 준비되면 NAV 와 같은 형태로 채운다.
     비어 있으면 헤더가 메뉴 없는 축약형으로 렌더된다. (rules/30-content.md 1절) */
  const NAV_REHAB = [];

  const MENU = SITE === "rehab" ? NAV_REHAB : NAV;

  const ICON = {
    pin:'<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    phone:'<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7A2 2 0 0 1 22 16.9Z"/></svg>',
    mail:'<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
    heart:'<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5.5a5 5 0 0 0-7 0L12 6l-.5-.5a5 5 0 1 0-7 7l7.5 7.5 7.5-7.5a5 5 0 0 0 0-7Z"/></svg>',
    login:'<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5M15 12H3"/></svg>',
    user:'<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    x:'<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    pen:'<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    arrow:'<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    coop:'<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16.5 3.13A4 4 0 0 1 16.5 11"/></svg>',
    rehab:'<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M2 13h20"/></svg>'
  };

  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  /* ---------- 6.4.1 반복 영역 건너뛰기 (KWCAG) ----------
     평소 화면에서 보이지 않고 키보드 포커스를 받으면 좌상단에 나타난다.
     도착지는 각 페이지의 <main id="main">. */
  const skip = document.createElement("a");
  skip.className = "skip-nav";
  skip.href = "#main";
  skip.textContent = "본문 바로가기";
  skip.addEventListener("click", ()=>{
    const m = document.getElementById("main");
    if(m){ m.setAttribute("tabindex","-1"); m.focus(); }
  });

  /* ---------- header ---------- */
  const hasMenu = MENU.length > 0;
  const donateBtn = SITE === "coop"
    ? `<a class="btn btn-accent" href="family.html">${ICON.heart}<span>후원하기</span></a>` : "";

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="container nav-inner">
      <a class="wm" href="${ME.home}" aria-label="${ME.full} 홈">
        ${MARK}
        <span class="wm-text">두리<b>손잡고</b>${SITE==="rehab"?' <span style="font-size:15px;font-weight:700;color:var(--brand-deep);letter-spacing:-.02em">직업재활센터</span>':""}</span>
      </a>
      ${hasMenu ? `<nav class="nav-main" aria-label="주 메뉴">
        ${MENU.map(m=>`
          <div class="nav-item">
            <a class="nav-top${m.href.toLowerCase()===here?" active":""}" href="${m.href}">${m.label}</a>
            <div class="mega">
              <div class="mega-inner">
                ${m.sub.map(s=>`<a href="${s[1]}">${s[0]}<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></a>`).join("")}
              </div>
            </div>
          </div>`).join("")}
      </nav>` : ""}
      <div class="nav-cta">
        <div class="acct" id="acct"></div>
        ${donateBtn}
        ${hasMenu ? `<button class="nav-burger" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="mobileNav"><span></span><span></span><span></span></button>` : ""}
      </div>
    </div>
    ${hasMenu ? `<nav class="mobile-nav" id="mobileNav" aria-label="주 메뉴(모바일)" hidden>
      ${MENU.map(m=>`
        <div class="m-group">
          <a class="m-top" href="${m.href}">${m.label}</a>
          <div class="m-sub">${m.sub.map(s=>`<a href="${s[1]}">${s[0]}</a>`).join("")}</div>
        </div>`).join("")}
      ${donateBtn ? `<a class="btn btn-accent btn-lg" style="margin-top:20px;width:100%" href="family.html">${ICON.heart}<span>후원하기</span></a>` : ""}
    </nav>` : ""}`;
  document.body.insertBefore(header, document.body.firstChild);

  /* ---------- 사이트 전환 바 (최상단 고정) ---------- */
  const switcher = document.createElement("nav");
  switcher.className = "site-switch";
  switcher.setAttribute("aria-label", "사이트 선택");
  switcher.innerHTML = ["coop","rehab"].map(k=>{
    const s = SITES[k], on = k === SITE;
    return `<a class="sw-item${on?" on":""}" href="${s.home}"${on?' aria-current="page"':""}>`+
             ICON[k]+
             `<span class="sw-full">${s.full}</span><span class="sw-short">${s.short}</span>`+
           `</a>`;
  }).join("");
  // 전환 바로 이동할 때도 선택을 기억해 게이트가 다시 뜨지 않게 한다
  switcher.querySelectorAll(".sw-item").forEach((a,i)=>{
    a.addEventListener("click", ()=>rememberSite(i===0 ? "coop" : "rehab"));
  });
  document.body.insertBefore(switcher, header);
  document.body.insertBefore(skip, document.body.firstChild);

  // mobile toggle
  const burger = header.querySelector(".nav-burger");
  const mnav = header.querySelector(".mobile-nav");
  if(burger && mnav){
    burger.addEventListener("click", ()=>{
      const open = header.classList.toggle("menu-open");
      mnav.hidden = !open;
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
      document.body.style.overflow = open ? "hidden" : "";
    });
  }

  // scrolled state
  const onScroll = ()=> header.classList.toggle("scrolled", window.scrollY > 12);
  onScroll(); window.addEventListener("scroll", onScroll, {passive:true});

  /* ---------- footer ---------- */
  const FOOT_BRAND = `
        <div class="foot-brand">
          <div class="wm" >${MARK}<span>두리<b style="color:var(--green-400)">손잡고</b></span></div>
          <p style="max-width:300px;line-height:1.7">서로의 손을 맞잡고 함께 나아가는 길. 모두가 존중받는 따뜻한 공동체를 만들어갑니다.</p>
          <div class="foot-contact" style="margin-top:22px">
            <div class="row">${ICON.pin}<span>경기도 의정부시 오목로 225번길 100, 3층 (민락동, CY타워)</span></div>
            <div class="row">${ICON.phone}<span>주간센터 031-853-3359 · 직업재활센터 031-853-3360</span></div>
          </div>
        </div>`;
  const FOOT_BOTTOM = `
      <div class="foot-bottom">
        <span>© 2026 사회적협동조합 두리손잡고. All rights reserved.</span>
        <span>시설장 유선희 · 설립 2018년 10월 · 중증장애인생산품 생산시설</span>
        <a class="foot-reset" href="index.html?gate=1" id="reopenGate">처음 선택 화면 다시 보기</a>
      </div>`;

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.setAttribute("aria-label", "사이트 정보");
  footer.innerHTML = SITE === "rehab" ? `
    <div class="container">
      <div class="foot-top">
        ${FOOT_BRAND}
        <div class="foot-col">
          <h2>두리손잡고 직업재활센터</h2>
          <ul>
            <li><a href="rehab.html">센터 소개 (준비중)</a></li>
            <li><a href="index.html">사회적협동조합 홈페이지</a></li>
          </ul>
        </div>
      </div>
      ${FOOT_BOTTOM}
    </div>` : `
    <div class="container">
      <div class="foot-top">
        ${FOOT_BRAND}
        <div class="foot-col">
          <h2>두리손잡고 소개</h2>
          <ul>
            <li><a href="about.html">인사말</a></li>
            <li><a href="operation.html">운영현황</a></li>
            <li><a href="org.html">조직도</a></li>
            <li><a href="business.html">사업안내 및 비전</a></li>
            <li><a href="history.html">연혁</a></li>
          </ul>
        </div>
        <div class="foot-col">
          <h2>사업·소식</h2>
          <ul>
            <li><a href="work.html">임가공 사업</a></li>
            <li><a href="products.html">두리손잡고 화장지</a></li>
            <li><a href="notice.html">공지사항</a></li>
            <li><a href="gallery.html">사진갤러리</a></li>
            <li><a href="market.html">두리손잡고 마켓</a></li>
          </ul>
        </div>
        <div class="foot-col">
          <h2>함께하기</h2>
          <ul>
            <li><a href="family.html">후원·가족되기</a></li>
            <li><a href="internship.html">실습 신청하기</a></li>
            <li><a href="volunteer.html">자원봉사 신청하기</a></li>
          </ul>
        </div>
      </div>
      ${FOOT_BOTTOM}
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

  /* ---------- generic modal helpers ----------
     KWCAG 6.1.1 키보드 사용 보장 / 6.1.2 초점 이동과 표시 / 8.2.1 웹 애플리케이션 접근성
     - 열 때: 여는 요소를 기억하고 대화상자 안 첫 컨트롤로 초점을 옮긴다
     - 열려 있을 때: Tab 이 대화상자 밖으로 나가지 않는다(초점 갇힘)
     - 닫을 때: 원래 요소로 초점을 되돌린다  */
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function focusables(el){
    return Array.prototype.slice.call(el.querySelectorAll(FOCUSABLE))
      .filter(n=>n.offsetWidth>0 || n.offsetHeight>0 || n===document.activeElement);
  }
  function trapTab(el, e){
    if(e.key !== "Tab") return;
    const f = focusables(el);
    if(!f.length){ e.preventDefault(); return; }
    const first = f[0], last = f[f.length-1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
  function openModal(el){
    el.__opener = document.activeElement;
    el.classList.add("open");
    document.body.style.overflow="hidden";
    const f = focusables(el.querySelector(".modal-card") || el);
    if(f.length) setTimeout(()=>f[0].focus(), 30);
  }
  function closeModal(el){
    el.classList.remove("open");
    if(!document.querySelector(".modal.open")) document.body.style.overflow="";
    const back = el.__opener;
    el.__opener = null;
    if(back && document.body.contains(back)) setTimeout(()=>back.focus(), 20);
  }
  function wireModal(el){
    if(!el.hasAttribute("role")){
      el.setAttribute("role","dialog");
      el.setAttribute("aria-modal","true");
    }
    const t = el.querySelector(".m-title");
    if(t){
      if(!t.id) t.id = "mt-" + Math.abs(t.textContent.length * 7 + el.className.length) + "-" + (wireModal.__n = (wireModal.__n||0)+1);
      el.setAttribute("aria-labelledby", t.id);
    }
    el.querySelectorAll("[data-close]").forEach(b=>{
      if(b.tagName === "BUTTON" && !b.getAttribute("type")) b.type = "button";
      b.addEventListener("click", ()=>closeModal(el));
    });
  }
  document.addEventListener("keydown", e=>{
    const open = document.querySelector(".modal.open");
    if(!open) return;
    if(e.key === "Escape") closeModal(open);
    else trapTab(open.querySelector(".modal-card") || open, e);
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
  loginErr.setAttribute("role","alert");
  function openLogin(){
    loginErr.classList.remove("show");
    loginModal.querySelectorAll("#loginId,#loginPw").forEach(i=>i.removeAttribute("aria-invalid"));
    loginModal.querySelector("#loginForm").reset();
    openModal(loginModal);
    setTimeout(()=>loginModal.querySelector("#loginId").focus(), 60);
  }
  loginModal.querySelector("#loginForm").addEventListener("submit", e=>{
    e.preventDefault();
    const id = loginModal.querySelector("#loginId").value.trim();
    const pw = loginModal.querySelector("#loginPw").value;
    if(Auth.login(id, pw)){ closeModal(loginModal); }
    else {
      loginErr.classList.add("show");
      loginModal.querySelector("#loginId").setAttribute("aria-invalid","true");
      loginModal.querySelector("#loginPw").setAttribute("aria-invalid","true");
      loginModal.querySelector("#loginId").focus();
    }
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
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
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
    const isRadio = container.getAttribute("role") === "radiogroup";
    function sync(){
      btns.forEach(x=>{
        const on = x.classList.contains("active");
        if(isRadio){ x.setAttribute("role","radio"); x.setAttribute("aria-checked", on ? "true" : "false"); }
      });
    }
    btns.forEach((b,i)=>{
      if(b.getAttribute("type") === null) b.type = "button"; // 그룹 버튼이 폼을 제출하지 않도록
      b.addEventListener("click", ()=>{
        btns.forEach(x=>x.classList.remove("active"));
        b.classList.add("active");
        sync();
        if(onChange) onChange(b);
      });
      // 라디오 그룹은 좌우/상하 화살표로도 옮길 수 있어야 한다
      b.addEventListener("keydown", e=>{
        if(!isRadio) return;
        const d = (e.key==="ArrowRight"||e.key==="ArrowDown") ? 1 : (e.key==="ArrowLeft"||e.key==="ArrowUp") ? -1 : 0;
        if(!d) return;
        e.preventDefault();
        const next = btns[(i + d + btns.length) % btns.length];
        next.click(); next.focus();
      });
    });
    sync();
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
    tiles.forEach(t=>t.addEventListener("keydown", e=>{
      if(e.key === "Enter" || e.key === " "){ e.preventDefault(); t.click(); }
    }));
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
    err.setAttribute("role", "alert");
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
      // 이전 오류 표시 정리
      form.querySelectorAll('[aria-invalid="true"]').forEach(n=>n.removeAttribute("aria-invalid"));
      if(missing){
        missing.setAttribute("aria-invalid", "true");
        const lab = missing.closest(".field") ? missing.closest(".field").querySelector("label") : null;
        err.textContent = lab
          ? `'${lab.textContent.replace("(필수 항목)","").replace("*","").trim()}' 항목을 입력해 주세요.`
          : "필수 항목(*)을 모두 입력해 주세요.";
        err.classList.add("show");
        missing.focus();
        missing.scrollIntoView({ block:"center" });
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

  /* ============================================================
     진입 게이트 — 첫 방문 시 전체화면 좌/우 50% 분기
     - 조합 홈(index)에서만, 그리고 선택 이력이 없을 때만 뜬다
     - 조합 선택 → 제자리에서 닫힘 / 직업재활센터 선택 → rehab.html
     - JS 가 이 블록까지 오지 못하면 게이트가 없는 상태로 보인다(콘텐츠를 가두지 않음)
     규칙: rules/00-core.md 4절 · rules/20-design.md
     ============================================================ */
  function openGate(reopened){
    const gate = document.createElement("div");
    gate.className = "gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-labelledby", "gateTitle");
    gate.innerHTML =
      `<div class="gate-head">${MARK_W}<p class="t" id="gateTitle">어느 곳을 찾으시나요?</p></div>` +
      (reopened ? `<button type="button" class="gate-close" id="gateClose" aria-label="선택 화면 닫기">${ICON.x}<span>닫기</span></button>` : "") +
      ["coop","rehab"].map(k=>{
        const s2 = SITES[k];
        return `<a class="gate-half ${k}" href="${s2.home}" data-site-pick="${k}">`+
                 MARK_W+
                 `<span class="gate-name">${s2.line1}<br>${s2.line2}</span>`+
                 `<span class="gate-desc">${s2.desc}</span>`+
                 `<span class="gate-go">바로가기 ${ICON.arrow}</span>`+
               `</a>`;
      }).join("") +
      `<p class="gate-foot">선택한 곳은 기억됩니다. 화면 맨 위 전환 바로 옮겨갈 수 있고, 이 화면은 각 페이지 맨 아래 ‘처음 선택 화면 다시 보기’로 다시 열 수 있습니다.</p>`;
    document.body.appendChild(gate);
    document.body.style.overflow = "hidden";

    gate.querySelectorAll("[data-site-pick]").forEach(a=>{
      a.addEventListener("click", e=>{
        const pick = a.getAttribute("data-site-pick");
        rememberSite(pick);
        if(pick === "rehab") return;          // rehab.html 로 그대로 이동
        e.preventDefault();                    // 조합은 이 페이지가 이미 목적지
        document.body.style.overflow = "";
        gate.remove();
        // 주소창에 남은 ?gate=1 / #gate 를 지워 새로고침 시 다시 뜨지 않게 한다
        if(gateRequested() && history.replaceState){
          history.replaceState(null, "", location.pathname);
        }
        const m = document.getElementById("main");
        if(m){ m.setAttribute("tabindex","-1"); m.focus(); }
      });
    });
    // 다시 열어본 경우에만 닫기 수단을 제공한다.
    // (첫 방문에는 두 선택지 자체가 진행 경로이므로 닫기 버튼을 두지 않는다)
    function dismiss(){
      document.body.style.overflow = "";
      gate.remove();
      const back = document.querySelector(".foot-reset");
      if(back) back.focus();
    }
    if(reopened){
      gate.querySelector("#gateClose").addEventListener("click", dismiss);
      gate.addEventListener("keydown", e=>{ if(e.key === "Escape") dismiss(); });
    }
    // 게이트가 열려 있는 동안 Tab 이 배경으로 나가지 않게 한다
    gate.addEventListener("keydown", e=>trapTab(gate, e));
    setTimeout(()=>{ const f = gate.querySelector(".gate-half"); if(f) f.focus(); }, 60);
  }

  const onHome = (here === "index.html" || here === "");
  if(SITE === "coop" && onHome){
    if(gateRequested()) openGate(true);        // 다시 보기 — 닫기 가능
    else if(!storedSite()) openGate(false);    // 첫 방문 — 선택이 곧 진행
  }
  // 홈이 아닌 페이지의 푸터 링크는 index.html?gate=1 로 이동시킨다(기본 href 그대로).
  // 홈에 있을 때는 이동 없이 바로 열어준다.
  const reopenLink = document.querySelector("#reopenGate");
  if(reopenLink && onHome){
    reopenLink.addEventListener("click", e=>{
      e.preventDefault();
      if(!document.querySelector(".gate")) openGate(true);
    });
  }

  // expose site info + icons + auth + modal helpers for pages
  window.DURI = { SITE, SITES, ICON, NAV, Auth, openLogin, openModal, closeModal, wireModal };
})();
