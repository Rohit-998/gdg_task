import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { addBook } from "../../lib/apiClient";

// ✅ Validation schema
const bookSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  author: z.string().min(2, { message: "Author is required" }),
  publishedDate: z.string().optional(),
  isbn: z.string().min(5, { message: "ISBN must be at least 5 characters" }),
  pages: z
    .string()
    .refine((val) => !isNaN(val) && Number(val) > 0, {
      message: "Pages must be a positive number",
    }),
  genre: z.string().min(2, { message: "Genre is required" }),
});

// ✅ Reusable FormField wrapper
const FormField = ({ control, name, label, placeholder, type = "text" }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="label">{label}</FormLabel>
        <FormControl>
          {type === "date" ? (
            <div className="relative">
              <Input
                type="date"
                placeholder="dd-mm-yyyy"
                {...field}
                className="pr-10"
              />
              <img
                src="/calendar.svg"
                alt="calendar"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none opacity-70"
              />
            </div>
          ) : (
            <Input type={type} placeholder={placeholder} {...field} />
          )}
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
      const payload = { ...data, pages: Number(data.pages) };
      await addBook(payload);

      toast.success("Book added successfully!");
      form.reset();
      navigate("/home");
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error(error.response?.data?.message || "Failed to add book!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="card-border">
        <div className="form-container">
          <div className="flex flex-col items-center mb-6">
            <img src="/logo.png" alt="Logo" width={40} height={36} />
            <h2 className="text-2xl font-bold mt-2">Add a New Book</h2>
            <p className="text-sm text-gray-400">Library Management</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                label="Title"
                placeholder="Enter book title"
              />
              <FormField
                control={form.control}
                name="author"
                label="Author"
                placeholder="Enter author name"
              />
              <FormField
                control={form.control}
                name="publishedDate"
                label="Published Date"
                type="date"
              />
              <FormField
                control={form.control}
                name="isbn"
                label="ISBN"
                placeholder="Enter ISBN number"
              />
              <FormField
                control={form.control}
                name="pages"
                label="Pages"
                placeholder="Enter number of pages"
                type="number"
              />
              <FormField
                control={form.control}
                name="genre"
                label="Genre"
                placeholder="Enter genre (e.g., Fiction, Science)"
              />

              <Button type="submit" className="w-full">
                Add Book
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
