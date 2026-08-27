document.addEventListener('DOMContentLoaded', () => {
  const randomId = 'VD-' + Math.floor(100000 + Math.random() * 900000);
  document.getElementById('order-id').textContent = '#' + randomId;

  const now = new Date();
  document.getElementById('order-date').textContent = now.toLocaleDateString('th-TH', { 
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  const recentOrder = localStorage.getItem('verdant_last_order');
  const itemsContainer = document.getElementById('receipt-items');
  const totalDisplay = document.getElementById('receipt-total');

  if (recentOrder) {
    const items = JSON.parse(recentOrder);
    let total = 0;

    itemsContainer.innerHTML = items.map(item => {
      total += item.price;
      return `
        <div class="item-row">
          <span class="name">${item.title}</span>
          <span class="price">฿ ${item.price.toLocaleString()}</span>
        </div>
      `;
    }).join('');

    totalDisplay.textContent = `฿ ${total.toLocaleString()}`;
  } else {
    itemsContainer.innerHTML = `
      <div class="item-row">
        <span class="name">Truffle A5 Wagyu Tenderloin</span>
        <span class="price">฿ 2,850</span>
      </div>
    `;
    totalDisplay.textContent = '฿ 2,850';
  }
});