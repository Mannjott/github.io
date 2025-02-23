/* Name: Manjot kaur and Subhana Hashimi
   Student ID: 100951033, 100949958
   Date: 2025-02-23
*/


//Login
(function () {

    function CheckLogin() {
        console.log("[INFO] Checking user login status...");
        const loginNav = document.getElementById("login");
        const welcomeMessage = document.getElementById("welcomeMessage"); // Get welcome message element

        if (!loginNav) {
            console.warn("[WARNING] loginNav element not found! Skipping CheckLogin().");
            return;
        }

        const userSession = sessionStorage.getItem("user");

        if (userSession) {
            const user = JSON.parse(userSession);
            console.log("[INFO] User logged in:", user);

            // Update welcome message
            if (welcomeMessage) {
                welcomeMessage.innerHTML = `Welcome, <strong>${user.DisplayName}</strong>!👋`;
            }

            // Change login to logout
            loginNav.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`;
            loginNav.href = "#"; // Prevent navigation

            loginNav.addEventListener("click", (event) => {
                event.preventDefault();
                sessionStorage.removeItem("user");
                location.reload(); // Refresh to update UI
            });
        } else {
            // If user is not logged in
            if (welcomeMessage) {
                welcomeMessage.innerHTML = ""; // Clear welcome message
            }

            loginNav.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`;
            loginNav.href = "login.html";
        }
    }




    function DisplayLoginPage() {
        console.log("[INFO] DisplayLoginPage called...");

        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("loginButton");
        const cancelButton = document.getElementById("cancelButton");

        messageArea.style.display = "none";

        if (!loginButton) {
            console.error("[ERROR] Unable to find login button");
            return;
        }

        loginButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const userName = document.getElementById("userName").value.trim();
            const password = document.getElementById("password").value.trim();

            try {
                const response = await fetch("data/users.json");

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const jsonData = await response.json();
                console.log("[DEBUG] Fetched JSON Data:", jsonData);
                const users = jsonData.users;

                if (!Array.isArray(users)) {
                    throw new Error("[ERROR] JSON data does not contain a valid array");
                }

                let authenticatedUser = users.find(user => user.Username === userName && user.Password === password);

                if (authenticatedUser) {
                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName: authenticatedUser.DisplayName,
                        EmailAddress: authenticatedUser.EmailAddress,
                        UserName: authenticatedUser.Username,
                    }));

                    messageArea.classList.remove("alert", "alert-danger");
                    messageArea.style.display = "none";

                    window.location.href = "index.html";
            } else {
                    messageArea.classList.add("alert", "alert-danger");
                    messageArea.textContent = "Invalid username or password. Please try again.";
                    messageArea.style.display = "block";

                    document.getElementById("userName").focus();
                    document.getElementById("userName").select();
                }
            } catch (error) {
                console.error("[ERROR] Login failed", error);
            }
        });

        cancelButton.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default behavior
            document.getElementById("loginForm").reset();
            window.location.href = "index.html";
        });

    }

    function Start() {
        console.log("Starting...");
        console.log(`Current document title: ${document.title}`);

        CheckLogin();

        switch (document.title) {
            case "Login":
                DisplayLoginPage();
                break;
            default:
                console.error("No matching case for the page title");
        }
    }

    window.addEventListener("DOMContentLoaded", () => {
        console.log("DOM fully loaded and parsed");
        Start();
    });

})();
