let employeeTable = document.getElementById('employeeTable');
let employeeId = 1;

// Khi tải lại trang, hiển thị danh sách nhân viên từ LocalStorage
document.addEventListener("DOMContentLoaded", function () {
    let employees = JSON.parse(localStorage.getItem("employeeList")) || [];
    employeeId = employees.length + 1; // Cập nhật ID

    employees.forEach((emp) => {
        addEmployeeToTable(emp);
    });
});

// Hàm nhập nhân viên mới
function addEmployee() {
    let name = prompt("Nhập họ tên nhân viên:");
    if (!name) return;

    let department = prompt("Nhập phòng ban:");
    if (!department) return;

    let email = prompt("Nhập email:");
    if (!email) return;

    let phone = prompt("Nhập số điện thoại:");
    if (!phone) return;

    let checkInTime = new Date().toLocaleString(); // Lưu thời gian điểm danh

    let newEmployee = { id: employeeId, name, department, email, phone, time: checkInTime };

    // Lưu vào LocalStorage (Danh sách nhân viên)
    let employees = JSON.parse(localStorage.getItem("employeeList")) || [];
    employees.push(newEmployee);
    localStorage.setItem("employeeList", JSON.stringify(employees));

    // Lưu vào LocalStorage (Lịch sử điểm danh)
    let historyData = JSON.parse(localStorage.getItem("attendanceHistory")) || [];
    historyData.push({ name, department, email, phone, time: checkInTime });
    localStorage.setItem("attendanceHistory", JSON.stringify(historyData));

    // Thêm vào bảng hiển thị
    addEmployeeToTable(newEmployee);

    alert(`${name} đã được thêm vào danh sách và điểm danh lúc ${checkInTime}`);

    employeeId++;
}

// Hàm thêm nhân viên vào bảng
function addEmployeeToTable(emp) {
    let newRow = employeeTable.insertRow();
    newRow.innerHTML = `
        <td>${emp.id}</td>
        <td>${emp.name}</td>
        <td>${emp.department}</td>
        <td>${emp.email}</td>
        <td>${emp.phone}</td>
        <td>${emp.time}</td>
        <td>
            <button class="delete-btn" onclick="deleteEmployee(this, ${emp.id})">Xóa</button>
        </td>
    `;
}

// Xóa nhân viên
function deleteEmployee(button, id) {
    let employees = JSON.parse(localStorage.getItem("employeeList")) || [];
    employees = employees.filter(e => e.id !== id);
    localStorage.setItem("employeeList", JSON.stringify(employees));

    button.closest('tr').remove();
}
