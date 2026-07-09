const API = "https://i-mart-backend.onrender.com";


const form = document.getElementById("productForm");
const message = document.getElementById("message");


form.addEventListener("submit", async (e)=>{

    e.preventDefault();


    const token = localStorage.getItem("sellerToken");


    if(!token){

        message.innerHTML =
        "Please login as seller first";

        return;

    }


    const formData = new FormData();


    formData.append(
        "name",
        document.getElementById("name").value
    );


    formData.append(
        "description",
        document.getElementById("description").value
    );


    formData.append(
        "price",
        document.getElementById("price").value
    );


    formData.append(
        "category",
        document.getElementById("category").value
    );


    formData.append(
        "stock",
        document.getElementById("stock").value
    );


    formData.append(
        "image",
        document.getElementById("image").files[0]
    );



    try{


        const response = await fetch(
            `${API}/api/products/add`,
            {

                method:"POST",

                headers:{
                    "Authorization":
                    `Bearer ${token}`
                },

                body:formData

            }
        );


        const data = await response.json();


        if(data.success){

            message.innerHTML =
            "Product uploaded successfully ✅";

            form.reset();

        }
        else{

            message.innerHTML =
            data.message;

        }


    }
    catch(error){

        console.log(error);

        message.innerHTML =
        "Server error";

    }


});