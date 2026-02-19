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
        <>
        <div className='book-detail'>
            <Link to={'/'}>Back to all reviews</Link>
            <h2>{book.title}</h2>
            {book.cover_url && <img src={book.cover_url} alt={book.title} />}
            {book.author && <p><strong>Author:</strong> {book.author}</p>}
            {book.publish_year && <p><strong>Published:</strong> {book.publish_year}</p>}
            {book.description && <p><strong>Description:</strong> {book.description}</p>}
        </div>
        <div className='review-list'>
            <h2>Reviews</h2>
            <p><strong>Rating:</strong> {book.rating}/5</p>
            <p><strong>Reviewer:</strong> {book.reviewer}</p>
            <p><strong>Review:</strong> {book.review}</p>
        </div>
        </>
    );
}

export default BookDetail;