/* ============================================================
   두리손잡고 — 공지사항 게시판 (client-side, localStorage)
   - 글 목록/검색/탭/페이지네이션
   - 로그인(관리자)한 경우에만 글쓰기·삭제 가능
   - 작성한 글은 이 브라우저의 localStorage 에 저장됩니다.
   ============================================================ */
(function(){
  const D = window.DURI || {};
  const ICON = D.ICON || {};
  const Auth = D.Auth;
  const POSTS_KEY = "duri.posts.v1";
  const PER_PAGE = 10;

  const MEGA = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>`;
  const CATS = ["공지", "새소식", "언론보도"];
  const PILL = { "공지":"notice", "새소식":"news", "언론보도":"press" };

  // 분류 라벨(탭) → 게시글 category
  const TAB_MAP = { "전체":null, "공지사항":"공지", "새소식":"새소식", "언론보도":"언론보도" };

  /* ---------- seed (예시 게시물) ---------- */
  const SEED = [
    { id:"s24", cat:"공지", pinned:true,  date:"2025.05.12", title:"2025년 사회복지현장실습생 모집 안내",
      body:"두리손잡고에서 2025년 사회복지현장실습생을 모집합니다.\n\n· 모집기간: 2025년 5월 한 달간\n· 실습분야: 직업재활, 주간보호\n· 신청방법: 홈페이지 ‘실습 신청하기’ 메뉴\n\n자세한 사항은 직업재활센터(031-853-3360)로 문의 바랍니다." },
    { id:"s23", cat:"공지", pinned:true,  date:"2025.04.28", title:"두리손잡고 점보롤 · 페이퍼타올 신규 입고 안내",
      body:"두리손잡고 근로자들이 직접 생산한 친환경 점보롤·페이퍼타올이 신규 입고되었습니다.\n‘두리손잡고 마켓’에서 만나보실 수 있습니다." },
    { id:"s22", cat:"새소식", pinned:false, date:"2025.04.15", title:"CHALLENGE 체육교실 봄학기 활동 후기",
      body:"봄학기 CHALLENGE 체육교실 활동이 마무리되었습니다. 함께해 주신 모든 분들께 감사드립니다." },
    { id:"s21", cat:"공지", pinned:false, date:"2025.03.30", title:"2025년 상반기 자원봉사자 모집 안내",
      body:"두리손잡고와 함께할 자원봉사자를 모집합니다. ‘자원봉사 신청하기’ 메뉴를 통해 신청해 주세요." },
    { id:"s20", cat:"언론보도", pinned:false, date:"2025.03.11", title:"중증장애인생산품 생산시설 지정 기념 소식",
      body:"두리손잡고가 중증장애인생산품 생산시설로 지정되었습니다." },
    { id:"s19", cat:"공지", pinned:false, date:"2025.02.20", title:"두리손잡고 후원의 밤 행사 안내",
      body:"따뜻한 나눔의 자리, 두리손잡고 후원의 밤에 여러분을 초대합니다." },
    { id:"s18", cat:"새소식", pinned:false, date:"2025.02.05", title:"두리손잡고 가족 나들이 · 숲체험 활동 안내",
      body:"두리손잡고 가족들과 함께하는 숲체험 나들이를 진행합니다." },
    { id:"s17", cat:"공지", pinned:false, date:"2025.01.22", title:"2025년 설 연휴 운영 안내",
      body:"설 연휴 기간 운영 일정을 안내드립니다." },
    { id:"s16", cat:"새소식", pinned:false, date:"2025.01.08", title:"경기도 장애인복지시설 재활프로그램 진행 결과",
      body:"경기도 장애인복지시설 재활프로그램이 성공적으로 진행되었습니다." },
    { id:"s15", cat:"공지", pinned:false, date:"2024.12.18", title:"기부금영수증 발급 안내",
      body:"연말정산용 기부금영수증 발급 안내입니다." }
  ];

  /* ---------- storage ---------- */
  function load(){ try{ return JSON.parse(localStorage.getItem(POSTS_KEY)) || []; }catch(e){ return []; } }
  function save(arr){ localStorage.setItem(POSTS_KEY, JSON.stringify(arr)); }
  function userPosts(){ return load(); }

  function allPosts(){
    const merged = userPosts().concat(SEED);
    // 정렬: 고정(공지) 먼저, 그다음 날짜 내림차순
    return merged.slice().sort((a,b)=>{
      if(!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
      return (b.date||"").localeCompare(a.date||"");
    });
  }

  /* ---------- helpers ---------- */
  function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
  function todayStr(){
    const d = new Date();
    const p = n => String(n).padStart(2,"0");
    return `${d.getFullYear()}.${p(d.getMonth()+1)}.${p(d.getDate())}`;
  }
  function findPost(id){ return allPosts().find(p=>String(p.id)===String(id)); }

  /* ---------- state ---------- */
  let state = { tab:"전체", q:"", page:1 };

  function filtered(){
    const cat = TAB_MAP[state.tab];
    const q = state.q.trim().toLowerCase();
    return allPosts().filter(p=>{
      if(cat && p.cat !== cat) return false;
      if(q && p.title.toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
  }

  /* ---------- DOM refs ---------- */
  const boardEl  = document.getElementById("board");
  const pagerEl  = document.getElementById("pager");
  const countEl  = document.getElementById("postCount");
  const tabsEl   = document.getElementById("tabs");
  const searchEl = document.getElementById("searchInput");
  const writeBtn = document.getElementById("writeBtn");
  if(!boardEl) return;

  /* ---------- render list ---------- */
  function render(){
    const list = filtered();
    countEl.textContent = list.length;

    // 표시용 번호: 고정글 제외, 전체 비고정글 기준 내림차순 번호 부여
    const nonPinned = allPosts().filter(p=>!p.pinned);
    const noMap = {};
    nonPinned.forEach((p,i)=>{ noMap[p.id] = nonPinned.length - i; });

    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    if(state.page > pages) state.page = pages;
    const start = (state.page - 1) * PER_PAGE;
    const slice = list.slice(start, start + PER_PAGE);

    if(slice.length === 0){
      boardEl.innerHTML = `<div class="board-empty">검색 결과가 없습니다.</div>`;
    } else {
      boardEl.innerHTML = slice.map(p=>{
        const no = p.pinned ? `<span class="no">${MEGA}</span>` : `<span class="no">${noMap[p.id]||""}</span>`;
        const pill = `<span class="tag-pill ${PILL[p.cat]||"notice"}">${p.cat==="공지"?"공지":esc(p.cat)}</span>`;
        return `<div class="board-row${p.pinned?" is-notice":""}" data-id="${esc(p.id)}" role="button" tabindex="0">`+
                 no +
                 `<span class="ti">${pill}${esc(p.title)}</span>`+
                 `<span class="dt">${esc(p.date)}</span>`+
               `</div>`;
      }).join("");
    }

    // pager
    let ph = `<button data-pg="prev" ${state.page<=1?"disabled":""}>‹</button>`;
    for(let i=1;i<=pages;i++){ ph += `<button data-pg="${i}" class="${i===state.page?"active":""}">${i}</button>`; }
    ph += `<button data-pg="next" ${state.page>=pages?"disabled":""}>›</button>`;
    pagerEl.innerHTML = ph;
  }

  /* ---------- detail modal ---------- */
  const detailModal = document.createElement("div");
  detailModal.className = "modal";
  detailModal.innerHTML = `
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card lg">
      <button class="m-close" data-close aria-label="닫기">${ICON.x||"×"}</button>
      <div id="detailBody"></div>
    </div>`;
  document.body.appendChild(detailModal);
  if(D.wireModal) D.wireModal(detailModal);
  const detailBody = detailModal.querySelector("#detailBody");

  function openDetail(id){
    const p = findPost(id);
    if(!p) return;
    const isUserPost = !String(p.id).startsWith("s");
    const delBtn = (Auth && Auth.isAdmin() && isUserPost)
      ? `<button class="btn btn-ghost" id="delPost" data-id="${esc(p.id)}">삭제</button>` : `<span></span>`;
    detailBody.innerHTML =
      `<span class="tag-pill ${PILL[p.cat]||"notice"}" style="margin-bottom:14px;display:inline-block">${esc(p.cat)}</span>`+
      `<h3 class="m-title">${esc(p.title)}</h3>`+
      `<div class="post-meta"><span>두리손잡고</span><span>·</span><span>${esc(p.date)}</span></div>`+
      `<div class="post-body">${esc(p.body)}</div>`+
      `<div class="post-foot">${delBtn}<button class="btn btn-primary" data-close>닫기</button></div>`;
    if(D.wireModal) D.wireModal(detailModal); // re-wire new [data-close]
    const del = detailBody.querySelector("#delPost");
    if(del) del.addEventListener("click", ()=>{
      if(confirm("이 게시물을 삭제할까요?")){
        save(userPosts().filter(x=>String(x.id)!==String(del.dataset.id)));
        D.closeModal(detailModal); render();
      }
    });
    D.openModal(detailModal);
  }

  /* ---------- write modal ---------- */
  const writeModal = document.createElement("div");
  writeModal.className = "modal";
  writeModal.innerHTML = `
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card lg">
      <button class="m-close" data-close aria-label="닫기">${ICON.x||"×"}</button>
      <h3 class="m-title">새 게시글 작성</h3>
      <p class="m-sub">작성한 글은 공지사항 목록에 즉시 등록됩니다.</p>
      <div class="form-err" id="writeErr">제목과 내용을 모두 입력해 주세요.</div>
      <form id="writeForm" novalidate>
        <div class="field">
          <label for="wCat">분류</label>
          <select id="wCat">${CATS.map(c=>`<option value="${c}">${c}</option>`).join("")}</select>
        </div>
        <div class="field"><label for="wTitle">제목 <span class="req">*</span></label><input id="wTitle" maxlength="120" placeholder="제목을 입력하세요"></div>
        <div class="field"><label for="wBody">내용 <span class="req">*</span></label><textarea id="wBody" placeholder="내용을 입력하세요" style="min-height:200px"></textarea></div>
        <label style="display:flex;align-items:center;gap:8px;font-size:14.5px;font-weight:600;color:var(--body);margin:-6px 0 18px;cursor:pointer">
          <input type="checkbox" id="wPin" style="width:auto;min-height:0"> 공지로 상단 고정
        </label>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" data-close>취소</button>
          <button type="submit" class="btn btn-primary">등록하기</button>
        </div>
      </form>
    </div>`;
  document.body.appendChild(writeModal);
  if(D.wireModal) D.wireModal(writeModal);
  const writeErr = writeModal.querySelector("#writeErr");

  function openWrite(){
    if(!(Auth && Auth.isAdmin())){ if(D.openLogin) D.openLogin(); return; }
    writeErr.classList.remove("show");
    writeModal.querySelector("#writeForm").reset();
    D.openModal(writeModal);
    setTimeout(()=>writeModal.querySelector("#wTitle").focus(), 60);
  }
  writeModal.querySelector("#writeForm").addEventListener("submit", e=>{
    e.preventDefault();
    if(!(Auth && Auth.isAdmin())){ D.closeModal(writeModal); if(D.openLogin) D.openLogin(); return; }
    const title = writeModal.querySelector("#wTitle").value.trim();
    const body  = writeModal.querySelector("#wBody").value.trim();
    const cat   = writeModal.querySelector("#wCat").value;
    const pin   = writeModal.querySelector("#wPin").checked;
    if(!title || !body){ writeErr.classList.add("show"); return; }
    const arr = userPosts();
    arr.unshift({ id:"u"+Date.now(), cat:cat, pinned:pin, date:todayStr(), title:title, body:body });
    save(arr);
    D.closeModal(writeModal);
    state.tab = "전체"; state.q = ""; state.page = 1;
    if(searchEl) searchEl.value = "";
    syncTabs();
    render();
  });

  /* ---------- write button visibility ---------- */
  function syncWriteBtn(){
    if(!writeBtn) return;
    writeBtn.style.display = (Auth && Auth.isAdmin()) ? "inline-flex" : "none";
  }

  /* ---------- tabs ---------- */
  function syncTabs(){
    tabsEl.querySelectorAll(".tab").forEach(t=>{
      t.classList.toggle("active", t.textContent.trim() === state.tab);
    });
  }

  /* ---------- events ---------- */
  boardEl.addEventListener("click", e=>{
    const row = e.target.closest(".board-row"); if(row) openDetail(row.dataset.id);
  });
  boardEl.addEventListener("keydown", e=>{
    if(e.key==="Enter" || e.key===" "){ const row = e.target.closest(".board-row"); if(row){ e.preventDefault(); openDetail(row.dataset.id); } }
  });
  pagerEl.addEventListener("click", e=>{
    const b = e.target.closest("button[data-pg]"); if(!b || b.disabled) return;
    const v = b.dataset.pg;
    const pages = Math.max(1, Math.ceil(filtered().length / PER_PAGE));
    if(v==="prev") state.page = Math.max(1, state.page-1);
    else if(v==="next") state.page = Math.min(pages, state.page+1);
    else state.page = parseInt(v,10);
    render();
    boardEl.scrollIntoView({ behavior:"smooth", block:"start" });
  });
  tabsEl.addEventListener("click", e=>{
    const t = e.target.closest(".tab"); if(!t) return;
    state.tab = t.textContent.trim(); state.page = 1;
    syncTabs(); render();
  });
  if(searchEl){
    searchEl.addEventListener("input", ()=>{ state.q = searchEl.value; state.page = 1; render(); });
  }
  if(writeBtn) writeBtn.addEventListener("click", openWrite);

  // 로그인 상태 변경 시 글쓰기 버튼 갱신
  document.addEventListener("duri:auth", ()=>{ syncWriteBtn(); });

  /* ---------- init ---------- */
  syncWriteBtn();
  syncTabs();
  render();
  if(window.__revealRescan) window.__revealRescan();
})();
