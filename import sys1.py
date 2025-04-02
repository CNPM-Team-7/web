from flask import Flask, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
import datetime
import csv
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///attendance.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Model lưu thông tin nhân viên và chấm công
class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)

class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'), nullable=False)
    check_in = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    check_out = db.Column(db.DateTime, nullable=True)

# Tạo database nếu chưa có
def create_tables():
    with app.app_context():
        db.create_all()

# Chạy tạo database trước khi khởi động ứng dụng
create_tables()

# API nhân viên chấm công
@app.route('/check-in', methods=['POST'])
def check_in():
    data = request.json
    employee_id = data.get('employee_id')
    
    if not employee_id:
        return jsonify({'error': 'Employee ID is required'}), 400
    
    employee = Employee.query.get(employee_id)
    if not employee:
        return jsonify({'error': 'Employee not found'}), 404
    
    attendance = Attendance(employee_id=employee_id)
    db.session.add(attendance)
    db.session.commit()
    
    return jsonify({'message': 'Check-in successful', 'check_in_time': attendance.check_in})

# API nhân viên check-out
@app.route('/check-out', methods=['POST'])
def check_out():
    data = request.json
    employee_id = data.get('employee_id')
    
    if not employee_id:
        return jsonify({'error': 'Employee ID is required'}), 400
    
    attendance = Attendance.query.filter_by(employee_id=employee_id, check_out=None).first()
    if not attendance:
        return jsonify({'error': 'No active check-in found'}), 400
    
    attendance.check_out = datetime.datetime.utcnow()
    db.session.commit()
    
    return jsonify({'message': 'Check-out successful', 'check_out_time': attendance.check_out})

# API lấy danh sách chấm công
@app.route('/attendance', methods=['GET'])
def get_attendance():
    records = Attendance.query.all()
    result = [{'id': r.id, 'employee_id': r.employee_id, 'check_in': r.check_in, 'check_out': r.check_out} for r in records]
    return jsonify(result)

# API xuất dữ liệu chấm công ra file CSV
@app.route('/export', methods=['GET'])
def export_attendance():
    filename = 'attendance_records.csv'
    if not os.path.exists(filename):
        return jsonify({'error': 'No attendance records found'}), 404
    
    with open(filename, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['ID', 'Employee ID', 'Check-in', 'Check-out'])
        records = Attendance.query.all()
        for r in records:
            writer.writerow([r.id, r.employee_id, r.check_in, r.check_out])
    
    return send_file(filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
