import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { addBook } from "../lib/apiClient";

const bookSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  author: z.string().min(2, { message: "Author is required" }),
  publishedDate: z.string().min(1, { message: "Published date is required" }),
  isbn: z.string().min(10, { message: "ISBN must be at least 10 characters" }),
  pages: z.coerce.number().positive({ message: "Pages must be a positive number" }),
  genre: z.string().min(2, { message: "Genre is required" }),
});

const FormField = ({ control, name, label, placeholder, type = "text" }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input type={type} placeholder={placeholder} {...field} className="bg-gray-700 border-gray-600" />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default function AddBook() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      publishedDate: "",
      isbn: "",
      pages: "",
      genre: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await addBook(data);
      toast.success("Book added successfully!");
      form.reset();
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add book!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add a New Book</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" label="Title" placeholder="The Great Gatsby" />
            <FormField control={form.control} name="author" label="Author" placeholder="F. Scott Fitzgerald" />
            <FormField control={form.control} name="publishedDate" label="Published Date" type="date" />
            <FormField control={form.control} name="isbn" label="ISBN" placeholder="9780743273565" />
            <FormField control={form.control} name="pages" label="Pages" placeholder="180" type="number" />
            <FormField control={form.control} name="genre" label="Genre" placeholder="Fiction" />
            <Button type="submit" className="w-full mt-4">Add Book</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}