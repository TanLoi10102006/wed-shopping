document.addEventListener("DOMContentLoaded", () => {
  const loginLinks = document.querySelectorAll('a[href="DangNhap.html"]');
  const userName = localStorage.getItem("userName");
  const userPhone = localStorage.getItem("userPhone");

  console.log("🔍 Người dùng hiện tại:", userName, userPhone);

  if (userName && userPhone) {
    // Hiển thị tên người dùng
    loginLinks.forEach(link => {
      link.innerHTML = '<i class="fa-solid fa-user"></i> ' + userName;
      link.href = "#";
      link.style.color = "#ffffffff";
      link.style.fontWeight = "bold";
      
      // Click → hỏi đăng xuất
      link.addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("Bạn có muốn đăng xuất không?")) {
          localStorage.clear();
          alert("✅ Đã đăng xuất!");
          location.reload();
        }
      });
    });
  }
});
