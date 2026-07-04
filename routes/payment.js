/*
==========================================
I MART Marketplace
Paystack Payment
Version: 1.0
==========================================
*/

const API = "https://illiasu-imart-api.onrender.com";

const order = JSON.parse(localStorage.getItem("checkoutOrder"));

if (!order) {

    alert("No order found.");

    window.location.href = "checkout.html";

}

document.getElementById("paymentTotal").textContent =
    `GH₵${order.total.toFixed(2)}`;

document.getElementById("payBtn").addEventListener("click", payNow);

function payNow() {

    let handler = PaystackPop.setup({

        // Replace later with your LIVE PUBLIC KEY
        key: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxx",

        email: order.customer.email,

        amount: order.total * 100,

        currency: "GHS",

        ref: "IMART_" + Date.now(),

        metadata: {

            customer_name: order.customer.fullName,

            phone: order.customer.phone

        },

        callback: async function(response) {

            try {

                const res = await fetch(
                    `${API}/api/payment/verify`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":"application/json"
                        },

                        body: JSON.stringify({

                            reference: response.reference,

                            order

                        })

                    }

                );

                const data = await res.json();

                if(data.success){

                    localStorage.removeItem("cart");
                    localStorage.removeItem("checkoutOrder");
                    localStorage.removeItem("cartCount");

                    alert("Payment Successful!");

                    window.location.href="success.html";

                }else{

                    alert(data.message);

                }

            } catch(error){

                console.error(error);

                alert("Server Error.");

            }

        },

        onClose:function(){

            alert("Payment cancelled.");

        }

    });

    handler.openIframe();

}