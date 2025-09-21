import useIsAdmin from "../hooks/useIsAdmin";
import { Button } from "./ui/button";

export default function BookCard({ book, onDelete, onUpdate, onBorrow, onReturn }) {
  const isAdmin = useIsAdmin();

  const coverUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
    : "https://via.placeholder.com/150x220.png?text=No+Cover";

  return (
    <div className=" p-4 rounded-lg shadow-lg flex flex-col justify-between bg-gray-800/50">
      <img
        src={coverUrl}
        alt={`${book.title} cover`}
        className="w-full h-60 object-contain rounded-md mb-4"
        onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/150x220.png?text=No+Cover" }}
      />
      <div>
        <h3 className="text-xl font-bold text-blue-300 mb-2 truncate">{book.title}</h3>
        <p className="text-sm text-gray-400 truncate">👤 Author: {book.author}</p>
        <p className="text-sm text-gray-400">
          📅 Published: {book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : "N/A"}
        </p>
        <p className="text-sm text-gray-400">🏷️ Genre: {book.genre || "N/A"}</p>
        <p className="text-sm text-gray-400">
          ✅ Status:{" "}
          <span className={book.available ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>
            {book.available ? "Available" : "Borrowed"}
          </span>
          {isAdmin && !book.available && book.borrowedBy && (
            <span className="text-sm text-yellow-400"> by {book.borrowedBy.name}</span>
          )}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {onBorrow && book.available && !isAdmin && (
          <Button onClick={() => onBorrow(book._id)} className="flex-grow">
            Borrow
          </Button>
        )}
        {onReturn && !book.available && (
           <Button onClick={() => onReturn(book._id)} className="flex-grow" variant="secondary">
             {isAdmin ? "Force Return" : "Return Book"}
           </Button>
        )}
        {isAdmin && onUpdate && (
          <Button onClick={() => onUpdate(book)} className="flex-grow bg-purple-500" variant={"outline"} >
            Update
          </Button>
        )}
        {isAdmin && onDelete && (
          <Button onClick={() => onDelete(book._id)} className="flex-grow" variant="destructive">
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}