const API_URL = 'http://localhost:3000/api';

// ==================== CATEGORÍAS ====================
async function loadCategories(searchTerm = null) {
    let url = `${API_URL}/categories`;
    if (searchTerm && searchTerm.trim() !== '') {
        url = `${API_URL}/categories/search?name=${encodeURIComponent(searchTerm)}`;
    }
    const res = await fetch(url);
    const categories = await res.json();
    
    // Llenar el select de productos (sin XSS aquí)
    const select = document.getElementById('productCategory');
    select.innerHTML = '';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
    
    // Mostrar lista de categorías con contenido sanitizado
    const container = document.getElementById('categoryList');
    container.innerHTML = '';
    categories.forEach(cat => {
        const div = document.createElement('div');
        div.className = 'list-group-item d-flex justify-content-between align-items-center';
        const span = document.createElement('span');
        span.textContent = cat.name;
        div.appendChild(span);
        const btnGroup = document.createElement('div');
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-warning me-1';
        editBtn.textContent = '✏️';
        editBtn.onclick = () => editCategory(cat.id, cat.name);
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-danger';
        deleteBtn.textContent = '🗑️';
        deleteBtn.onclick = () => deleteCategory(cat.id);
        btnGroup.appendChild(editBtn);
        btnGroup.appendChild(deleteBtn);
        div.appendChild(btnGroup);
        container.appendChild(div);
    });
}

window.deleteCategory = async (id) => {
    await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
    loadCategories();
    loadProducts();
};

window.editCategory = async (id, oldName) => {
    const newName = prompt('Nuevo nombre:', oldName);
    if (newName) {
        await fetch(`${API_URL}/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        });
        loadCategories();
    }
};

document.getElementById('categoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('categoryName').value;
    await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    document.getElementById('categoryName').value = '';
    loadCategories();
});

// Búsqueda SQLi en categorías
document.getElementById('searchCategoryBtn').addEventListener('click', () => {
    const term = document.getElementById('searchCategoryInput').value;
    loadCategories(term);
});
document.getElementById('resetCategoryBtn').addEventListener('click', () => {
    document.getElementById('searchCategoryInput').value = '';
    loadCategories();
});

// ==================== PRODUCTOS ====================
async function loadProducts(searchTerm = null) {
    let url = `${API_URL}/products`;
    if (searchTerm && searchTerm.trim() !== '') {
        url = `${API_URL}/products/search?name=${encodeURIComponent(searchTerm)}`;
    }
    const res = await fetch(url);
    const products = await res.json();
    
    const container = document.getElementById('productList');
    container.innerHTML = '';
    products.forEach(prod => {
        const div = document.createElement('div');
        div.className = 'list-group-item';
        const header = document.createElement('div');
        header.className = 'd-flex justify-content-between';
        const nameEl = document.createElement('h5');
        nameEl.textContent = prod.name;
        const priceEl = document.createElement('strong');
        priceEl.textContent = `$${prod.price}`;
        header.appendChild(nameEl);
        header.appendChild(priceEl);
        div.appendChild(header);
        if (prod.description) {
            const descEl = document.createElement('p');
            descEl.textContent = prod.description;
            div.appendChild(descEl);
        }
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-danger';
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.onclick = () => deleteProduct(prod.id);
        div.appendChild(deleteBtn);
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-warning';
        editBtn.textContent = 'Editar';
        editBtn.onclick = () => editProduct(prod.id);
        div.appendChild(editBtn);
        container.appendChild(div);
    });
}

window.deleteProduct = async (id) => {
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    loadProducts();
};

window.editProduct = async (id) => {
    const newName = prompt('Nuevo nombre:');
    const newPrice = prompt('Nuevo precio:');
    if (newName && newPrice) {
        await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName, price: parseFloat(newPrice), description: '', category_id: 1 })
        });
        loadProducts();
    }
};

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDesc').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category_id = parseInt(document.getElementById('productCategory').value);
    await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price, category_id })
    });
    document.getElementById('productForm').reset();
    loadProducts();
});

document.getElementById('searchProductBtn').addEventListener('click', () => {
    const term = document.getElementById('searchProductInput').value;
    loadProducts(term);
});
document.getElementById('resetProductBtn').addEventListener('click', () => {
    document.getElementById('searchProductInput').value = '';
    loadProducts();
});

// Inicializar
loadCategories();
loadProducts();