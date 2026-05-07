const BASE_URL = "https://sia-expencestracker-1.onrender.com/api/expenses";
const API_URL = `${BASE_URL}/api/expenses`;

async function loadData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderList(data, 'Records');
    } catch (err) {
        document.getElementById('display-list').innerHTML = "<h3>Server Error</h3>";
    }
}

function renderList(data, title) {
    const listDiv = document.getElementById('display-list');
    listDiv.innerHTML = `<h3>${title}</h3>`;
    
    if (!data || data.length === 0) {
        listDiv.innerHTML += "<p>No records found.</p>";
        return;
    }

    data.forEach(item => {
        const itemId = item.id || item._id;
        listDiv.innerHTML += `
            <div class="expense-item">
                <div>
                    <strong>${item.type}</strong>: ₱${item.price} 
                    <br><small>Status: ${item.status || 'unpaid'}</small>
                </div>
                <div class="btn-group">
                    <button class="paid-btn" onclick="updateStatus('${itemId}', '${item.type}', ${item.price})">Paid</button>
                    <button class="del-btn" onclick="deleteItem('${itemId}')">Delete</button>
                </div>
            </div>
        `;
    });
}

async function addExpense() {
    const type = document.getElementById('type').value;
    const price = document.getElementById('price').value;
    const status = document.getElementById('status').value || "unpaid";

    if (!type || !price) return alert("Please enter Type and Price");

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

async function searchExpenses() {
    const typeQuery = document.getElementById('searchInput').value;
    if (!typeQuery) return loadData();

    try {
        const response = await fetch(`${BASE_URL}/api/search?type=${typeQuery}`);
        const data = await response.json();
        renderList(data, `Results for: "${typeQuery}"`);
    } catch (err) {
        alert("Search failed. Ensure the search route is live.");
    }
}

async function updateStatus(id, type, price) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, price, status: "paid" })
    });
    loadData();
}

async function deleteItem(id) {
    if (confirm("Are you sure?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadData();
    }
}

loadData();