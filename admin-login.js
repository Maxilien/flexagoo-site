// Send 2FA Code
document.getElementById("send-2fa-btn").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("https://flexago-backend.onrender.com/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.status === "2fa_required") {
    document.getElementById("twofa-section").style.display = "block";
    document.getElementById("status").innerText = "2FA code sent to your email";
  } else {
    document.getElementById("status").innerText = data.error || "Login failed";
  }
};

// Verify 2FA Code
document.getElementById("login-btn").onclick = async () => {
  const email = document.getElementById("email").value;
  const code = document.getElementById("twofa-code").value;

  const res = await fetch("https://flexago-backend.onrender.com/api/admin/verify-2fa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("adminToken", data.token);
    window.location.href = "admin.html";
  } else {
    document.getElementById("status").innerText = data.error || "Invalid 2FA code";
  }
};
