import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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
        <div>
            <h2>{book.title}</h2>
            <p>Rating: {book.rating}/5</p>
            <p>Reviewer: {book.reviewer}</p>
            <p>{book.review}</p>
        </div>
    );
}

export default BookDetail;