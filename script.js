const starterProducts = [
  { name: "Cotton Fabric", category: "Textiles",
    price: 120, quantity: 50 },
  { name: "Paper Packaging", category: "Packaging",
    price: 8, quantity: 200 },
  { name: "Wooden Boxes", category: "Storage",
    price: 45, quantity: 75 }
];

let products;

try {
  const saved = localStorage.getItem("stockloop-products");
  products = saved ? JSON.parse(saved) : starterProducts;
  if (!Array.isArray(products)) products = starterProducts;
} catch {
  products = starterProducts;
}

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search");
const form = document.getElementById("stock-form");

function saveProducts() {
  try {
    localStorage.setItem(
      "stockloop-products", JSON.stringify(products)
    );
  } catch {
    document.getElementById("message").textContent =
      "Changes may not be saved in this browser.";
  }
}

function renderProducts() {
  const query = searchInput.value.toLowerCase().trim();

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query)
  );

  productList.replaceChildren();

  if (filtered.length === 0) {
    productList.textContent = "No matching products found.";
  }

  filtered.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const name = document.createElement("h3");
    name.textContent = product.name;

    const category = document.createElement("p");
    category.textContent = "Category: " + product.category;

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = "₹" + product.price + " per unit";

    const quantity = document.createElement("p");
    quantity.textContent = "Quantity: " + product.quantity;

    card.append(name, category, price, quantity);
    productList.appendChild(card);
  });

  document.getElementById("total-products").textContent =
    products.length;

  document.getElementById("total-units").textContent =
    products.reduce((sum, p) => sum + Number(p.quantity), 0);
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("product-name")
    .value.trim();
  const category = document.getElementById("category")
    .value.trim();
  const price = Number(document.getElementById("price").value);
  const quantity = Number(
    document.getElementById("quantity").value
  );

  if (!name || !category || price < 0 ||
      !Number.isFinite(price) || !Number.isInteger(quantity) ||
      quantity < 1) {
    document.getElementById("message").textContent =
      "Please enter valid product details.";
    return;
  }

  products.push({ name, category, price, quantity });
  saveProducts();
  form.reset();
  searchInput.value = "";
  renderProducts();

  document.getElementById("message").textContent =
    "Product added successfully!";
});

searchInput.addEventListener("input", renderProducts);

renderProducts();