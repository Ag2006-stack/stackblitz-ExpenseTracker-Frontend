const API_URL = 'https://sia-expencestracker-1.onrender.com/api/expenses';

async function loadData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const listDiv = document.getElementById('display-list');
    listDiv.innerHTML = '<h3>Records</h3>';

    data.forEach((item) => {
      listDiv.innerHTML += `
                <div class="expense-item">
                    <div>
                        <strong>${item.type}</strong>: ₱${item.price} 
                        <br><small>Status: ${item.status}</small>
                    </div>
                    <button class="del-btn" onclick="deleteItem('${item.id}')">Delete</button>
                </div>
            `;
    });
  } catch (err) {
    document.getElementById('display-list').innerHTML =
      '<h3>Error connecting to API</h3>';
  }
}

async function addExpense() {
  const type = document.getElementById('type').value;
  const price = document.getElementById('price').value;
  const status = document.getElementById('status').value;

  if (!type || !price) return alert('Please fill in Type and Price');

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, price, status }),
  });

  document.getElementById('type').value = '';
  document.getElementById('price').value = '';
  document.getElementById('status').value = '';

  loadData();
}

async function deleteItem(id) {
  if (confirm('Delete this record?')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadData();
  }
}

loadData();
