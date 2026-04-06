async function loadData() {
    const response = await fetch("/api/all");
    const data = await response.json();

    const dataList = document.getElementById("dataList");
    dataList.innerHTML = "";

    data.forEach(item => {
        dataList.innerHTML += `
            <div class="item">
                <span>${item.name}</span>
                <button onclick="deleteData(${item.id})">Delete</button>
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

loadData();