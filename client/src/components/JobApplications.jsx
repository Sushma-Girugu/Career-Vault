import { useState } from "react";

const API = "http://localhost:5001/api";

function JobApplications() {
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    company: "",
    jobTitle: "",
    location: "",
    jobType: "Internship",
    applicationDate: "",
    status: "Applied",
    jobLink: "",
    notes: ""
  });

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const resetForm = () => {
    setForm({
      company: "",
      jobTitle: "",
      location: "",
      jobType: "Internship",
      applicationDate: "",
      status: "Applied",
      jobLink: "",
      notes: ""
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setError("");
    setMessage("");
  };

  const loadApplications = async () => {
    try {
      const token = getToken();

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await fetch(
        `${API}/job-applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load applications"
        );
      }

      setApplications(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!form.company.trim()) {
      setError("Company is required.");
      return;
    }

    if (!form.jobTitle.trim()) {
      setError("Job Title is required.");
      return;
    }

    if (!form.applicationDate) {
      setError("Application Date is required.");
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        setError("Please login first.");
        return;
      }

      const url = editingId
        ? `${API}/job-applications/${editingId}`
        : `${API}/job-applications`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save application"
        );
      }

      await loadApplications();

      setMessage(
        editingId
          ? "Application updated successfully!"
          : "Application added successfully!"
      );

      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (application) => {
    setForm({
      company: application.company || "",
      jobTitle: application.jobTitle || "",
      location: application.location || "",
      jobType: application.jobType || "Internship",
      applicationDate: application.applicationDate
        ? application.applicationDate.slice(0, 10)
        : "",
      status: application.status || "Applied",
      jobLink: application.jobLink || "",
      notes: application.notes || ""
    });

    setEditingId(application._id);
    setShowForm(true);
    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await fetch(
        `${API}/job-applications/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete application"
        );
      }

      await loadApplications();

      setMessage(
        "Application deleted successfully!"
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}
      >
        <div>
          <h2>Job Applications</h2>
          <p>
            Track and manage your job applications.
          </p>
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={() => {
            setEditingId(null);
            setShowForm(true);
            setError("");
            setMessage("");
          }}
        >
          + Add Application
        </button>
      </div>

      {showForm && (
        <div
          className="panel"
          style={{ marginBottom: "24px" }}
        >
          <div className="panel-header">
            <div>
              <h3>
                {editingId
                  ? "Edit Application"
                  : "Add Application"}
              </h3>

              <p>
                Enter your job application details.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="field">
                <label>Company *</label>

                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Google"
                />
              </div>

              <div className="field">
                <label>Job Title *</label>

                <input
                  type="text"
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={handleChange}
                  placeholder="Software Engineer Intern"
                />
              </div>

              <div className="field">
                <label>Location</label>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Bangalore"
                />
              </div>

              <div className="field">
                <label>Job Type</label>

                <select
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                >
                  <option value="Internship">
                    Internship
                  </option>

                  <option value="Full-time">
                    Full-time
                  </option>

                  <option value="Part-time">
                    Part-time
                  </option>
                </select>
              </div>

              <div className="field">
                <label>
                  Application Date *
                </label>

                <input
                  type="date"
                  name="applicationDate"
                  value={form.applicationDate}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Applied">
                    Applied
                  </option>

                  <option value="Shortlisted">
                    Shortlisted
                  </option>

                  <option value="Interview">
                    Interview
                  </option>

                  <option value="Selected">
                    Selected
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>
                </select>
              </div>

              <div className="field full">
                <label>Job Link</label>

                <input
                  type="url"
                  name="jobLink"
                  value={form.jobLink}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="field full">
                <label>Notes</label>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Interview date, recruiter details, notes..."
                  rows="4"
                />
              </div>

            </div>

            {error && (
              <div className="alert error">
                ⚠ {error}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "18px"
              }}
            >
              <button
                type="submit"
                className="primary-btn"
              >
                {editingId
                  ? "Update Application"
                  : "Save Application"}
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  resetForm();
                  setError("");
                }}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {message && (
        <div className="alert success">
          ✓ {message}
        </div>
      )}

      {!showForm &&
        applications.length === 0 && (
          <div
            className="panel"
            style={{
              textAlign: "center",
              padding: "50px 30px"
            }}
          >
            <h3>
              No job applications yet
            </h3>

            <p>
              Click "+ Add Application" to add one.
            </p>
          </div>
        )}

      {applications.length > 0 && (
        <div
          style={{
            display: "grid",
            gap: "16px"
          }}
        >

          {applications.map((application) => (

            <div
              className="panel"
              key={application._id}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px"
                }}
              >

                <div>

                  <h3>
                    {application.jobTitle}
                  </h3>

                  <p>
                    <strong>
                      {application.company}
                    </strong>

                    {application.location
                      ? ` • ${application.location}`
                      : ""}
                  </p>

                  <p>
                    Application Date:{" "}

                    {application.applicationDate
                      ? new Date(
                          application.applicationDate
                        ).toLocaleDateString()
                      : "-"}
                  </p>

                  <p>
                    Job Type: {application.jobType}
                  </p>

                  {application.jobLink && (
                    <p>
                      <a
                        href={application.jobLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Job
                      </a>
                    </p>
                  )}

                  {application.notes && (
                    <p>
                      <strong>
                        Notes:
                      </strong>{" "}
                      {application.notes}
                    </p>
                  )}

                </div>

                <div
                  style={{
                    textAlign: "right"
                  }}
                >

                  <div
                    style={{
                      marginBottom: "12px"
                    }}
                  >
                    <strong>
                      {application.status}
                    </strong>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px"
                    }}
                  >

                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() =>
                        handleEdit(application)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() =>
                        handleDelete(
                          application._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </section>
  );
}

export default JobApplications;
