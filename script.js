// Hiển thị đồng hồ thời gian thực
function updateClock() {
    const now = new Date();
    document.getElementById('clock-time').textContent = now.toLocaleTimeString('vi-VN', { hour12: false });
}
setInterval(updateClock, 1000);

// Xử lý chấm công
document.getElementById('check-in').addEventListener('click', function () {
    const now = new Date();
    const timeString = now.toLocaleTimeString('vi-VN', { hour12: false });

    const table = document.getElementById('attendance-table');
    const newRow = table.insertRow(-1);
    newRow.innerHTML = `<td>Nhân Viên</td><td>${timeString}</td><td>Chưa Ra</td><td>✅</td>`;

    alert("Bạn đã chấm công vào lúc: " + timeString);
});
