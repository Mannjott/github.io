export async function LoadHeader() {
    try {
        const response = await fetch("./views/components/header.html");
        if (!response.ok) {
            console.error("[ERROR] Fetch failed, status: " + response.status);
            return;
        }
        const data = await response.text();
        const headerElement = document.querySelector('header');
        if (headerElement) {
            headerElement.innerHTML = data;
            updateActiveNewLink();
            CheckLogin();
        }
        else {
            console.error("[ERROR] <header> element not found.");
        }
    }
    catch (error) {
        console.error("[ERROR] Unable to load header: ", error);
    }
}
export function updateActiveNewLink() {
    console.log("[INFO] Updating active nav link...");
    const currentPath = location.hash.slice(1);
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach((link) => {
        const linkPath = link.getAttribute("href")?.replace("#", "") || "";
        if (currentPath === linkPath) {
            link.classList.add("active");
        }
        else {
            link.classList.remove("active");
        }
    });
}
export function handleLogout(event) {
    event.preventDefault();
    sessionStorage.removeItem("user"); // Clear user session
    console.log("[INFO] User logged out. Updating UI...");
    LoadHeader().then(() => {
        location.hash = "/"; // Redirect to home page after logout
    });
}
export function CheckLogin() {
    console.log("[INFO] Checking user login status...");
    const loginNav = document.getElementById("login");
    const welcomeMessage = document.getElementById("welcomeMessage");
    if (!loginNav) {
        console.warn("[WARNING] loginNav element not found! Skipping CheckLogin().");
        return;
    }
    const userSession = sessionStorage.getItem("user");
    if (userSession) {
        const user = JSON.parse(userSession); // Ensure correct typing
        console.log("[INFO] User logged in:", user);
        // Update welcome message if the element exists
        if (welcomeMessage) {
            welcomeMessage.innerHTML = `Welcome, <strong>${user.DisplayName}</strong>! 👋`;
        }
        // Set Logout UI
        loginNav.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`;
        loginNav.href = "#"; // Prevent navigation
        // Remove old event listeners to prevent duplicates
        loginNav.removeEventListener("click", handleLogout);
        loginNav.addEventListener("click", handleLogout);
    }
    else {
        // If the user is not logged in
        if (welcomeMessage) {
            welcomeMessage.innerHTML = ""; // Clear welcome message
        }
        loginNav.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`;
        loginNav.href = "/login"; // Set login link
        loginNav.removeEventListener("click", handleLogout); // Ensure no duplicate events
        loginNav.addEventListener("click", () => {
            location.hash = "/login";
        });
    }
}
//# sourceMappingURL=header.js.map