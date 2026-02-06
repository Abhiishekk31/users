const tableBody = document.querySelector(".user-table-body");
const editModal = document.querySelector(".edit-user-modal");

let editingUserId = null;

const TOKEN = localStorage.getItem("token") || "c734827ec1f508bd9bf3ff00c1c9c92822a2b21bc55b8976079a653a6c450e53";

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function fetchUsers() {
  try {
    const response = await fetch("https://gorest.co.in/public/v2/users", {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(response.status);

    const users = await response.json();
    tableBody.innerHTML = "";

    users.forEach((user) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${capitalize(user.gender)}</td>
        <td>${capitalize(user.status)}</td>
        <td>
          <button class="edit-btn" onclick="editUser(${user.id})">Edit</button>
          <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    tableBody.innerHTML =
      `<tr><td colspan="6">Failed to load users</td></tr>`;
  }
}

async function deleteUser(id) {
  if (!confirm(`Delete user #${id}?`)) return;

  try {
    const response = await fetch(
      `https://gorest.co.in/public/v2/users/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    if (!response.ok) throw new Error("Delete failed");

    alert("User deleted");
    fetchUsers();
  } catch (err) {
    alert(err.message);
  }
}

async function editUser(id) {
  editingUserId = id;

  try {
    const response = await fetch(
      `https://gorest.co.in/public/v2/users/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Fetch failed");

    const user = await response.json();

    document.querySelector(".edit-name").value = user.name;
    document.querySelector(".edit-email").value = user.email;
    document.querySelector(".edit-gender").value = user.gender;
    document.querySelector(".edit-status").value = user.status;

    editModal.style.display = "flex";
  } catch (err) {
    alert("Failed to load user");
    console.error(err);
  }
}

async function updateUser() {
  if (!editingUserId) return;

  const payload = {
    name: document.querySelector(".edit-name").value.trim(),
    email: document.querySelector(".edit-email").value.trim(),
    gender: document.querySelector(".edit-gender").value,
    status: document.querySelector(".edit-status").value,
  };

  try {
    const response = await fetch(
      `https://gorest.co.in/public/v2/users/${editingUserId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) throw new Error("Update failed");

    alert("User updated");
    closeEditModal();
    fetchUsers();
  } catch (err) {
    alert(err.message);
  }
}

function closeEditModal() {
  editModal.style.display = "none";
  editingUserId = null;
}

fetchUsers();