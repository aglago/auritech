import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDraft, updateDraft, deleteDraft } from "../services/api";

const ViewDraft = () => {
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchDraft = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await getDraft(id);
      setDraft(response.data);
      setLoading(false);
    } catch (err) {
        setError("Failed to fetch draft. Please try again later.");
        console.log("Failed to fetch draft: " + err);
        
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDraft();
  }, [fetchDraft]);

  const handleUpdateDraft = async () => {
    if (!id || !draft) return;
    try {
      await updateDraft(id, draft);
      alert("Draft updated successfully");
    } catch (err) {
        setError("Failed to update draft. Please try again.");
        console.log("Failed to update draft. Please: " + err.message);
        
    }
  };

  const handleDeleteDraft = async () => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this draft?")) {
      try {
        await deleteDraft(id);
        navigate("/drafts");
      } catch (err) {
          setError("Failed to delete draft. Please try again.");
          console.log("Error deleting: " + err);
          
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!draft) return <div>Draft not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {draft.invoiceDetails?.invoiceNo || "Untitled Draft"}
      </h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        {/* Display draft details here */}
        <pre>{JSON.stringify(draft, null, 2)}</pre>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleUpdateDraft}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Draft
        </button>
        <button
          onClick={handleDeleteDraft}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete Draft
        </button>
      </div>
    </div>
  );
};

export default ViewDraft;
