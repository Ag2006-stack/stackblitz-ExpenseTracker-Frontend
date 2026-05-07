const API_URL = "https://sia-expencestracker-1.onrender.com/api/expenses"

async function loadData() {
    try {
        const response = await fetch(API_URL)

        if (!response.ok) {
            throw new Error("Failed to fetch")
        }

        const data = await response.json()

        renderList(data, "Expense Records")

    } catch (error) {
        document.getElementById('display-list').innerHTML =
            "<h3>Server Error</h3>"
    }
}

function renderList(data, title) {

    const listDiv = document.getElementById('display-list')

    listDiv.innerHTML = `<h3>${title}</h3>`

    if (data.length === 0) {
        listDiv.innerHTML += `<p>No records found</p>`
        return
    }

    data.forEach(item => {

        listDiv.innerHTML += `
            <div class="expense-item">

                <div>
                    <strong>${item.type}</strong>
                    <br>
                    Price: ₱${item.price}
                    <br>
                    Status: ${item.status}
                </div>

                <div class="btn-group">

                    <button
                        class="paid-btn"
                        onclick="markPaid(${item.id})"
                    >
                        Paid
                    </button>

                    <button
                        class="del-btn"
                        onclick="deleteExpense(${item.id})"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `
    })
}

async function addExpense() {

    const type = document.getElementById('type').value
    const price = document.getElementById('price').value
    const status = document.getElementById('status').value || "unpaid"

    if (!type || !price) {
        alert("Please fill all fields")
        return
    }

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type,
                price,
                status
            })
        })

        if (!response.ok) {
            throw new Error("Failed to add")
        }

        document.getElementById('type').value = ""
        document.getElementById('price').value = ""
        document.getElementById('status').value = ""

        loadData()

    } catch (error) {
        alert("Error adding expense")
    }
}

async function searchExpenses() {

    const query = document.getElementById('searchInput').value

    if (!query) {
        loadData()
        return
    }

    try {

        const response = await fetch(`/api/search?type=${query}`)

        if (!response.ok) {
            throw new Error("Search failed")
        }

        const data = await response.json()

        renderList(data, `Search Results: ${query}`)

    } catch (error) {
        alert("Search error")
    }
}

async function markPaid(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: "paid"
            })
        })

        if (!response.ok) {
            throw new Error("Update failed")
        }

        loadData()

    } catch (error) {
        alert("Error updating status")
    }
}

async function deleteExpense(id) {

    const confirmDelete = confirm("Delete this expense?")

    if (!confirmDelete) {
        return
    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        })

        if (!response.ok) {
            throw new Error("Delete failed")
        }

        loadData()

    } catch (error) {
        alert("Error deleting expense")
    }
}

loadData()