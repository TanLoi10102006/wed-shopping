/* FILE: JS_GioHang.js - Dùng cho TrangChu.html */

document.addEventListener("DOMContentLoaded", function () {
    const cartPanel = document.getElementById("cart-panel");
    const cartList = document.getElementById("cart-list");
    const cartTotal = document.getElementById("cart-total");
    const clearCart = document.getElementById("clear-cart");
    const closeCart = document.getElementById("close-cart");
    const cartCountEls = document.querySelectorAll(".cart-value");
    const sendRequestBtn = document.getElementById("send-request");
    const successMessage = document.getElementById("success-message");

    // 1. QUAN TRỌNG: Đọc dữ liệu từ 'tweeCart' (Nơi các trang sản phẩm đã lưu vào)
    let cart = JSON.parse(localStorage.getItem("tweeCart")) || [];
    function updateCartCount() {
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0); // Lưu ý: dùng 'quantity' cho khớp với trang sản phẩm
        cartCountEls.forEach(el => el.textContent = totalQty);
    }
    function formatCurrency(amount) {
        return amount.toLocaleString('vi-VN') + 'đ';
    }
    function updateCartUI() {
        cartList.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartList.innerHTML = "<li style='text-align:center; padding:20px; color:gray;'>Giỏ hàng đang trống</li>";
        }

        cart.forEach((item, index) => {
            const li = document.createElement("li");
            li.style.display = "flex";
            li.style.alignItems = "center";
            li.style.justifyContent = "space-between";
            li.style.padding = "10px 0";
            li.style.borderBottom = "1px solid #eee";

            li.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px; flex:2;">
                    <img src="${item.img}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;">
                    <div style="display:flex; flex-direction:column;">
                        <span style="font-weight:500; font-size:0.9rem;">${item.name}</span>
                        <span style="font-size:0.8rem; color:gray;">${formatCurrency(item.price)}</span>
                    </div>
                </div>
                
                <div style="display:flex; align-items:center; gap:5px;">
                    <button class="decrease" data-index="${index}" 
                        style="width:24px;height:24px;border:1px solid #ddd;background:#fff;cursor:pointer;border-radius:4px;">-</button>
                    <span style="font-weight:bold; min-width:20px; text-align:center;">${item.quantity}</span>
                    <button class="increase" data-index="${index}"
                        style="width:24px;height:24px;border:1px solid #ddd;background:#fff;cursor:pointer;border-radius:4px;">+</button>
                </div>
                
                <div style="flex:1; text-align:right; font-weight:bold; color:#d63384;">
                    ${formatCurrency(item.price * item.quantity)}
                </div>
            `;
            cartList.appendChild(li);
            total += item.price * item.quantity;
        });

        cartTotal.textContent = formatCurrency(total);
        updateCartCount();

        // Lưu ngược lại vào localStorage để các trang khác cập nhật theo
        localStorage.setItem("tweeCart", JSON.stringify(cart));
    }

    // Xử lý tăng giảm số lượng
    cartList.addEventListener("click", (e) => {
        const btn = e.target;
        const i = btn.dataset.index;

        if (btn.classList.contains("increase")) {
            cart[i].quantity++;
            updateCartUI();
        }
        if (btn.classList.contains("decrease")) {
            cart[i].quantity--;
            if (cart[i].quantity <= 0) {
                if(confirm("Xóa sản phẩm này khỏi giỏ?")) {
                    cart.splice(i, 1);
                } else {
                    cart[i].quantity = 1;
                }
            }
            updateCartUI();
        }
    });

    // Nút xóa tất cả
    if(clearCart) {
        clearCart.addEventListener("click", () => {
            if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng không?")) {
                cart = [];
                updateCartUI();
            }
        });
    }

    // Nút gửi yêu cầu
    if(sendRequestBtn) {
        sendRequestBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Giỏ hàng đang trống!");
                return;
            }
            successMessage.style.display = "block";

            // Lưu đơn hàng vào 'tweeOrders' cho Admin thấy
            const newOrder = {
                id: 'DH-WEB-' + Date.now(),
                customer: { name: 'Khách Website', phone: '---', address: '---' },
                items: cart,
                total: cartTotal.innerText,
                date: new Date().toLocaleString('vi-VN'),
                status: 'Chờ xử lý'
            };
            let orders = JSON.parse(localStorage.getItem('tweeOrders')) || [];
            orders.push(newOrder);
            localStorage.setItem('tweeOrders', JSON.stringify(orders));

            // Reset giỏ
            setTimeout(() => {
                successMessage.style.display = "none";
                cart = [];
                updateCartUI();
                cartPanel.style.right = "-400px"; // Đóng panel
            }, 2000);
        });
    }
    document.querySelectorAll(".cart-icon, .fa-bag-shopping").forEach(icon => {
        // Tìm thẻ a bao quanh icon (nếu có) hoặc chính nó
        const wrapper = icon.closest('a') || icon;
        wrapper.addEventListener("click", (e) => {
            e.preventDefault();
            cartPanel.style.right = "0";
        });
    });
    if(closeCart) {
        closeCart.addEventListener("click", () => {
            cartPanel.style.right = "-400px";
        });
    }
    document.addEventListener('click', (e) => {
        if (!cartPanel.contains(e.target) && !e.target.closest('.cart-icon') && !e.target.closest('.fa-bag-shopping')) {
            cartPanel.style.right = "-400px";
        }
    });
    window.addEventListener('storage', function(e) {
        if(e.key === 'tweeCart') {
            cart = JSON.parse(e.newValue) || [];
            updateCartUI();
        }
    });
    updateCartUI();
});