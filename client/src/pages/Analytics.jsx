import { useEffect, useState } from "react";
import { getAnalytics } from "../../lib/apiClient";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getAnalytics();
        setAnalytics(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };
    fetchAnalytics();
  }, []);

  if (!analytics) return <p>Loading analytics...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <p>Total Books: {analytics.totalBooks}</p>
      <p>Available Books: {analytics.availableBooks}</p>
      <p>Borrowed Books: {analytics.borrowedBooks}</p>

      <h2 className="text-xl font-semibold mt-4">Books by Genre</h2>
      <ul className="list-disc list-inside">
        {analytics.genres?.map((genre) => (
          <li key={genre._id}>
            {genre._id}: {genre.count}
          </li>
        ))}
      </ul>
    </div>
  );
}
