async function loadData() {
    const response = await fetch("/api/all");
    const data = await response.json();

    const searchValue = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const dataList = document.getElementById("dataList");
    dataList.innerHTML = "";

    const filtered = data.filter(item =>
        item.name.toLowerCase().includes(searchValue) ||
        item.email.toLowerCase().includes(searchValue)
    );

    filtered.forEach(item => {
        dataList.innerHTML += `
            <div class="item">
                <div>
                    <h3>${item.name}</h3>
                    <p>${item.email}</p>
                </div>

                <div class="buttons">
                    <button class="edit-btn" onclick="editData(${item.id}, '${item.name}', '${item.email}')">Edit</button>
                    <button class="delete-btn" onclick="deleteData(${item.id})">Delete</button>
                </div>
            </div>
        `;
    });
}

async function addData() {
    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (name === "" || email === "") {
        alert("Please fill all fields");
        return;
    }

    await fetch("/api/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email })
    });

    nameInput.value = "";
    emailInput.value = "";

    loadData();
}
async function deleteData(id) {
    await fetch(`/api/delete/${id}`, {
        method: "DELETE"
    });

    loadData();
}

async function editData(id, currentName, currentEmail) {
    const newName = prompt("Enter new name:", currentName);
    if (newName === null) return;

    const newEmail = prompt("Enter new email:", currentEmail);
    if (newEmail === null) return;

    await fetch(`/api/edit/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: newName,
            email: newEmail
        })
    });

    loadData();
}

loadData();