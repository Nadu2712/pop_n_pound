function showToast(message, type = "success") {
    const toastContainer = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

document.getElementById("signup-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Validate all fields are filled
    if (!username || !email || !password || !confirmPassword) {
        showToast("Please fill in all fields.", "error");
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast("Please enter a valid email address.", "error");
        return;
    }

    // Validate password length and strength (e.g., minimum 6 characters)
    if (password.length < 6) {
        showToast("Password must be at least 6 characters long.", "error");
        return;
    }

    // Validate password and confirm password match
    if (password !== confirmPassword) {
        showToast("Passwords do not match.", "error");
        return;
    }

    // Validate username length (e.g., minimum 3 characters)
    if (username.length < 3) {
        showToast("Username must be at least 3 characters long.", "error");
        return;
    }

    try {
        // Send signup request to backend
        const response = await fetch("http://localhost:3000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        });

        const message = await response.text();

        if (response.ok) {
            showToast("Signup successful!", "success");
            // Redirect to login page
            setTimeout(() => {
                window.location.href = "../pages/login.html";
            }, 1000);
        } else {
            showToast(message, "error");
        }
    } catch (error) {
        console.error("Error:", error);
        showToast("An error occurred. Please try again.", "error");
    }
});
