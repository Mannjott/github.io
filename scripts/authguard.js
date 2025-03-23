"use strict";
let sessionTimeout;
function resetSessionTimeout() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        console.warn("[WARNING] Session expired due to inactivity");
        sessionStorage.removeItem("user");
        // Dispatch a global event to redirect the user
        window.dispatchEvent(new CustomEvent("SessionExpired"));
    }, 15 * 60 * 1000); //15 minutes of inactivity
}
document.addEventListener("mousemove", resetSessionTimeout);
document.addEventListener("keypress", resetSessionTimeout);
(function () {
    if (!sessionStorage.getItem("user")) {
        console.log("[AUTHGUARD] Unauthorized access detected. Redirecting to login page");
        location.hash = "/login";
    }
})();
export function AuthGuard() {
    const user = sessionStorage.getItem("user");
    const protectedRoutes = ["/statistics", "/event-planning"];
    const currentPath = location.hash.slice(1);
    if (!user && protectedRoutes.includes(currentPath)) {
        console.log("[AUTHGUARD] Unauthorized access detected. Redirecting to login page");
        location.hash = "/login";
        return false; // Indicate that access was denied
    }
    else {
        resetSessionTimeout();
        return true; // Indicate that access was granted
    }
}
//# sourceMappingURL=authguard.js.map