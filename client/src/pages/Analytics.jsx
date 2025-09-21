import { useEffect, useState } from "react";

import { toast } from "sonner";
import { getAnalytics } from "../lib/apiClient";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getAnalytics();
        setAnalytics(res.data);
      } catch (err) {
        toast.error("Failed to fetch analytics.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) return <p className="text-center">Loading analytics...</p>;
  if (!analytics) return <p className="text-center">No analytics data available.</p>;

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Library Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-400">Total Books</h2>
          <p className="text-4xl font-bold text-blue-400">{analytics.totalBooks}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-400">Available Books</h2>
          <p className="text-4xl font-bold text-green-400">{analytics.availableBooks}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-400">Borrowed Books</h2>
          <p className="text-4xl font-bold text-red-400">{analytics.borrowedBooks}</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mt-4 mb-4">Books by Genre</h2>
        <div className="bg-gray-700 p-4 rounded-lg">
          <ul className="space-y-2">
            {analytics.genres?.map((genre) => (
              <li key={genre._id} className="flex justify-between items-center bg-gray-600 px-4 py-2 rounded">
                <span className="font-medium">{genre._id}</span>
                <span className="font-bold text-lg text-blue-300">{genre.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}