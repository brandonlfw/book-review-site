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


@app.route("/books", methods=["POST"])
def add_book():
    data = request.get_json()

    # Missing data -> return error msg
    if not data or "title" not in data or "rating" not in data:
        return jsonify({"error": "Title is required"}), 400
    
    # Save new book review to database
    conn = get_db()
    cursor = conn.execute(
        """
            INSERT INTO books (title, reviewer, rating, review)
            VALUES (?, ?, ?, ?)
        """,
        (data["title"], data.get("reviewer", "Anonymous"), data["rating"], data.get["review", "No review"])
    )
    conn.commit()
    book_id = cursor.lastrowid
    conn.close()

    # Post new book review to '/books' endpoint
    new_book = {
        "id": book_id,
        "title": data["title"],
        "reviewer": data.get("reviewer", "Anonymous"), 
        "rating": data["rating"], 
        "review": data.get["review", "No review"]
    }

    return jsonify(new_book), 201



if __name__ == "__main__":
    app.run(debug=True)