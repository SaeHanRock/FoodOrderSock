document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.auth-form');
  if (!form) return;

  // ตรวจสอบว่าเป็นหน้าไหน
  const isRegister = window.location.pathname.includes('rege.html');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;

    if (isRegister) {
      // Logic หน้าสมัครสมาชิก
      const firstname = document.getElementById('firstname')?.value.trim();
      const lastname = document.getElementById('lastname')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const phone = document.getElementById('phone')?.value.trim();
      const birthday = document.getElementById('birthday')?.value;
      const password = document.getElementById('password')?.value;
      const confirmPassword = document.getElementById('confirm-password')?.value;

      if (password !== confirmPassword) {
        alert('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
        return;
      }

      submitBtn.innerHTML = '<span>กำลังบันทึกข้อมูล...</span>';
      submitBtn.disabled = true;

      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstname, lastname, email, phone, birthday, password })
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'สมัครสมาชิกไม่สำเร็จ');

        alert('🎉 ' + data.message);
        window.location.href = '/login.html';
      } catch (err) {
        alert('❌ ' + err.message);
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }

    } else {
      // Logic หน้าเข้าสู่ระบบ
      const email = document.getElementById('email')?.value.trim();
      const password = document.getElementById('password')?.value;

      submitBtn.innerHTML = '<span>กำลังเข้าสู่ระบบ...</span>';
      submitBtn.disabled = true;

      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');

        // บันทึกสถานะ User
        localStorage.setItem('verdant_user', JSON.stringify(data.user));
        alert(`✨ ยินดีต้อนรับคุณ ${data.user.name}`);
        window.location.href = '/index.html'; // ล็อกอินผ่านแล้วเด้งไปหน้าแรก
      } catch (err) {
        alert('❌ ' + err.message);
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    }
  });
});