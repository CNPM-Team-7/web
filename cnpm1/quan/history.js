// Khi tải trang, hiển thị dữ liệu lịch sử điểm danh
document.addEventListener("DOMContentLoaded", function () {
    let table = document.getElementById("attendanceTable"); // ⚠ Đổi đúng ID bảng
    let history = JSON.parse(localStorage.getItem("attendanceHistory")) || [];

    table.innerHTML = `
        <tr>
            <th>Stt</th>
            <th>Họ tên</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Phòng ban</th>
            <th>Thời gian đến làm</th>
        </tr>
    `;

    if (history.length === 0) {
        let newRow = table.insertRow();
        newRow.innerHTML = `<td colspan="6">Chưa có dữ liệu lịch sử điểm danh.</td>`;
    } else {
        history.forEach((entry, index) => {
            let newRow = table.insertRow();
            newRow.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.name}</td>
                <td>${entry.phone}</td>
                <td>${entry.email}</td>
                <td>${entry.department}</td>
                <td>${entry.time}</td>
            `;
        });
    }
});

// Xóa toàn bộ lịch sử điểm danh
document.getElementById("deleteHistoryBtn").addEventListener("click", function () {
    if (confirm("Bạn có chắc chắn muốn xoá toàn bộ lịch sử điểm danh?")) {
        localStorage.removeItem("attendanceHistory");
        location.reload();
    }
});
