const form = document.getElementById("sellerLoginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("sellerEmail").value.trim().toLowerCase();
    const password = document.getElementById("sellerPassword").value;

    console.log("Logging in with:", email);

    try {

        const response = await fetch("http://localhost:5000/api/sellers/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        const data = await response.json();

        console.log("Server response:", data);

        if (response.ok && data.success) {

            localStorage.setItem("sellerToken", data.token);
            localStorage.setItem("currentSeller", JSON.stringify(data.seller));

            alert("✅ Login successful!");

            window.location.href = "seller-dashboard.html";

        } else {

            alert(data.message || "Login failed.");

        }

    } catch (error) {

        console.error(error);
        alert("Unable to connect to the server.");

    }

});