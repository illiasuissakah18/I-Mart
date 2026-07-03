/*
==========================================
I MART Marketplace
Admin Seller Management
Version: 1.0
==========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    loadSellers();

});

// ===============================
// LOAD SELLERS
// ===============================

function loadSellers() {

    const sellers = JSON.parse(localStorage.getItem("sellers")) || [];

    const table = document.getElementById("sellerTable");

    if (!table) return;

    table.innerHTML = "";

    let pending = 0;
    let approved = 0;
    let suspended = 0;

    sellers.forEach(seller => {

        if (seller.status === "Pending") pending++;
        if (seller.status === "Approved") approved++;
        if (seller.status === "Suspended") suspended++;

        table.innerHTML += `

<tr>

<td>${seller.businessName}</td>

<td>${seller.ownerName}</td>

<td>${seller.email}</td>

<td>${seller.phone}</td>

<td>

<select onchange="changePlan(${seller.id}, this.value)">

<option value="Starter" ${seller.plan === "Starter" ? "selected" : ""}>Starter</option>

<option value="Business" ${seller.plan === "Business" ? "selected" : ""}>Business</option>

<option value="Premium" ${seller.plan === "Premium" ? "selected" : ""}>Premium</option>

</select>

</td>

<td>

<span class="status ${seller.status.toLowerCase()}">
${seller.status}
</span>

</td>

<td>

<button onclick="approveSeller(${seller.id})">

Approve

</button>

<button onclick="rejectSeller(${seller.id})">

Reject

</button>

<button onclick="suspendSeller(${seller.id})">

Suspend

</button>

</td>

</tr>

`;

    });

    document.getElementById("totalSellers").textContent = sellers.length;
    document.getElementById("pendingSellers").textContent = pending;
    document.getElementById("approvedSellers").textContent = approved;
    document.getElementById("suspendedSellers").textContent = suspended;

}

// ===============================
// UPDATE SELLER
// ===============================

function updateSellerStatus(id, status) {

    let sellers = JSON.parse(localStorage.getItem("sellers")) || [];

    sellers = sellers.map(seller => {

        if (seller.id === id) {

            seller.status = status;

        }

        return seller;

    });

    localStorage.setItem(
        "sellers",
        JSON.stringify(sellers)
    );

    loadSellers();

}

// ===============================
// APPROVE
// ===============================

function approveSeller(id) {

    updateSellerStatus(id, "Approved");

    alert("Seller approved successfully.");

}

// ===============================
// REJECT
// ===============================

function rejectSeller(id) {

    if (!confirm("Reject this seller application?")) return;

    updateSellerStatus(id, "Rejected");

}

// ===============================
// SUSPEND
// ===============================

function suspendSeller(id) {

    if (!confirm("Suspend this seller?")) return;

    updateSellerStatus(id, "Suspended");

}

// ===============================
// CHANGE PLAN
// ===============================

function changePlan(id, plan) {

    let sellers = JSON.parse(localStorage.getItem("sellers")) || [];

    sellers = sellers.map(seller => {

        if (seller.id === id) {

            seller.plan = plan;

            switch (plan) {

                case "Starter":
                    seller.monthlyDue = 30;
                    break;

                case "Business":
                    seller.monthlyDue = 80;
                    break;

                case "Premium":
                    seller.monthlyDue = 150;
                    break;

            }

        }

        return seller;

    });

    localStorage.setItem(
        "sellers",
        JSON.stringify(sellers)
    );

    alert("Subscription plan updated.");

    loadSellers();

}