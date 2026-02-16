import sqlite3
from flask import Flask, request, jsonify

app = Flask(__name__)
book_db = "books.db"

def get_db():
    """Connect to database"""

    conn = sqlite3.connect(book_db)
    return conn

def init_db():
    """Create books table if it does not exist"""

    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            reviewer TEXT,
            rating INTEGER NOT NULL,
            review TEXT
        )
    """)
    conn.commit()
    conn.close()

# Create table when app starts
init_db()




if __name__ == "__main__":
    app.run(debug=True)