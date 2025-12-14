let products = [];

fetch("productData.json")
    .then(r => r.json())
    .then(d => {
        products = d;
        render();
    });

function render() {
    const box = document.getElementById("productList");
    box.innerHTML = "";

    products.forEach(p => {
        box.innerHTML += `
            <div class="card">
                <div class="card-body">
                    <h3>${p.name}</h3>
                    <p>${p.price} ₺</p>
                    <button onclick="deleteProduct(${p.id})">Sil</button>
                </div>
            </div>
        `;
    });
}

function addProduct() {
    const obj = {
        id: Date.now(),
        name: document.getElementById("name").value,
        price: Number(document.getElementById("price").value),
        img: document.getElementById("img").value,
        desc: document.getElementById("desc").value
    };

    products.push(obj);
    save();
}

function deleteProduct(id) {
    products = products.filter(x => x.id !== id);
    save();
}

function save() {
    fetch("php/saveProducts.php", {
        method: "POST",
        body: JSON.stringify(products)
    }).then(() => render());
}
