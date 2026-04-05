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
    const input = document.getElementById("nameInput");
    if (input.value.trim() === "") {
        alert("Please enter a name");
        return;
    }

    await fetch("/api/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: input.value
        })
    });

    input.value = "";
    loadData();
}
async function deleteData(id) {
    await fetch(`/api/delete/${id}`, {
        method: "DELETE"
    });

    loadData();
}

loadData();