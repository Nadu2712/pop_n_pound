document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // Validate that both fields are filled
    if (!username || !password) {
        showToast("Please fill in all fields.", "error");
        return;
    }

    // Validate password length (optional: for example, at least 6 characters)
    if (password.length < 6) {
        showToast("Password must be at least 6 characters long.", "error");
        return;
    }

    try {
        // Send login request to backend
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const message = await response.text();

        if (response.ok) {
            setCookie("username", username, 7);
            showToast(message, "success"); // Login successful
            // Redirect to the game page or dashboard
            setTimeout(() => {
                window.location.href = "../pages/index.html";
            }, 1000);
        } else {
            showToast(message, "error"); // Show error message
        }
    } catch (error) {
        console.error("Error:", error);
        showToast("An error occurred. Please try again.", "error");
    }
});

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Expiry time in milliseconds
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/;SameSite=Strict`;
}

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
