/*
==========================================
I MART Authentication System
Version: 1.0
Frontend Auth (localStorage)
==========================================
*/

// ============================
// REGISTER USER
// ============================

function registerUser() {

    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    if (!name || !email || !password) {
        alert("Fill all fields");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find(u => u.email === email);

    if (exists) {
        alert("User already exists");
        return;
    }

    users.push({
        name,
        email,
        password
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully 🎉");

    window.location.href = "login.html";
}

// ============================
// LOGIN USER
// ============================

function loginUser() {

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const adminEmail = "admin@imart.com";
    const adminPassword = "admin123";

    // ADMIN LOGIN
    if (email === adminEmail && password === adminPassword) {

        localStorage.setItem("currentUser", JSON.stringify({
            name: "Admin",
            email: adminEmail,
            role: "admin"
        }));

        window.location.href = "admin.html";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert("Invalid login");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify({
        name: user.name,
        email: user.email,
        role: "user"
    }));

    window.location.href = "index.html";
}

// ============================
// LOGOUT
// ============================

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// ============================
// GET CURRENT USER
// ============================

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

// ============================
// PROTECT ADMIN PAGE
// ============================

function protectAdmin() {

    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
        alert("Access denied");
        window.location.href = "login.html";
    }
}

// ============================
// PROTECT USER PAGES
// ============================

function protectUser() {

    const user = getCurrentUser();

    if (!user) {
        window.location.href = "login.html";
    }
}