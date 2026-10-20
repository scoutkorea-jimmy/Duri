/* 공개 일정이 제공되면 날짜별 안내를 연결한다. */
(function(){
  const now = new Date();
  let month = new Date(now.getFullYear(), now.getMonth(), 1);
  const title = document.getElementById("calendarTitle");
  const days = document.getElementById("calendarDays");
  function render(){
    const year = month.getFullYear(), m = month.getMonth();
    title.textContent = `${year}년 ${m + 1}월`;
    const offset = month.getDay();
    const last = new Date(year, m + 1, 0).getDate();
    let html = "";
    for(let i = 0; i < Math.ceil((offset + last) / 7) * 7; i++){
      if(i % 7 === 0) html += "<tr>";
      const date = i - offset + 1;
      const today = year === now.getFullYear() && m === now.getMonth() && date === now.getDate();
      html += date > 0 && date <= last
        ? `<td${today ? ' aria-current="date" class="today"' : ""}><time datetime="${year}-${String(m+1).padStart(2,"0")}-${String(date).padStart(2,"0")}">${date}</time>${today ? '<span class="sr-only"> 오늘</span>' : ""}</td>`
        : '<td class="calendar-blank"></td>';
      if(i % 7 === 6) html += "</tr>";
    }
    days.innerHTML = html;
  }
  document.getElementById("prevMonth").addEventListener("click", ()=>{ month.setMonth(month.getMonth()-1); render(); });
  document.getElementById("nextMonth").addEventListener("click", ()=>{ month.setMonth(month.getMonth()+1); render(); });
  document.getElementById("thisMonth").addEventListener("click", ()=>{ month = new Date(now.getFullYear(), now.getMonth(), 1); render(); });
  render();
})();
