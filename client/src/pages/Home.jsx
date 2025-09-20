import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import { getBooks, borrowBook } from "../../lib/apiClient"; 
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const [searchTerm, setSearchTerm] = useState("");


  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState("asc");


  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalBooks: 0,
  });


  const handleBorrow = async (bookId) => {
    try {
      await borrowBook(bookId);
      toast.success("Book borrowed successfully!");

      setBooks((currentBooks) =>
        currentBooks.map((book) =>
          book._id === bookId ? { ...book, available: false } : book
        )
      );
    } catch (error) {
      console.error("Failed to borrow book:", error);
      toast.error(error.response?.data?.message || "Could not borrow book.");
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const params = {
          search: searchTerm,
          page: pagination.page,
          limit: 9,
          sortBy: sortBy,
          order: order,
        };

        const res = await getBooks(params);
        setBooks(res.data.books || []);
        setPagination((prev) => ({
          ...prev,
          totalPages: res.data.totalPages,
          totalBooks: res.data.totalBooks,
        }));
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setIsLoading(false);
      }
    };


    const timerId = setTimeout(() => {
      fetchBooks();
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm, pagination.page, sortBy, order]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Available Books</h1>

   
      <div className="flex flex-wrap gap-4 items-center justify-between mb-8 p-4 bg-slate-900/50 rounded-lg">
        <Input
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="author">Author</SelectItem>
              <SelectItem value="publishedDate">Published Date</SelectItem>
            </SelectContent>
          </Select>
          <Select value={order} onValueChange={setOrder}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-center">Loading books...</p>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onBorrow={handleBorrow} 
            />
          ))}
        </div>
      ) : (
        <p className="text-center py-10">No books found.</p>
      )}

      
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
        >
          Previous
        </Button>
        <span className="text-lg">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
