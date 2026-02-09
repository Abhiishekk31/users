const tableBody = document.querySelector(".user-table-body");
const editModal = document.querySelector(".edit-user-modal");
const addModal = document.querySelector(".add-user-modal");

let editingUserId = null;
const TOKEN = "c734827ec1f508bd9bf3ff00c1c9c92822a2b21bc55b8976079a653a6c450e53";

function validateUser(payload) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (payload.name.length < 3) {
    alert("Name must be at least 3 characters long.");
    return false;
  }

  if (!emailRegex.test(payload.email)) {
    alert("Please enter a valid email address.");
    return false;
  }

  if (!payload.gender || !payload.status) {
    alert("Please select gender and status.");
    return false;
  }

  return true;
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
    html="";
    users.forEach((user) => {
      html += `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.gender.charAt(0).toUpperCase()}${user.gender.slice(1)}</td>
        <td>${user.status.charAt(0).toUpperCase()}${user.status.slice(1)}</td>
        <td>
          <button class="edit-btn" onclick="editUser(${user.id})">Edit</button>
          <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
        </td>
      </tr>
      `;
    });
    tableBody.innerHTML = html; 
  } catch (err) {
    alert("Failed to load users");
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

function openAddModal() {
  addModal.style.display = "flex";
}

function closeAddModal() {
  addModal.style.display = "none";
  document.querySelector(".add-name").value = "";
  document.querySelector(".add-email").value = "";
}

async function addUser() {
  const payload = {
    name: document.querySelector(".add-name").value.trim(),
    email: document.querySelector(".add-email").value.trim(),
    gender: document.querySelector(".add-gender").value,
    status: document.querySelector(".add-status").value,
  };

  if (!payload.name || !payload.email) {
    alert("Please fill out the name and email.");
    return;
  }

  if(!validateUser(payload)) return;

  try {
    const response = await fetch("https://gorest.co.in/public/v2/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData[0]?.message || "Failed to create user");
    }

    alert("User added!");
    closeAddModal();
    fetchUsers();
  } catch (err) {
    alert(`Error: ${err.message}`);
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
  if(!validateUser(payload)) return;
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