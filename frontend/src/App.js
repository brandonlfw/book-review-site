import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState([]); // books starts as empty array, setBooks updates that value
  const [title, setTitle] = useState('');
  const [reviewer, setReviewer] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch('/books')
      .then(res => res.json()) // parses JSON response from Flask into JS array of books
      .then(data => setBooks(data)); // setBooks(data) stores array of book objects into books state var
  }, []);


  // sends POST request to Flask, then adds review to books array
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // editing an existing book — send PUT
      fetch(`/books/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, reviewer, rating, review })
      })
        .then(res => res.json())
        .then(updatedBook => {
          setBooks(books.map(book => book.id === editingId ? updatedBook : book));

          // clear form
          setEditingId(null);
          setTitle('');
          setReviewer('');
          setRating(5);
          setReview('');
        });
    } else {
      // adding a new book — send POST
      fetch('/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, reviewer, rating, review })
      })
        .then(res => res.json())
        .then(newBook => {
          setBooks([...books, newBook]);

          // clear form
          setTitle('');
          setReviewer('');
          setRating(5);
          setReview('');
        });
    }
  };


  // sends DELETE request to Flask, then removes the book from the list
  const handleDelete = (id) => {
    fetch(`/books/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) { // true if HTTP status code btw 200-299
          setBooks(books.filter(book => book.id !== id)); // keep book if NOT the id deleted
        }
      });
  };


  // fills the form with the book's current data for editing
  const handleEdit = (book) => {
    setEditingId(book.id);
    setTitle(book.title);
    setReviewer(book.reviewer);
    setRating(book.rating);
    setReview(book.review);
  };


  return (
    <div className="App">
      <h1>Book Reviews</h1>

      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
        />
        <input 
          placeholder="Reviewer"
          value={reviewer} 
          onChange={e => setReviewer(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="Rating" 
          value={rating} 
          onChange={e => setRating(Number(e.target.value))} 
        />
        <textarea 
          placeholder="Review" 
          value={review} 
          onChange={e => setReview(e.target.value)} 
        />
        <button type="submit">{editingId ? 'Update Review' : 'Add Review'}</button>
      </form>

      {books.map(book => (
         // loops thru each book and return the code under
        <div key={book.id}>
          <h3>{book.title}</h3>
          <p>Rating: {book.rating}/5</p>
          <p>Reviewer: {book.reviewer}</p>
          <button onClick={() => handleDelete(book.id)}>Delete</button>
          <button onClick={() => handleEdit(book)}>Edit</button>
        </div>
      ))}
    </div>
  );
}

export default App;