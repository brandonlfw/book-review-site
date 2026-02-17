import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState([]); // books starts as empty array, setBooks updates that value

  useEffect(() => {
    fetch('/books')
      .then(res => res.json()) // parses JSON response from Flask into JS array of books
      .then(data => setBooks(data)); // setBooks(data) stores array of book objects into books state var
  }, []);

  return (
    <div className="App">
      <h1>Book Reviews</h1>
      {books.map(book => ( // loops thru each book and return the code under
        <div key={book.id}>
          <h3>{book.title}</h3>
          <p>Rating: {book.rating}/5</p>
          <p>Reviewer: {book.reviewer}</p>
        </div>
      ))}
    </div>
  );
}

export default App;