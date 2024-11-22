from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

app = FastAPI()

DATABASE = "stay-logout/students/students.db"

# Kết nối tới SQLite
def get_connection():
    return sqlite3.connect(DATABASE)

# Mô hình dữ liệu (schema) cho học sinh
class Student(BaseModel):
    id: int
    name: str
    class_name: str
    math_grade: float
    english_grade: float

# API: Lấy danh sách học sinh
@app.get("/students")
def get_students():
    logger.info("Getting list of all students")
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM students")
        rows = cursor.fetchall()
        
        # Chuyển đổi kết quả thành danh sách dictionary
        students = [{"id": row[0], "name": row[1], "class": row[2], "math_grade": row[3], "english_grade": row[4]} for row in rows]
        logger.info(f"Successfully retrieved {len(students)} students")
        return {"students": students}
    except sqlite3.Error as e:
        logger.error(f"Database error while getting students: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if conn:
            conn.close()

# API: Lấy thông tin học sinh theo ID
@app.get("/students/{student_id}")
def get_student(student_id: int):
    logger.info(f"Getting student with ID: {student_id}")
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
        row = cursor.fetchone()

        if row is None:
            logger.warning(f"Student with ID {student_id} not found")
            raise HTTPException(status_code=404, detail="Student not found")
        
        logger.info(f"Successfully retrieved student with ID {student_id}")
        return {"id": row[0], "name": row[1], "class": row[2], "math_grade": row[3], "english_grade": row[4]}
    except sqlite3.Error as e:
        logger.error(f"Database error while getting student {student_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if conn:
            conn.close()

# API: Thêm học sinh mới
@app.post("/students")
def add_student(student: Student):
    logger.info(f"Adding new student with ID: {student.id}")
    conn = None
    try:
        # Validate grades
        if not isinstance(student.math_grade, (int, float)) or not isinstance(student.english_grade, (int, float)):
            logger.warning("Invalid grade types provided")
            raise HTTPException(status_code=400, detail="Grades must be numbers")
            
        if student.math_grade < 0 or student.math_grade > 10:
            logger.warning(f"Invalid math grade: {student.math_grade}")
            raise HTTPException(status_code=400, detail="Math grade must be between 0 and 10")
        if student.english_grade < 0 or student.english_grade > 10:
            logger.warning(f"Invalid english grade: {student.english_grade}")
            raise HTTPException(status_code=400, detail="English grade must be between 0 and 10")

        # Validate student ID
        if not isinstance(student.id, int) or student.id <= 0:
            logger.warning(f"Invalid student ID: {student.id}")
            raise HTTPException(status_code=400, detail="Invalid student ID")

        # Validate name and class
        if not student.name.strip():
            logger.warning("Empty student name provided")
            raise HTTPException(status_code=400, detail="Name cannot be empty")
        if not student.class_name.strip():
            logger.warning("Empty class name provided")
            raise HTTPException(status_code=400, detail="Class name cannot be empty")

        conn = get_connection()
        cursor = conn.cursor()

        # Kiểm tra ID có tồn tại chưa
        cursor.execute("SELECT * FROM students WHERE id = ?", (student.id,))
        if cursor.fetchone():
            logger.warning(f"Student ID {student.id} already exists")
            raise HTTPException(status_code=400, detail="Student ID already exists")
        
        # Thêm học sinh
        cursor.execute("""
        INSERT INTO students (id, name, class, math_grade, english_grade) 
        VALUES (?, ?, ?, ?, ?)
        """, (student.id, student.name.strip(), student.class_name.strip(), student.math_grade, student.english_grade))
        
        conn.commit()
        logger.info(f"Successfully added student with ID {student.id}")
        return {"message": "Student added successfully"}
    except sqlite3.Error as e:
        logger.error(f"Database error while adding student: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if conn:
            conn.close()

# API: Cập nhật thông tin học sinh
@app.put("/students/{student_id}")
def update_student(student_id: int, student: Student):
    logger.info(f"Updating student with ID: {student_id}")
    conn = None
    try:
        # Validate grades
        if not isinstance(student.math_grade, (int, float)) or not isinstance(student.english_grade, (int, float)):
            logger.warning("Invalid grade types provided")
            raise HTTPException(status_code=400, detail="Grades must be numbers")
            
        if student.math_grade < 0 or student.math_grade > 10:
            logger.warning(f"Invalid math grade: {student.math_grade}")
            raise HTTPException(status_code=400, detail="Math grade must be between 0 and 10")
        if student.english_grade < 0 or student.english_grade > 10:
            logger.warning(f"Invalid english grade: {student.english_grade}")
            raise HTTPException(status_code=400, detail="English grade must be between 0 and 10")

        # Validate name and class
        if not student.name.strip():
            logger.warning("Empty student name provided")
            raise HTTPException(status_code=400, detail="Name cannot be empty")
        if not student.class_name.strip():
            logger.warning("Empty class name provided")
            raise HTTPException(status_code=400, detail="Class name cannot be empty")

        conn = get_connection()
        cursor = conn.cursor()

        # Kiểm tra học sinh có tồn tại không
        cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
        if cursor.fetchone() is None:
            logger.warning(f"Student with ID {student_id} not found")
            raise HTTPException(status_code=404, detail="Student not found")

        # Cập nhật thông tin
        cursor.execute("""
        UPDATE students 
        SET name = ?, class = ?, math_grade = ?, english_grade = ? 
        WHERE id = ?
        """, (student.name.strip(), student.class_name.strip(), student.math_grade, student.english_grade, student_id))
        
        conn.commit()
        logger.info(f"Successfully updated student with ID {student_id}")
        return {"message": "Student updated successfully"}
    except sqlite3.Error as e:
        logger.error(f"Database error while updating student {student_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if conn:
            conn.close()

# API: Xóa học sinh
@app.delete("/students/{student_id}")
def delete_student(student_id: int):
    logger.info(f"Deleting student with ID: {student_id}")
    conn = None
    try:
        if not isinstance(student_id, int) or student_id <= 0:
            logger.warning(f"Invalid student ID: {student_id}")
            raise HTTPException(status_code=400, detail="Invalid student ID")
            
        conn = get_connection()
        cursor = conn.cursor()

        # Kiểm tra học sinh có tồn tại không
        cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
        if cursor.fetchone() is None:
            logger.warning(f"Student with ID {student_id} not found")
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Xóa học sinh
        cursor.execute("DELETE FROM students WHERE id = ?", (student_id,))
        conn.commit()
        logger.info(f"Successfully deleted student with ID {student_id}")
        return {"message": "Student deleted successfully"}
    except sqlite3.Error as e:
        logger.error(f"Database error while deleting student {student_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if conn:
            conn.close()