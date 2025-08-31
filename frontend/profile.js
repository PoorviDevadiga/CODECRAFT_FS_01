const API_BASE = "http://localhost:5000";

function redirectToLogin() {
  // change path if your login page is at a different location
  window.location.href = "/auth-system/frontend/index.html";
}

(async function init() {
  const token = localStorage.getItem("token");
  if (!token) {
    // not logged in
    alert("You are not logged in. Redirecting to login...");
    return redirectToLogin();
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      // unauthorized / token expired or other server error
      if (res.status === 401 || res.status === 403) {
        alert("Session expired or unauthorized. Please login again.");
        localStorage.removeItem("token");
        return redirectToLogin();
      }
      const txt = await res.text();
      console.error("Profile fetch failed:", res.status, txt);
      alert("Failed to load profile. Check console for details.");
      return;
    }

    const data = await res.json();
    const user = data.user;
    if (!user) {
      alert("Profile data not found. Please login again.");
      localStorage.removeItem("token");
      return redirectToLogin();
    }

    // populate UI
    document.getElementById("displayUsername").textContent = user.username || "(no username)";
    document.getElementById("displayEmail").textContent = user.email || "";
    document.getElementById("displayId").textContent = user._id || user.id || "";
    document.getElementById("displayName").textContent = user.username ? `Welcome, ${user.username}` : "Your Profile";
    document.getElementById("displaySubtitle").textContent = `Logged in as: ${user.email || ""}`;

    // optional: set avatar (if you had avatar url in user e.g. user.avatarUrl)
    if (user.avatarUrl) {
      document.getElementById("avatar").src = user.avatarUrl;
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
    alert("Network or server error while fetching profile. See console.");
  }
})();

// Logout button
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  // redirect to login/index
  redirectToLogin();
}); 