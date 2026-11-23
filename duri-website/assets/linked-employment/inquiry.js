(() => {
  const form = document.querySelector("[data-mail-inquiry]");
  if (!form) return;
  const { kind, message, levy, order } = form.elements;
  const relief = form.querySelector(".inquiry-relief");
  const cap = form.querySelector(".inquiry-cap");
  const amount = cap.querySelector("output");
  const won = new Intl.NumberFormat("ko-KR");
  const recipient = "durisonjobgo@daum.net";

  function updateCap() {
    const valid = !relief.disabled && [levy, order].every(input =>
      input.validity.valid && Number.isSafeInteger(input.valueAsNumber)
    );
    cap.hidden = !valid;
    if (!valid) {
      amount.value = "";
      return;
    }
    const smallerCap = Math.min(levy.valueAsNumber * 9 / 10, order.valueAsNumber / 2);
    amount.value = won.format(Math.floor(smallerCap / 10) * 10) + "원";
  }

  function updateKind() {
    relief.disabled = kind.value !== "부담금 감면 상담";
    relief.hidden = relief.disabled;
    updateCap();
  }
  kind.addEventListener("change", updateKind);
  levy.addEventListener("input", updateCap);
  order.addEventListener("input", updateCap);
  message.addEventListener("input", () => message.setCustomValidity(""));

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!message.value.trim()) {
      message.setCustomValidity("상담하실 내용을 입력해 주세요.");
      message.reportValidity();
      return;
    }
    const lines = [];
    for (const [name, value] of new FormData(form)) {
      const trimmed = value.trim();
      if (!trimmed) continue;
      const label = form.elements.namedItem(name).labels[0].textContent.replace("*", "").trim();
      lines.push(label + ": " + trimmed);
    }
    const subject = "[연계고용 상담] " + kind.value;
    const body = lines.join("\r\n\r\n");
    window.location.href = "mailto:" + recipient + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });
  updateKind();
  form.hidden = false;
})();

// Keep any draft the visitor already started when moving between products.
document.querySelectorAll("a[data-product]").forEach(link => {
  link.addEventListener("click", () => {
    const form = document.querySelector("[data-mail-inquiry]");
    if (!form) return;
    const { kind, message } = form.elements;
    if (!kind.value) {
      kind.value = "제품 구매·정기 납품";
      kind.dispatchEvent(new Event("change"));
    }
    if (!message.value.trim()) message.value = link.dataset.product + " 견적을 문의합니다. ";
  });
});
