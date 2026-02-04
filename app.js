const tableBody = document.getElementById("user-table-body");

async function fetchUsers() {
  const authToken = localStorage.getItem("token") || "c734827ec1f508bd9bf3ff00c1c9c92822a2b21bc55b8976079a653a6c450e53";

  const headers = {
    "Content-Type": "application/json",
  };

  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  
  try {
    const response = await fetch("https://gorest.co.in/public/v2/users", { headers });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const users = await response.json();
  
    tableBody.innerHTML = "";
  
    users.forEach((user) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td >${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td class="gender">${user.gender.charAt(0).toUpperCase()+ user.gender.slice(1)}</td>
        <td class="status">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</td>
        <td>
          <button class="edit-btn" onclick="editUser(${user.id})">Edit</button>
          <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    tableBody.innerHTML = `<tr><td colspan="5">Error loading users. Please try again later.</td></tr>`;
  }
}




fetchUsers();