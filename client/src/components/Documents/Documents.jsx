import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Temporary user ID for testing
 const userId = "6ab805ee774c60fe24247afa";

  // Get documents
  const fetchDocuments = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/documents?userId=${userId}`
      );

      const data = await response.json();

      if (response.ok) {
        setDocuments(data);
      } else {
        alert(data.message || "Failed to load documents");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection failed");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Upload document
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();

    formData.append("userId", userId);
    formData.append("document", file);

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/documents/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Document uploaded successfully");

        setFile(null);

        // Refresh document list
        fetchDocuments();
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete document
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/documents/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Document deleted successfully");

        fetchDocuments();
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  // Get actual uploaded filename
  const getFileName = (filePath) => {
    return filePath.split(/[/\\]/).pop();
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Document Vault</h1>

      {/* Upload Section */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >
        <h2>Upload Document</h2>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br />
        <br />

        <button
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Documents List */}
      <h2>My Documents</h2>

      {documents.length === 0 ? (
        <p>No documents uploaded.</p>
      ) : (
        <div>
          {documents.map((document) => {
            const fileName = getFileName(document.filePath);

            const fileUrl = `${API_URL}/uploads/${fileName}`;

            return (
              <div
                key={document._id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              >
                <h3>{document.fileName}</h3>

                <p>
                  Type: {document.fileType}
                </p>

                <p>
                  Uploaded:{" "}
                  {new Date(
                    document.createdAt || document.uploadedAt
                  ).toLocaleString()}
                </p>

                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <button>View / Download</button>
                </a>

                <button
                  onClick={() =>
                    handleDelete(document._id)
                  }
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Documents;