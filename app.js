const tableBody = document.getElementById("user-table-body");

fetch("https://gorest.co.in/public/v2/users")
  .then((response) => response.json())
  .then((users) => {
    tableBody.innerHTML = "";

    console.log(users);
    users.forEach((user) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.gender}</td>
        <td>
          <button>Edit</button>
          <button>Delete</button>
        </td>
      `;

      tableBody.appendChild(tr);
    });
  })
  .catch((error) => {
    console.error("Error fetching users:", error);
  });
