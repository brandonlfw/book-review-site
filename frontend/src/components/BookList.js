import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function BookList() {
    const [books, setBooks] = useState([]); // books starts as empty array, setBooks updates that value
    const [title, setTitle] = useState('');
    const [reviewer, setReviewer] = useState('');
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [author, setAuthor] = useState('');
    const [coverUrl, setCoverUrl] = useState('');
    const [publishYear, setPublishYear] = useState('');
    const [description, setDescription] = useState('');

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
                body: JSON.stringify({ title, author, cover_url: coverUrl, publish_year: publishYear, description, reviewer, rating, review })
            })
                .then(res => res.json())
                .then(updatedBook => {
                    setBooks(books.map(book => book.id === editingId ? updatedBook : book));

                    // clear form
                    setEditingId(null);
                    setTitle('');
                    setAuthor('');
                    setCoverUrl('');
                    setPublishYear('');
                    setDescription('');
                    setReviewer('');
                    setRating(5);
                    setReview('');
                });
        } else {
            // adding a new book — send POST
            fetch('/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, author, cover_url: coverUrl, publish_year: publishYear, description, reviewer, rating, review })
            })
                .then(res => res.json())
                .then(newBook => {
                    setBooks([...books, newBook]);

                    // clear form
                    setTitle('');
                    setAuthor('');
                    setCoverUrl('');
                    setPublishYear('');
                    setDescription('');
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
        setAuthor(book.author || '');
        setCoverUrl(book.cover_url || '');
        setPublishYear(book.publish_year || '');
        setDescription(book.description || '');
        setReviewer(book.reviewer);
        setRating(book.rating);
        setReview(book.review);
    };


    // debounced search: waits 500ms after user stops typing, then searches Open Library
    useEffect(() => {
        if (title.length < 3) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(() => {
            fetch(`https://openlibrary.org/search.json?title=${title}&limit=5`)
                .then(res => res.json())
                .then(data => {
                    console.log('Open Library results:', data.docs);
                    setSuggestions(data.docs || []);
                });
        }, 500);

        return () => clearTimeout(timer);
    }, [title]);


    return (
        <div className="App">
            <h1>Book Reviews</h1>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                {suggestions.length > 0 && (
                    <div className="suggestions">
                        {suggestions.map((s, index) => (
                            <div
                                key={index}
                                className="suggestion-item"
                                onClick={() => {
                                    setTitle(s.title);
                                    setAuthor(s.author_name ? s.author_name[0] : '');
                                    setCoverUrl(s.cover_i ? `https://covers.openlibrary.org/b/id/${s.cover_i}-M.jpg` : '');
                                    setPublishYear(s.first_publish_year || '');
                                    setDescription(s.first_sentence ? s.first_sentence[0] : '');
                                    setSuggestions([]);
                                }}
                            >
                                {s.title} — {s.author_name ? s.author_name[0] : 'Unknown author'}
                            </div>
                        ))}
                    </div>
                )}
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

            {/* Book cover and preview information */}
            {coverUrl && (
                <div className="book-preview">
                    <img src={coverUrl} alt={title} />
                    <p><strong>{title}</strong></p>
                    <p>{author}</p>
                    <p>{publishYear}</p>
                    <p>{description}</p>
                </div>
            )}

            {books.map(book => (
                // loops thru each book and return the code under
                 <div key={book.id} className='book-card'>
                    <div className='book-info'>
                        <h3>
                            <Link to={`/books/${book.id}`}>{book.title}</Link>
                        </h3>
                        <p><strong>Rating: </strong>{book.rating}/5</p>
                        <p><strong>Reviewer: </strong>{book.reviewer}</p>
                        <p><i>{book.review}</i></p>
                        <button onClick={() => handleDelete(book.id)}>Delete</button>
                        <button onClick={() => handleEdit(book)}>Edit</button>
                    </div>
                    {book.cover_url && <img src={book.cover_url} alt={book.title} />}
                </div>
            ))}
        </div>
    );
}

export default BookList;