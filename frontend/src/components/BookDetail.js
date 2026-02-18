import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        fetch(`/books/${id}`)
        .then(res => res.json())
        .then(data => setBook(data));
    }, [id]);

    if (!book) return <p>Loading...</p>;

    return (
        <div className='book-detail'>
            <Link to={'/'}>Back to all reviews</Link>
            <h2>{book.title}</h2>
            <p>Rating: {book.rating}/5</p>
            <p>Reviewer: {book.reviewer}</p>
            <p>{book.review}</p>
        </div>
    );
}

export default BookDetail;