if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}

async function loadData() {
    const response = await fetch("/api/all");
    const data = await response.json();

    const dataList = document.getElementById("dataList");
    dataList.innerHTML = "";

    data.forEach(item => {
        let html = "";

        Object.keys(item).forEach(key => {
            if (key !== "id") {
                html += `<p><strong>${key}:</strong> ${item[key]}</p>`;
            }
        });

        dataList.innerHTML += `
            <div class="item">
                <div class="item-content">${html}</div>
                <div class="buttons">
                    <button class="edit-btn" onclick='editRecord(${JSON.stringify(item)})'>Edit</button>
                    <button class="delete-btn" onclick="deleteData(${item.id})">Delete</button>
                </div>
            </div>
        `;
    });
}

document.getElementById("welcomeText").textContent =
    "Welcome, " + localStorage.getItem("username") + " 👋";

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");

    window.location.href = "login.html";
});

async function addData() {
    const name = document.getElementById("nameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();

    if (!name || !email) {
        alert("Name and Email are required");
        return;
    }

    const record = {
        id: Date.now(),
        name,
        email,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
    };

    document.querySelectorAll(".extra-field").forEach(fieldDiv => {
        const input = fieldDiv.querySelector("input");

        if (input.type === "checkbox") {
            record[input.id] = input.checked;
        } else {
            record[input.id] = input.value.trim();
        }
    });

    await fetch("/api/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(record)
    });
    document.getElementById("nameInput").value = "";
    document.getElementById("emailInput").value = "";
    extraFields.innerHTML = "";

    loadData();
}


async function deleteData(id) {
    const confirmDelete = confirm(
        "Are you sure nigga you want to delete this record?"
    );

    if (!confirmDelete) {
        return;
    }

    await fetch(`/api/delete/${id}`, {
        method: "DELETE"
    });

    loadData();
}

// EDIT RECORDS
async function editRecord(record) {
    const updated = { ...record };

    for (const key in updated) {
        if (key === "id" || key === "createdAt") continue;

        const value = prompt(`Enter ${key}`, updated[key]);

        if (value !== null) {
            updated[key] = value;
        }
    }

    updated.updatedAt = new Date().toLocaleString();

    await fetch(`/api/edit/${record.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updated)
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

const themeToggle = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

const addFieldBtn = document.getElementById("addFieldBtn");
const fieldSelect = document.getElementById("fieldSelect");
const extraFields = document.getElementById("extraFields");

addFieldBtn.addEventListener("click", () => {
    const field = fieldSelect.value;

    if (!field) {
        alert("Please choose a field");
        return;
    }

    if (document.getElementById(`field-${field}`)) {
        alert("Field already added");
        return;
    }

    const fieldDiv = document.createElement("div");
    fieldDiv.className = "extra-field";
    fieldDiv.id = `field-${field}`;

    if (field === "isActive") {
        fieldDiv.innerHTML = `
            <label>
                <input type="checkbox" id="${field}">
                ${field}
            </label>
            <button type="button" onclick="removeField('${field}')">✖</button>
        `;
        } else {
        fieldDiv.innerHTML = `
            <input type="text" id="${field}" placeholder="Enter ${field}">
            <button type="button" onclick="removeField('${field}')">✖</button>
        `;
    }

    extraFields.appendChild(fieldDiv);
});

function removeField(field) {
    const element = document.getElementById(`field-${field}`);
    if (element) {
        element.remove();
    }
}

loadData();