from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

# Database setup
DATABASE = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'db.sqlite3')

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    with conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS Student (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER NOT NULL,
                major TEXT NOT NULL,
                fees INTEGER NOT NULL,
                grade TEXT NOT NULL
            )
        ''')
    conn.close()

init_db()

# Create a new student
@app.route('/api/student', methods=['POST'])
def add_student():
    name = request.json['name']
    age = request.json['age']
    major = request.json['major']
    fees = request.json['fees']
    grade = request.json['grade']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO Student (name, age, major, fees, grade) VALUES (?, ?, ?, ?, ?)
    ''', (name, age, major, fees, grade))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    
    return jsonify({
        'id': new_id,
        'name': name,
        'age': age,
        'major': major,
        'fees': fees,
        'grade': grade
    }), 201

# Get all students
@app.route('/api/students', methods=['GET'])
def get_students():
    conn = get_db_connection()
    students = conn.execute('SELECT * FROM Student').fetchall()
    conn.close()
    
    students_list = [dict(student) for student in students]
    return jsonify(students_list)

# Get a single student by id
@app.route('/api/student/<int:id>', methods=['GET'])
def get_student(id):
    conn = get_db_connection()
    student = conn.execute('SELECT * FROM Student WHERE id = ?', (id,)).fetchone()
    conn.close()
    
    if student is None:
        return jsonify({'error': 'Student not found'}), 404
    
    return jsonify(dict(student))

# Update a student
@app.route('/api/student/<int:id>', methods=['PUT'])
def update_student(id):
    name = request.json['name']
    age = request.json['age']
    major = request.json['major']
    fees = request.json['fees']
    grade = request.json['grade']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE Student SET name = ?, age = ?, major = ?, fees = ?, grade = ? WHERE id = ?
    ''', (name, age, major, fees, grade, id))
    conn.commit()
    conn.close()
    
    return jsonify({
        'id': id,
        'name': name,
        'age': age,
        'major': major,
        'fees': fees,
        'grade': grade
    })

# Delete a student
@app.route('/api/student/<int:id>', methods=['DELETE'])
def delete_student(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM Student WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Student deleted'})

if __name__ == '__main__':
    app.run(debug=True)
