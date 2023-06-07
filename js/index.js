const PRODUCTS_URL = "https://sergio3996.github.io/hardwarestore-img/json/products.json"

let products = [];
let productsByCategory = [];
let searchResult = [];
let categorySelected = "displays";

// SWEET ALERT
const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    color: 'White',
    background: 'black',
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
// SWEET ALERT

function searchItem() {
    let input = document.getElementById("search");
    let inputValue = input.value.toLowerCase();
    searchResult = productsByCategory.filter(item => item.name.toLocaleLowerCase().includes(inputValue));
}

async function showProducts() {
    productsByCategory = products.filter(item => item.category === categorySelected);

    let input = document.getElementById("search");
    let inputValue = input.value.toLowerCase();
    const productsList = document.getElementById("products");
    productsList.innerHTML = ""

    if (inputValue != "") {
        searchItem();
        searchResult.forEach((item) => {
            productsList.innerHTML += `<div class="productCard">
                                        <img src="${item.image}" alt="">
                                        <h3>${item.name}</h3>
                                        <p>US$ ${item.cost}</p>
                                        <button onclick="addToCart(${item.id})">Comprar</button>
                                    </div>`;
        })
    } else {
        productsByCategory.forEach((item) => {
            productsList.innerHTML += `<div class="productCard">
                                        <img src="${item.image}" alt="">
                                        <h3>${item.name}</h3>
                                        <p>US$ ${item.cost}</p>
                                        <button onclick="addToCart(${item.id})">Comprar</button>
                                    </div>`;
        })
    }
}

function addToCart(id) {
    let duplicate = false;
    let cartList = JSON.parse(localStorage.getItem('cart')) || [];

    cartList.forEach((item) => {
        item.id == id ? duplicate = true : duplicate = false;
    })

    if (duplicate) {
        Toast.fire({
            icon: 'error',
            title: 'Ese producto ya existe en su carrito'
          })
    } else {
        products.forEach((item) => {
            if (id == item.id) {
                item.quantity = 1;
                cartList.push(item);
                localStorage.setItem('cart', JSON.stringify(cartList));
                Toast.fire({
                    icon: 'success',
                    title: 'Producto agregado al carrito'
                  })
            }
        })
    }
}

function filterByCategory(event) {
    categorySelected = event.target.dataset.category;
    productsByCategory = products.filter(item => item.category === categorySelected);
    showProducts();
}

document.getElementById("search").addEventListener("keyup", () =>
    showProducts()
);

const categoryButton = document.querySelectorAll(".category");

categoryButton.forEach(btn => {
    btn.addEventListener("click", filterByCategory);
});

async function getJSONProducts() {
    const response = await
        fetch(PRODUCTS_URL)
    const json = await response.json();
    products = json;
    showProducts();
}

getJSONProducts();


