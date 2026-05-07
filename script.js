const API_URL = "https://sia-expencestracker-1.onrender.com/api/expenses";

async function loadData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log("Loaded Data:", data);
        renderList(data, 'Records');
    } catch (err) {
        console.error("Fetch Error:", err);
        document.getElementById('display-list').innerHTML = "<h3>Check if partner's Render link is alive</h3>";
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
        const id = item.id || item._id; // Check for both 'id' and '_id'
        listDiv.innerHTML += `
            <div class="expense-item">
                <div>
                    <strong>${item.type}</strong>: ₱${item.price} 
                    <br><small>Status: ${item.status}</small>
                </div>
                <div class="btn-group">
                    <button class="paid-btn" onclick="updateStatus('${id}', '${item.type}', ${item.price})">Paid</button>
                    <button class="del-btn" onclick="deleteItem('${id}')">Delete</button>
                </div>
            </div>
        `;
    });
}

async function addExpense() {
    const type = document.getElementById('type').value;
    const price = document.getElementById('price').value;
    const status = document.getElementById('status').value;

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, price, status })
    });

    if (response.ok) {
        loadData();
        document.querySelectorAll('.input-group input').forEach(i => i.value = '');
    } else {
        console.error("Add Error:", response.status);
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

async function searchExpenses() {
    const query = document.getElementById('searchInput').value;
    if (!query) return loadData();

    try {
        const response = await fetch(`${API_URL}/search?query=${query}`);
        const data = await response.json();
        renderList(data, `Results for: "${query}"`);
    } catch (err) {
        console.error("Search Error:", err);
        alert("Search failed. Ensure partner deployed the /search route.");
    }
}

async function deleteItem(id) {
    if (confirm("Delete this?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadData();
    }
}

loadData();