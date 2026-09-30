import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function JobApplications() {
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ID of application waiting for delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

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

  // ============================================
  // TOKEN
  // ============================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ============================================
  // RESET FORM
  // ============================================

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

  // ============================================
  // HANDLE INPUT
  // ============================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setError("");
    setMessage("");
  };

  // ============================================
  // LOAD APPLICATIONS
  // ============================================

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
          method: "GET",
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
      console.error(
        "Load applications error:",
        err
      );

      setError(err.message);
    }
  };

  // ============================================
  // LOAD WHEN PAGE OPENS
  // ============================================

  useEffect(() => {
    loadApplications();
  }, []);

  // ============================================
  // SUBMIT APPLICATION
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // Company validation
    if (!form.company.trim()) {
      setError("Please enter company name.");
      return;
    }

    // Job title validation
    if (!form.jobTitle.trim()) {
      setError("Please enter job title.");
      return;
    }

    // Date validation
    if (!form.applicationDate) {
      setError("Please select application date.");
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

        body: JSON.stringify({
          company: form.company.trim(),
          jobTitle: form.jobTitle.trim(),
          location: form.location.trim(),
          jobType: form.jobType,

          // IMPORTANT
          // Send applicationDate to backend
          applicationDate: form.applicationDate,

          status: form.status,
          jobLink: form.jobLink.trim(),
          notes: form.notes.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to save application"
        );
      }

      await loadApplications();

      setMessage(
        editingId
          ? "Application updated successfully!"
          : "Application added successfully!"
      );

      resetForm();

      setTimeout(() => {
        setMessage("");
      }, 3000);

    } catch (err) {
      console.error(
        "Save application error:",
        err
      );

      setError(err.message);
    }
  };

  // ============================================
  // EDIT
  // ============================================

  const handleEdit = (application) => {
    let dateValue = "";

    if (application.applicationDate) {
      dateValue = new Date(
        application.applicationDate
      )
        .toISOString()
        .slice(0, 10);
    } else if (application.appliedDate) {
      dateValue = new Date(
        application.appliedDate
      )
        .toISOString()
        .slice(0, 10);
    }

    setForm({
      company: application.company || "",

      jobTitle:
        application.jobTitle ||
        application.role ||
        "",

      location:
        application.location || "",

      jobType:
        application.jobType ||
        "Internship",

      applicationDate: dateValue,

      status:
        application.status ||
        "Applied",

      jobLink:
        application.jobLink || "",

      notes:
        application.notes || ""
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

  // ============================================
  // START DELETE
  // ============================================

  const startDelete = (id) => {
    setDeleteConfirmId(id);
    setError("");
    setMessage("");
  };

  // ============================================
  // CANCEL DELETE
  // ============================================

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  // ============================================
  // DELETE APPLICATION
  // ============================================

  const handleDelete = async (id) => {
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
          data.message ||
          "Failed to delete application"
        );
      }

      await loadApplications();

      setDeleteConfirmId(null);

      setMessage(
        "Application deleted successfully!"
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);

    } catch (err) {
      console.error(
        "Delete application error:",
        err
      );

      setError(err.message);
    }
  };

  // ============================================
  // FORMAT DATE
  // ============================================

  const formatDate = (date) => {
    if (!date) {
      return null;
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate.toLocaleDateString(
      "en-GB"
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <section>

      {/* ======================================
          HEADER
      ====================================== */}

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

            setShowForm(true);
            setError("");
            setMessage("");
          }}
        >
          + Add Application
        </button>

      </div>

      {/* ======================================
          ADD / EDIT FORM
      ====================================== */}

      {showForm && (
        <div
          className="panel"
          style={{
            marginBottom: "24px"
          }}
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

              {/* COMPANY */}

              <div className="field">

                <label>
                  Company *
                </label>

                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Google"
                />

              </div>

              {/* JOB TITLE */}

              <div className="field">

                <label>
                  Job Title *
                </label>

                <input
                  type="text"
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={handleChange}
                  placeholder="Software Engineer Intern"
                />

              </div>

              {/* LOCATION */}

              <div className="field">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Bangalore"
                />

              </div>

              {/* JOB TYPE */}

              <div className="field">

                <label>
                  Job Type
                </label>

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

              {/* APPLICATION DATE */}

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

              {/* STATUS */}

              <div className="field">

                <label>
                  Status
                </label>

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

              {/* JOB LINK */}

              <div className="field full">

                <label>
                  Job Link
                </label>

                <input
                  type="url"
                  name="jobLink"
                  value={form.jobLink}
                  onChange={handleChange}
                  placeholder="https://..."
                />

              </div>

              {/* NOTES */}

              <div className="field full">

                <label>
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Interview date, recruiter details, notes..."
                  rows="4"
                />

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div
                className="alert error"
                style={{
                  marginTop: "18px"
                }}
              >
                ⚠ {error}
              </div>
            )}

            {/* BUTTONS */}

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
                  setMessage("");
                }}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      {/* ======================================
          SUCCESS MESSAGE
      ====================================== */}

      {message && (
        <div className="alert success">
          ✓ {message}
        </div>
      )}

      {/* ======================================
          ERROR MESSAGE
      ====================================== */}

      {!showForm && error && (
        <div className="alert error">
          ⚠ {error}
        </div>
      )}

      {/* ======================================
          NO APPLICATIONS
      ====================================== */}

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

      {/* ======================================
          APPLICATION LIST
      ====================================== */}

      {applications.length > 0 && (
        <div
          style={{
            display: "grid",
            gap: "16px"
          }}
        >

          {applications.map((application) => {

            const applicationDate =
              formatDate(
                application.applicationDate ||
                application.appliedDate
              );

            const jobTitle =
              application.jobTitle ||
              application.role ||
              "Job Role";

            return (
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

                  {/* =================================
                      LEFT SIDE
                  ================================= */}

                  <div>

                    <h3>
                      {jobTitle}
                    </h3>

                    <p>
                      <strong>
                        {application.company}
                      </strong>

                      {application.location
                        ? ` • ${application.location}`
                        : ""}
                    </p>

                    {/* DATE */}

                    <p>
                      <strong>
                        Applied:
                      </strong>{" "}

                      {applicationDate
                        ? applicationDate
                        : "Date not available"}
                    </p>

                    {/* JOB TYPE */}

                    <p>
                      Job Type:{" "}
                      {application.jobType ||
                        "Internship"}
                    </p>

                    {/* JOB LINK */}

                    {application.jobLink && (
                      <p>

                        <a
                          href={
                            application.jobLink
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Job
                        </a>

                      </p>
                    )}

                    {/* NOTES */}

                    {application.notes && (
                      <p>

                        <strong>
                          Notes:
                        </strong>{" "}

                        {application.notes}

                      </p>
                    )}

                  </div>

                  {/* =================================
                      RIGHT SIDE
                  ================================= */}

                  <div
                    style={{
                      textAlign: "right"
                    }}
                  >

                    {/* STATUS */}

                    <div
                      style={{
                        marginBottom: "12px"
                      }}
                    >

                      <strong>
                        {application.status ||
                          "Applied"}
                      </strong>

                    </div>

                    {/* BUTTONS */}

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center"
                      }}
                    >

                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() =>
                          handleEdit(
                            application
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() =>
                          startDelete(
                            application._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

                {/* =================================
                    INLINE DELETE CONFIRMATION
                ================================= */}

                {deleteConfirmId ===
                  application._id && (

                  <div
                    style={{
                      marginTop: "16px",
                      padding: "14px 16px",
                      borderRadius: "8px",
                      border:
                        "1px solid #f0b4b4",
                      background:
                        "#fff5f5",
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      gap: "15px"
                    }}
                  >

                    <span
                      style={{
                        color: "#b42318",
                        fontWeight: "500"
                      }}
                    >
                      Are you sure you want
                      to delete this
                      application?
                    </span>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px"
                      }}
                    >

                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() =>
                          handleDelete(
                            application._id
                          )
                        }
                      >
                        Yes, Delete
                      </button>

                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={
                          cancelDelete
                        }
                      >
                        Cancel
                      </button>

                    </div>

                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}

export default JobApplications;