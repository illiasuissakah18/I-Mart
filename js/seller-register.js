const form = document.getElementById("sellerRegisterForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;

    }

    const seller = {

        fullName: document.getElementById("fullName").value.trim(),
        shopName: document.getElementById("shopName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        password

    };

    try {

        const response = await fetch("https://i-mart-backend.onrender.com/api/sellers/register", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(seller)

        });

        const data = await response.json();

        if (data.success) {

            alert("✅ Registration successful!");

            window.location.href = "seller-login.html";

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");

    }

});