const PRODUCTS_URL = "https://sergio3996.github.io/hardwarestore-img/json/products.json"

let products = [];
let productsByCategory = [];
let searchResult = [];
let categorySelected = "displays";

const ORDER_ASC_BY_PRICE = "+";
const ORDER_DESC_BY_PRICE = "-";

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

function sortProducts(criteria, array) {
    if (criteria === ORDER_ASC_BY_PRICE) {
        array = array.sort((a, b) => {
            if (parseInt(a.cost) < parseInt(b.cost)) { return -1; }
            if (parseInt(a.cost) > parseInt(b.cost)) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_PRICE) {
        array = array.sort((a, b) => {
            if (parseInt(a.cost) > parseInt(b.cost)) { return -1; }
            if (parseInt(a.cost) < parseInt(b.cost)) { return 1; }
            return 0;
        });
    }
    return array;
}

function showProducts() {
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
    productsByCategory = sortProducts(ORDER_ASC_BY_PRICE, productsByCategory);
    showProducts();
}

document.getElementById("search").addEventListener("keyup", () =>
    showProducts()
);

const categoryButton = document.querySelectorAll(".category");
categoryButton.forEach(btn => {
    btn.addEventListener("click", filterByCategory);
});

const sortButtonASC = document.getElementById("sort-asc");
sortButtonASC.addEventListener("click", () => {
    productsByCategory = sortProducts(ORDER_ASC_BY_PRICE, productsByCategory);
    console.log(productsByCategory);
    showProducts();
});
const sortButtonDESC = document.getElementById("sort-desc");
sortButtonDESC.addEventListener("click", () => {
    productsByCategory = sortProducts(ORDER_DESC_BY_PRICE, productsByCategory);
    console.log(productsByCategory);
    showProducts();
});


async function getJSONProducts() {
    const response = await
        fetch(PRODUCTS_URL)
    const json = await response.json();
    products = json;
    productsByCategory = products.filter(item => item.category === categorySelected);
    productsByCategory = sortProducts(ORDER_ASC_BY_PRICE, productsByCategory);
    showProducts();
}

getJSONProducts();


