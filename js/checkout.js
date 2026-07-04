/*
==========================================
I MART Marketplace
Checkout System
Version: 1.0
==========================================
*/

const cart = JSON.parse(localStorage.getItem("cart")) || [];

const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");

// ===============================
// LOAD CART ITEMS
// ===============================
function loadCheckout() {

    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <p>Your cart is empty.</p>
        `;

        checkoutTotal.textContent = "GH₵0.00";

        return;
    }

    let total = 0;

    checkoutItems.innerHTML = "";

    cart.forEach(product => {

        const subtotal = product.price * product.quantity;

        total += subtotal;

        checkoutItems.innerHTML += `

            <div class="checkout-item">

                <h4>${product.name}</h4>

                <p>
                    GH₵${product.price} × ${product.quantity}
                </p>

                <strong>
                    GH₵${subtotal.toFixed(2)}
                </strong>

                <hr>

            </div>

        `;

    });

    checkoutTotal.textContent = `GH₵${total.toFixed(2)}`;

}

// ===============================
// CHECKOUT FORM
// ===============================
checkoutForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const order = {

        customer: {

            fullName:
                document.getElementById("fullName").value,

            email:
                document.getElementById("email").value,

            phone:
                document.getElementById("phone").value,

            city:
                document.getElementById("city").value,

            address:
                document.getElementById("address").value

        },

        products: cart,

        total: parseFloat(
            checkoutTotal.textContent.replace("GH₵","")
        )

    };

    localStorage.setItem(
        "checkoutOrder",
        JSON.stringify(order)
    );

    alert("Delivery information saved.");

    // Next step
    window.location.href = "payment.html";

});

// ===============================
// START
// ===============================
loadCheckout();