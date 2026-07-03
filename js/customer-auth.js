/*
==========================================
I MART Marketplace
Customer Authentication
Version: 1.0
==========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    // Register Form
    const registerForm = document.getElementById("customerRegisterForm");

    if (registerForm) {

        registerForm.addEventListener("submit", registerCustomer);

    }

    // Login Form
    const loginForm = document.getElementById("customerLoginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", loginCustomer);

    }

});

// ===============================
// REGISTER CUSTOMER
// ===============================

function registerCustomer(e) {

    e.preventDefault();

    const fullName =
        document.getElementById("fullName").value.trim();

    const email =
        document.getElementById("email").value.trim().toLowerCase();

    const phone =
        document.getElementById("phone").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (!fullName || !email || !phone || !password || !confirmPassword) {

        alert("Please complete all fields.");

        return;

    }

    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;

    }

    let customers =
        JSON.parse(localStorage.getItem("customers")) || [];

    const exists = customers.find(customer =>
        customer.email === email ||
        customer.phone === phone
    );

    if (exists) {

        alert("A customer with this email or phone already exists.");

        return;

    }

    const customer = {

        id: Date.now(),

        fullName,

        email,

        phone,

        password,

        joinedAt: new Date().toLocaleString(),

        status: "Active"

    };

    customers.push(customer);

    localStorage.setItem(
        "customers",
        JSON.stringify(customers)
    );

    localStorage.setItem(
        "currentCustomer",
        JSON.stringify(customer)
    );

    alert("Registration successful!");

    window.location.href = "customer-dashboard.html";

}

// ===============================
// LOGIN CUSTOMER
// ===============================

function loginCustomer(e) {

    e.preventDefault();

    const email =
        document.getElementById("email").value.trim().toLowerCase();

    const password =
        document.getElementById("password").value;

    const customers =
        JSON.parse(localStorage.getItem("customers")) || [];

    const customer = customers.find(c =>
        c.email === email &&
        c.password === password
    );

    if (!customer) {

        alert("Invalid email or password.");

        return;

    }

    if (customer.status !== "Active") {

        alert("This account has been disabled.");

        return;

    }

    localStorage.setItem(
        "currentCustomer",
        JSON.stringify(customer)
    );

    alert("Welcome back, " + customer.fullName + "!");

    window.location.href = "customer-dashboard.html";

}

// ===============================
// CURRENT CUSTOMER
// ===============================

function getCurrentCustomer() {

    return JSON.parse(
        localStorage.getItem("currentCustomer")
    );

}

// ===============================
// UPDATE CUSTOMER
// ===============================

function updateCustomer(updatedCustomer) {

    let customers =
        JSON.parse(localStorage.getItem("customers")) || [];

    customers = customers.map(customer => {

        if (customer.id === updatedCustomer.id) {

            return updatedCustomer;

        }

        return customer;

    });

    localStorage.setItem(
        "customers",
        JSON.stringify(customers)
    );

    localStorage.setItem(
        "currentCustomer",
        JSON.stringify(updatedCustomer)
    );

}

// ===============================
// LOGOUT
// ===============================

function customerLogout() {

    localStorage.removeItem("currentCustomer");

    window.location.href = "customer-login.html";

}

// ===============================
// PROTECT CUSTOMER PAGES
// ===============================

function protectCustomerDashboard() {

    const customer = getCurrentCustomer();

    if (!customer) {

        window.location.href = "customer-login.html";

    }

}