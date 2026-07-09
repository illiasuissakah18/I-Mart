const API = "https://i-mart-backend.onrender.com/api/products";

const token = localStorage.getItem("sellerToken");

async function loadDashboard(){

    if(!token){
        window.location.href = "seller-login.html";
        return;
    }

    try{

        const response = await fetch(
            `${API}/api/products/seller/my-products`,
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        console.log(data);

        if(data.success){

            document.getElementById("productCount").textContent =
            data.count;

            displayProducts(data.products);

        }

    }catch(error){

        console.error("Dashboard Error:", error);

    }

}

loadDashboard();