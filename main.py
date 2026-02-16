import sqlite3
from flask import Flask, request, jsonify

app = Flask(__name__)
book_db = "books.db"

def get_db():
    """Connect to database"""

    conn = sqlite3.connect(book_db)
    conn.row_factory = sqlite3.Row
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


@app.route("/books", methods=["GET"])
def get_books():
    """Get all books"""

    conn = get_db()
    books = conn.execute("SELECT * FROM books").fetchall()
    conn.close()
    return jsonify([dict(book) for book in books]), 200



@app.route("/books/<int:id>", methods=["GET"])
def get_book(id):
    """Get a single book by id"""

    conn = get_db()
    book = conn.execute("""
        SELECT * FROM books
        WHERE id = ?
    """,(id,)).fetchone()
    conn.close()

    if book is None:
        return jsonify({"error": "Book not found"}), 404
    return jsonify(dict(book)), 200



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
        (data["title"], data.get("reviewer", "Anonymous"), data["rating"], data.get("review", "No review")
        )
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
        "review": data.get("review", "No review")
    }

    return jsonify(new_book), 201


@app.route("/books/<int:id>", methods=["PUT"])
def update_review(id):
    data = request.get_json()

    if not data or "title" not in data or "rating" not in data:
        return jsonify({"error": "Title and rating are required"}), 400

    conn = get_db()
    result = conn.execute("""
        UPDATE books
        SET title = ?,
            reviewer = ?,
            rating = ?,
            review = ?
        WHERE id = ?
    """,(data["title"], data.get("reviewer", "Anonymous"), data["rating"], data.get("review", "No review"), id)
    )
    conn.commit()
    rows_updated = result.rowcount
    conn.close()

    if rows_updated == 0:
        return jsonify({"error": "Review not found"}), 400
    
    updated_review = {
        "id": id,
        "title": data["title"],
        "reviewer": data.get("reviewer", "Anonymous"),
        "rating": data["rating"],
        "review": data.get("review", "No review")
    }

    return jsonify(updated_review), 200

if __name__ == "__main__":
    app.run(debug=True, port=5001)