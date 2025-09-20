import useIsAdmin from "./AdminOnly";

export default function BookCard({ book, onDelete, onUpdate }) {
  const isAdmin = useIsAdmin();
  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col">
      <h3 className="text-lg font-bold text-blue-300">{book.title}</h3>
      
      <p className="text-sm">👤 Author: {book.author}</p>
      <p className="text-sm">📅 Published: {book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : "N/A"}</p>
      <p className="text-sm">📖 Pages: {book.pages || "N/A"}</p>
      <p className="text-sm">🏷️ Genre: {book.genre || "N/A"}</p>
      <p className="text-sm">📚 ISBN: {book.isbn || "N/A"}</p>
      <p className="text-sm">
        ✅ Available:{" "}
        <span className={book.available ? "text-green-400" : "text-red-400"}>
          {book.available ? "Yes" : "No"}
        </span>
      </p>

      <div className="mt-3 flex gap-2">
        {onUpdate && (
          <button
            onClick={() => onUpdate(book)}
            className="bg-yellow-500 px-3 py-1 rounded-md text-sm"
          >
            Update
          </button>
        )}
        {onDelete && isAdmin && (
          <button
            onClick={() => onDelete(book._id)}
            className="bg-red-500 px-3 py-1 rounded-md text-sm"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
