(() => {
  const example = document.querySelector('.relief-case');
  if (!example) return;

  const selector = example.querySelector('.relief-selector');
  const months = 12;
  const annualSales = 120_000_000;
  const recognizedWorkers = 15;
  const basicLevy = 1_295_000;
  const levyCap = 20_000_000 * 0.9;
  const currency = new Intl.NumberFormat('ko-KR');

  function render() {
    const monthlyPayment = Number(selector.querySelector('input:checked').value);
    const annualPayment = monthlyPayment * months;
    const share = annualPayment / annualSales;
    const estimate = share * recognizedWorkers * basicLevy * months;
    const contractCap = annualPayment * 0.5;
    const finalAmount = Math.min(estimate, levyCap, contractCap);
    const won = value => currency.format(value) + '원';
    const values = {
      monthly: monthlyPayment / 10_000 + '만 원',
      total: won(finalAmount),
      annual: won(annualPayment),
      share: Math.round(share * 100) + '%',
      estimate: won(estimate),
      'contract-cap': won(contractCap)
    };
    for (const el of example.querySelectorAll('[data-relief]')) {
      el.textContent = values[el.dataset.relief];
    }
  }

  selector.addEventListener('change', render);
  render();
  selector.hidden = false;
})();
