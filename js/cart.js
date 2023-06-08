const cartList = JSON.parse(localStorage.getItem('cart')) || [];

function showCartProducts() {
    const cartProducts = document.getElementById("cartProducts");
    const subtotal = document.getElementById("subtotal");
    let calcSubTotal = 0
    cartProducts.innerHTML = "";
    subtotal.innerHTML = "";
    cartList.forEach((item) => {
        cartProducts.innerHTML += `<div class="productCart">
                                    <img src="${item.image}" alt="">
                                    <h3>${item.name}</h3>
                                    <p>US$ ${item.cost}</p>
                                    <div class="productQuantity">
                                        <button onclick="addQuantity(${item.id})">+</button>
                                        <input id="quantity-${item.id}" type="number" min="1" value="${item.quantity}" onchange="subTotal(${item.id})">
                                        <button onclick="removeQuantity(${item.id})">-</button>
                                    </div>
                                    <button class="removeButton" onclick="removeFromCart(${item.id})">QUITAR</button>
                                    </div>`

        calcSubTotal = calcSubTotal + (item.cost * item.quantity);
    })

    subtotal.innerHTML += `${calcSubTotal}`;

    cartTotalPrice()
}

function removeFromCart(id) {
    cartList.forEach((item) => {
        if (id == item.id) {
            i = cartList.indexOf(item);
            cartList.splice(i, 1);
            localStorage.setItem('cart', JSON.stringify(cartList));
            if (cartList.length == 0) {
                localStorage.removeItem("cart");
            }
        }
    })
    showCartProducts();
}

function subTotal(id) {
    let productQuantity = document.getElementById(`quantity-${id}`).value;
    cartList.forEach(item => {
        if (item.id == id) {
            item.quantity = productQuantity;
        }
    })
    showCartProducts();
}

function cartTotalPrice() {
    let subTotal = parseInt(document.getElementById("subtotal").innerHTML);
    let ivaHTML = document.getElementById("iva");
    let totalPriceHTML = document.getElementById("total");

    let totalIVA = parseInt(subTotal * 0.22);
    let total = parseInt(subTotal + totalIVA);

    ivaHTML.innerHTML = `${totalIVA}`;
    totalPriceHTML.innerHTML = `${total}`;
}

function addQuantity(id) {
    productQuantity = document.getElementById(`quantity-${id}`).value;
    cartList.forEach(item => {
        if (item.id == id) {
            productQuantity = productQuantity + 1;
            item.quantity = item.quantity + 1;
        }
    })
    showCartProducts();
}

function removeQuantity(id) {
    productQuantity = document.getElementById(`quantity-${id}`).value;
    cartList.forEach(item => {
        if (item.id == id) {
                productQuantity = productQuantity - 1;
                item.quantity = item.quantity - 1;
                if(item.quantity == 0){
                    item.quantity = 1;
                }
        }
    })
    showCartProducts();
}

const confirmButton = document.getElementById("confirm");
confirmButton.addEventListener("click", () => {
    Swal.fire({
        title: 'Gracias por su compra',
        icon: 'success',
        confirmButtonColor: 'black'
    })
})

showCartProducts();