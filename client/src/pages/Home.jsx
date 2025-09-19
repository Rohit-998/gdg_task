import { useEffect, useState } from "react";

import BookCard from "../components/BookCard";
import { getBooks } from "../../lib/apiClient";

export default function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await getBooks();
        setBooks(res.data.books || []);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Available Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
}
