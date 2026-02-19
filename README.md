# Book Review Site

A full-stack web app for adding and managing book reviews. Search for books using the Open Library API, and the app auto-fills book details like the author, cover image, publish year, and description.

## Tech Stack

- **Backend:** Python, Flask, SQLite
- **Frontend:** React, React Router
- **API:** Open Library (book search and cover images)

## Features

- Search for books by title with auto-suggestions from Open Library
- Book cover images, author, publish year, and description auto-fill when you select a suggestion
- Add, edit, and delete book reviews
- Detail page for each book with full review info
- Responsive card-based layout

## Setup (For Windows)

### Backend

```bash
cd book-review-site
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py               
```
Note: Flask will start on port 5001

### Frontend

```bash
cd frontend
npm install
npm start                    
```
Note: React will start on port 3000

Open http://localhost:3000 in your browser.