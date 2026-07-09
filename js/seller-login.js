/*
==========================================
I MART Marketplace
Seller Login
Version: 4.0
==========================================
*/

const API_URL = "https://i-mart-backend.onrender.com";

const form = document.getElementById("sellerLoginForm");

if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();


        const email = document
            .getElementById("sellerEmail")
            .value
            .trim()
            .toLowerCase();


        const password = document
            .getElementById("sellerPassword")
            .value;


        if (!email || !password) {

            alert("Please enter email and password.");
            return;

        }


        const button = form.querySelector("button");

        if (button) {
            button.disabled = true;
            button.textContent = "Logging in...";
        }


        try {

            const response = await fetch(
                `${API_URL}/api/sellers/login`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        email,
                        password

                    })

                }
            );


            const data = await response.json();


            console.log("Login response:", data);


            if (response.ok && data.success) {


                localStorage.setItem(
                    "sellerToken",
                    data.token
                );


                localStorage.setItem(
                    "currentSeller",
                    JSON.stringify(data.seller)
                );


                alert("✅ Login successful!");


                window.location.href =
                    "seller-dashboard.html";


            } else {


                alert(
                    data.message ||
                    "Invalid email or password."
                );


            }


        } catch (error) {


            console.error(
                "Login Error:",
                error
            );


            alert(
                "Unable to connect to I MART server."
            );


        } finally {


            if (button) {

                button.disabled = false;
                button.textContent = "Login";

            }


        }

    });

}