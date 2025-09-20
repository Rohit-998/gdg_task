import useIsAdmin from "./AdminOnly";
import { Button } from "./ui/button";

export default function BookCard({ book, onDelete, onUpdate, onBorrow }) {
  const isAdmin = useIsAdmin();


  const coverUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
    : "https://via.placeholder.com/150x220.png?text=No+Cover";

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg flex flex-col justify-between">
    
      <img
        src={coverUrl}
        alt={`${book.title} cover`}
        className="w-full h-60 object-contain rounded-md mb-4"
      />

      <div>
        <h3 className="text-xl font-bold text-blue-300 mb-2">{book.title}</h3>
        <p className="text-sm text-gray-400">👤 Author: {book.author}</p>
        <p className="text-sm text-gray-400">
          📅 Published:{" "}
          {book.publishedDate
            ? new Date(book.publishedDate).toLocaleDateString()
            : "N/A"}
        </p>
        <p className="text-sm text-gray-400">📖 Pages: {book.pages || "N/A"}</p>
        <p className="text-sm text-gray-400">🏷️ Genre: {book.genre || "N/A"}</p>
        <p className="text-sm text-gray-400">
          ✅ Status:{" "}
          <span
            className={
              book.available
                ? "text-green-400 font-semibold"
                : "text-red-400 font-semibold"
            }
          >
            {book.available ? "Available" : "Borrowed"}
          </span>
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {onBorrow && book.available && (
          <Button
            onClick={() => onBorrow(book._id)}
            className="flex-grow"
            variant="default"
          >
            Borrow
          </Button>
        )}

        {isAdmin && onUpdate && (
          <Button
            onClick={() => onUpdate(book)}
            className="flex-grow"
            variant="secondary"
          >
            Update
          </Button>
        )}
        {isAdmin && onDelete && (
          <Button
            onClick={() => onDelete(book._id)}
            className="flex-grow"
            variant="destructive"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
