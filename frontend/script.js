// ===== API Base URL (update if backend runs elsewhere) =====
const API_URL = "http://localhost:5000/api/auth";

// ===== Signup =====
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("signupUsername").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Signup successful! Now log in.");
        signupForm.reset();
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Try again.");
    }
  });
}

// ===== Login =====
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "profile.html";
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Try again.");
    }
  });
}

// ===== Profile Page =====
if (window.location.pathname.includes("profile.html")) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You must log in first!");
    window.location.href = "index.html";
  } else {
    // Fetch protected route
    fetch(`${API_URL}/protected`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          document.getElementById("userEmail").textContent =
            `Logged in as: ${data.user.email}`;
        } else {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          window.location.href = "index.html";
        }
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        alert("Error fetching profile.");
      });

    // ===== Logout =====
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "index.html";
      });
    }
  }
}