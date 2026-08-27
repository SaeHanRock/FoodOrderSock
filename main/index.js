let cart = [];

// ตรวจสอบสถานะการเข้าสู่ระบบ
document.addEventListener('DOMContentLoaded', () => {
  const activeUser = localStorage.getItem('verdant_user');
  const userDisplay = document.getElementById('user-display');
  const userNameSpan = document.getElementById('user-name');
  const authNavBtn = document.getElementById('auth-nav-btn');

  if (activeUser) {
    const user = JSON.parse(activeUser);
    if (userDisplay && userNameSpan) {
      userNameSpan.textContent = user.name || 'คุณสมาชิก';
      userDisplay.classList.remove('hidden');
    }
    if (authNavBtn) {
      authNavBtn.textContent = 'ออกจากระบบ';
      authNavBtn.href = '#';
      authNavBtn.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem('verdant_user');
        window.location.reload();
      };
    }
  }

  // ผูก Drawer ตะกร้าสินค้า
  const cartBtn = document.getElementById('open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartDrawer = document.getElementById('cart-drawer');

  if (cartBtn && cartDrawer) {
    cartBtn.addEventListener('click', () => cartDrawer.classList.add('open'));
  }
  if (closeCartBtn && cartDrawer) {
    closeCartBtn.addEventListener('click', () => cartDrawer.classList.remove('open'));
  }
});

// เพิ่มเมนูลงในตะกร้า
function addToCart(title, price) {
  cart.push({ title, price });
  updateCartUI();

  // เปิด Drawer อัตโนมัติเมื่อเพิ่มจานแรก
  const cartDrawer = document.getElementById('cart-drawer');
  if (cartDrawer) cartDrawer.classList.add('open');
}

// อัปเดตรายการในตะกร้า
function updateCartUI() {
  const cartCount = document.getElementById('cart-count');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalPrice = document.getElementById('cart-total-price');

  if (cartCount) cartCount.textContent = cart.length;

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-msg">ยังไม่มีรายการที่เลือก</p>';
    if (cartTotalPrice) cartTotalPrice.textContent = '฿ 0';
    return;
  }

  let total = 0;
  cartItemsContainer.innerHTML = cart.map((item, index) => {
    total += item.price;
    return `
      <div class="cart-item-row">
        <div>
          <strong>${item.title}</strong>
          <div style="font-size:0.85rem; color:#5e7069;">฿ ${item.price.toLocaleString()}</div>
        </div>
        <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#c94a4a; cursor:pointer;">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
  }).join('');

  if (cartTotalPrice) {
    cartTotalPrice.textContent = `฿ ${total.toLocaleString()}`;
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// ดำเนินการชำระเงิน -> บันทึกข้อมูลและส่งต่อไปหน้าใบเสร็จ
function checkout() {
  if (cart.length === 0) {
    alert('กรุณาเลือกรายการเมนูก่อนดำเนินการ');
    return;
  }

  // บันทึกรายการล่าสุดลง LocalStorage เพื่อให้หน้า success.html ดึงไปแสดง
  localStorage.setItem('verdant_last_order', JSON.stringify(cart));
  
  // ล้างตะกร้า
  cart = [];
  updateCartUI();
  document.getElementById('cart-drawer')?.classList.remove('open');

  // นำทางไปหน้าชำระเงินสำเร็จ
  window.location.href = 'success.html';
}

// ระบบจองโต๊ะ
function handleReservation(e) {
  e.preventDefault();
  const name = document.getElementById('res-name').value;
  const date = document.getElementById('res-date').value;
  const guests = document.getElementById('res-guests').value;

  alert(`✨ สำรองโต๊ะสำเร็จสำหรับคุณ ${name}\nวันที่: ${date}\nจำนวน: ${guests} ท่าน\nทีมงานจะติดต่อกลับเพื่อยืนยันอีกครั้ง`);
  e.target.reset();
}