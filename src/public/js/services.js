const API_URL = "http://localhost:3001/api";
let TEXT = '';
let PRODUCTS = [];
async function fillProducts(params) {
    const products = await getProducts(params);
    let cardsProducts = document.getElementById('cards-products');
    let quantityProducts = document.getElementById('quantity-elements');
    let pagination = document.getElementById('pagination');
    quantityProducts.innerHTML = `${products[1].TotalProducts} productos`;
    cardsProducts.innerHTML='';
    pagination.innerHTML='';
    let totalPages = products[1].TotalProducts / products[1].PageSize;
    let mod = products[1].TotalProducts % products[1].PageSize;
    if(mod != 0) totalPages = parseInt(totalPages) + 1;
    for(let i = 1; i <= totalPages; i++){
        pagination.innerHTML += `<li class="page-item"><a class="page-link" onClick="fill(TEXT,${i})" href="#">${i}</a></li>`
    }
    products[0].forEach( element => {
        let imgUrl = element.url_image;
        if(element.url_image == null || element.url_image == '') imgUrl = 'img/no_available.jpg'
        addHTML = `
            <li class="cards_item">
            <div class="card">
                <div class="card_image"><img src="${imgUrl}"></div>
                <div class="card_content">
                <h2 class="card_title">${element.name}</h2>`
        if(element.discount > 0 && element.discount != null){
            addHTML += `<div class="card_text_discount">
                            <p class="last_price">$ ${element.price}</p> 
                            <p class="new_price">$ ${element.price * (100 - element.discount) / 100}</p>
                        </div>`
        }else {
            addHTML += `<p class="card_text">$ ${element.price}</p>`
        }
        addHTML +=`<button class="btn-new card_btn" onClick="addCart(${element.id},'${element.name}',${element.price},${element.discount})">Agregar</button></div></div></li>`;
        cardsProducts.innerHTML+=addHTML;
    })
}

function fill(text,page){
    TEXT = text;
    const params = {
        description: text,
        page
    }
    fillProducts(params);
    fillCategories(params);
}

function addCart(id,name, price, discount){
    const quantityCart = document.getElementById('quantity_cart_products');
    let exist = 0;
    PRODUCTS.forEach(product => {
        if(product.id == id) {
            exist = 1;
            product.quantity ++;
        }
    })

    if(exist == 0) PRODUCTS.push({id,name, price, discount, quantity: 1});
    quantityCart.innerHTML = `${PRODUCTS.length}`;
}

function removeCart(id){
    const quantityCart = document.getElementById('quantity_cart_products');
    PRODUCTS.forEach((product, index) => {
        if(product.id == id) {
            product.quantity--;
            if(product.quantity == 0){
                PRODUCTS.splice(index, 1);
            }
        }
    })
    quantityCart.innerHTML = `${PRODUCTS.length}`;
}

function fillCart(){
    if(PRODUCTS.length > 0){
        const cart_body = document.getElementById('cart_body');
        const total_cart = document.getElementById('total_cart');
        cart_body.innerHTML = '';
        let total = 0;
        PRODUCTS.forEach( product => {
            const newPrice = product.price * (100 - product.discount) / 100;
            total += newPrice * product.quantity;
            cart_body.innerHTML += `
            <tr>
                <td>${product.name}</td>
                <td>$ ${newPrice}</td>
                <td>${product.quantity}</td>
                <td>
                <a class="nav-link" onclick="addCart(${product.id},'${product.name}',${product.price},${product.discount});fillCart();">
                    <i class="material-icons">add</i>
                </a>
                </td>
                <td>
                <a class="nav-link" onclick="removeCart(${product.id});fillCart();">
                    <i class="material-icons">remove</i>
                </a>
                </td>
            </tr>
            `
        })
        total_cart.innerHTML = `Total: $ ${total}`;
    }else{
        alert('No tiene productos en el carrito')
        
        setTimeout(() => {
            $("#exampleModal").modal("hide");
        }, 500);
    }
}

function changeCategory(category){
    const params = {
        description: TEXT,
        category
    }
    fillProducts(params)
}

async function getProducts (params){
    const description= params?.description || '';
    const page= params?.page || 1;
    const category = params?.category || 'Todos';
    const res = await fetch(`${API_URL}/products?description=${description}&page=${page}&category=${category}`, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return await res.json();
}

async function getCategoriesWithProducts (params){
    const description = params?.description || '';
    const res = await fetch(`${API_URL}/categories?description=${description}`, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return await res.json();
}

async function fillCategories(params){
    const categories = await getCategoriesWithProducts(params);
    const selectCategories = document.getElementById('select-category');
    selectCategories.innerHTML = '<option selected>Todos</option>';
    categories.forEach( category => {
        const newName = category.name.charAt(0).toUpperCase() + category.name.slice(1);
        selectCategories.innerHTML += `<option value="${category.id}">${newName} (${category.quantityProducts})</option>`;
    })
}

function finish(){
    if(PRODUCTS.length == 0){
        alert('No hay nada en su carrito');
        $("#exampleModal").modal("hide");
    }else{
        alert('Compra finalizada satisfactoriamente');
        $("#exampleModal").modal("hide");
        PRODUCTS = [];
        let quantityProducts = document.getElementById('quantity_cart_products');
        quantityProducts.innerHTML = '';
    }
}