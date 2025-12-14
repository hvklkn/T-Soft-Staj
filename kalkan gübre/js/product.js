const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

fetch("productData.json")
    .then(r => r.json())
    .then(data => {
        const p = data.find(x => x.id === id);
        document.getElementById("detail").innerHTML = `
            <div class="card" style="max-width:600px;margin:40px auto;">
                <img src="${p.img}">
                <div class="card-body">
                    <h2>${p.name}</h2>
                    <p>Fiyat: <strong>${p.price} ₺</strong></p>
                    <p>${p.desc || "Bu ürün için açıklama eklenmemiştir."}</p>

                    <a class="btn" href="index.html">Geri Dön</a>
                </div>
            </div>
        `;
    });
