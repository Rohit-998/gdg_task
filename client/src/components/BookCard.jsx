import useIsAdmin from "./AdminOnly";
import { Button } from "./ui/button"; // A nice-looking button

// ✅ Add onBorrow to the props
export default function BookCard({ book, onDelete, onUpdate, onBorrow }) {
  const isAdmin = useIsAdmin();
  return (
    <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-blue-300 mb-2">{book.title}</h3>
        <p className="text-sm text-gray-400">👤 Author: {book.author}</p>
        <p className="text-sm text-gray-400">📅 Published: {book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : "N/A"}</p>
        <p className="text-sm text-gray-400">📖 Pages: {book.pages || "N/A"}</p>
        <p className="text-sm text-gray-400">🏷️ Genre: {book.genre || "N/A"}</p>
        <p className="text-sm text-gray-400">
          ✅ Status:{" "}
          <span className={book.available ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>
            {book.available ? "Available" : "Borrowed"}
          </span>
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {/* ✅ ADD BORROW BUTTON LOGIC */}
        {onBorrow && book.available && !isAdmin && (
          <Button
            onClick={() => onBorrow(book._id)}
            className="flex-grow"
            variant="default" // Primary button style
          >
            Borrow
          </Button>
        )}

        {/* Admin buttons */}
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