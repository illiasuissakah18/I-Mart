const API = "https://i-mart-backend.onrender.com";

const token = localStorage.getItem("sellerToken");


async function loadDashboard(){

    if(!token){
        window.location.href = "seller-login.html";
        return;
    }


    try{

        const response = await fetch(
            `${API}/api/sellers/profile`,
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        if(data.success){

            document.getElementById("seller-name").textContent =
            data.seller.fullName;


            document.getElementById("shop-name").textContent =
            data.seller.shopName;


            document.getElementById("seller-email").textContent =
            data.seller.email;

        }


    }catch(error){

        console.error(
            "Dashboard Error:",
            error
        );

    }

}


loadDashboard();