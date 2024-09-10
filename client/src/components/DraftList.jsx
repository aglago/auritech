import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDrafts, deleteDraft } from "../services/api";

const DraftList = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      const response = await getDrafts();
      setDrafts(response.data);
      setLoading(false);
    } catch (err) {
        setError("Failed to fetch drafts. Please try again later.");
        console.log("Failed to fetch drafts. Please try again: " + err.message);
        
      setLoading(false);
    }
  };

  const handleDeleteDraft = async (id) => {
    try {
      await deleteDraft(id);
      setDrafts(drafts.filter((draft) => draft._id !== id));
    } catch (err) {
        setError("Failed to delete draft. Please try again.");
        console.log("Failed to delete draft: " + err);
        
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Drafts</h1>
      {drafts.length === 0 ? (
        <p>No drafts found.</p>
      ) : (
        <ul className="space-y-2">
          {drafts.map((draft) => (
            <li
              key={draft._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <Link
                to={`/view-draft/${draft._id}`}
                className="text-blue-500 hover:underline"
              >
                {draft.invoiceDetails?.invoiceNo || "Untitled Draft"}
              </Link>
              <button
                onClick={() => handleDeleteDraft(draft._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DraftList;
