const API_URL = "https://sia-expencestracker-1.onrender.com/api/expenses";

async function loadData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderList(data, 'Records');
    } catch (err) {
        document.getElementById('display-list').innerHTML = "<h3>Error connecting to API</h3>";
    }
}

function renderList(data, title) {
    const listDiv = document.getElementById('display-list');
    listDiv.innerHTML = `<h3>${title}</h3>`;
    
    if (data.length === 0) {
        listDiv.innerHTML += "<p>No records found.</p>";
        return;
    }

    data.forEach(item => {
        listDiv.innerHTML += `
            <div class="expense-item">
                <div>
                    <strong>${item.type}</strong>: ₱${item.price} 
                    <br><small>Status: ${item.status}</small>
                </div>
                <div class="btn-group">
                    <button class="paid-btn" onclick="updateStatus('${item.id}', '${item.type}', ${item.price})">Paid</button>
                    <button class="del-btn" onclick="deleteItem('${item.id}')">Delete</button>
                </div>
            </div>
        `;
    });
}

async function addExpense() {
    const type = document.getElementById('type').value;
    const price = document.getElementById('price').value;
    const status = document.getElementById('status').value;

    if (!type || !price) return alert("Fill in Type and Price");

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, price, status })
    });

    document.getElementById('type').value = '';
    document.getElementById('price').value = '';
    document.getElementById('status').value = '';
    loadData();
}

async function updateStatus(id, type, price) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: type,
            price: price,
            status: "paid"
        })
    });
    loadData();
}

async function searchExpenses() {
    const query = document.getElementById('searchInput').value;
    if (!query) return loadData();

    try {
        const response = await fetch(`${API_URL}/search?query=${query}`);
        const data = await response.json();
        renderList(data, `Results for: "${query}"`);
    } catch (err) {
        alert("Search failed. Check backend deployment.");
    }
}

async function deleteItem(id) {
    if (confirm("Delete this record?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadData();
    }
}

loadData();