import { useEffect, useState } from "react";
import "./Projects.css";
import ProjectCard from "./ProjectCard";

const API_URL = "https://career-vault-1xyt.onrender.com/api/projects";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    technologies: "",
    githubUrl: "",
    demoUrl: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Inline delete confirmation
  const [deleteId, setDeleteId] = useState(null);

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // AUTH HEADERS
  // =====================================================

  const getAuthHeaders = () => {
    const token = getToken();

    if (!token) {
      return null;
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // =====================================================
  // FETCH PROJECTS
  // =====================================================

  const fetchProjects = async () => {
    try {
      const token = getToken();

      if (!token) {
        setProjects([]);
        setMessage("Please login to view your projects.");
        return;
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch projects"
        );
      }

      setProjects(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (error) {
      console.error("Project fetch error:", error);

      setProjects([]);
      setMessage(
        error.message || "Unable to load projects."
      );
    }
  };

  // =====================================================
  // LOAD PROJECTS
  // =====================================================

  useEffect(() => {
    fetchProjects();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // ADD / UPDATE PROJECT
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = getToken();

    if (!token) {
      setMessage("Authentication required. Please login again.");
      return;
    }

    // -----------------------------
    // Validation
    // -----------------------------

    if (!form.name.trim()) {
      setMessage("Please enter a project name.");
      return;
    }

    if (!form.description.trim()) {
      setMessage("Please enter a project description.");
      return;
    }

    if (!form.technologies.trim()) {
      setMessage("Please enter the technologies used.");
      return;
    }

    // Validate GitHub URL if entered
    if (form.githubUrl.trim()) {
      try {
        new URL(form.githubUrl.trim());
      } catch {
        setMessage("Please enter a valid GitHub URL.");
        return;
      }
    }

    // Validate Demo URL if entered
    if (form.demoUrl.trim()) {
      try {
        new URL(form.demoUrl.trim());
      } catch {
        setMessage("Please enter a valid Demo URL.");
        return;
      }
    }

    setLoading(true);
    setMessage("");

    // Convert technologies string to array
    const projectData = {
      name: form.name.trim(),

      description: form.description.trim(),

      technologies: form.technologies
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean),

      githubUrl: form.githubUrl.trim(),

      demoUrl: form.demoUrl.trim(),
    };

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId ? "PUT" : "POST";

      const headers = getAuthHeaders();

      if (!headers) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(projectData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save project"
        );
      }

      // Refresh projects
      await fetchProjects();

      // Clear form
      setForm({
        name: "",
        description: "",
        technologies: "",
        githubUrl: "",
        demoUrl: "",
      });

      const wasEditing = Boolean(editingId);

      setEditingId(null);

      setMessage(
        wasEditing
          ? "Project updated successfully."
          : "Project added successfully."
      );
    } catch (error) {
      console.error("Project save error:", error);

      setMessage(
        error.message || "Unable to save project."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EDIT PROJECT
  // =====================================================

  const handleEdit = (project) => {
    setForm({
      name: project.name || "",

      description: project.description || "",

      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : project.technologies || "",

      githubUrl: project.githubUrl || "",

      demoUrl: project.demoUrl || "",
    });

    setEditingId(project._id);

    setDeleteId(null);

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // SHOW DELETE QUESTION
  // =====================================================

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setMessage("");
  };

  // =====================================================
  // CANCEL DELETE
  // =====================================================

  const cancelDelete = () => {
    setDeleteId(null);
  };

  // =====================================================
  // CONFIRM DELETE
  // =====================================================

  const confirmDelete = async () => {
    if (!deleteId) {
      return;
    }

    const token = getToken();

    if (!token) {
      setDeleteId(null);
      setMessage(
        "Authentication required. Please login again."
      );
      return;
    }

    const id = deleteId;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete project"
        );
      }

      await fetchProjects();

      if (editingId === id) {
        setEditingId(null);

        setForm({
          name: "",
          description: "",
          technologies: "",
          githubUrl: "",
          demoUrl: "",
        });
      }

      setDeleteId(null);

      setMessage("Project deleted successfully.");
    } catch (error) {
      console.error("Project delete error:", error);

      setDeleteId(null);

      setMessage(
        error.message || "Unable to delete project."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancel = () => {
    setEditingId(null);

    setForm({
      name: "",
      description: "",
      technologies: "",
      githubUrl: "",
      demoUrl: "",
    });

    setMessage("");

    setDeleteId(null);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="projects-page">

      {/* HEADER */}

      <div className="projects-header">
        <div>
          <h2>Projects</h2>

          <p>
            Add and manage your academic, personal, and
            professional projects.
          </p>
        </div>
      </div>


      <div className="projects-layout">

        {/* =================================================
            PROJECT FORM
        ================================================= */}

        <div className="project-form-card">

          <h3>
            {editingId
              ? "Edit Project"
              : "Add Project"}
          </h3>


          <form onSubmit={handleSubmit}>

            {/* PROJECT NAME */}

            <label>
              Project Name

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Career Vault"
                required
              />
            </label>


            {/* DESCRIPTION */}

            <label>
              Description

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your project..."
                rows="4"
                required
              />
            </label>


            {/* TECHNOLOGIES */}

            <label>
              Technologies

              <input
                type="text"
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                required
              />

              <small>
                Separate technologies with commas.
              </small>
            </label>


            {/* GITHUB */}

            <label>
              GitHub URL

              <input
                type="url"
                name="githubUrl"
                value={form.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
              />
            </label>


            {/* DEMO */}

            <label>
              Demo URL

              <input
                type="url"
                name="demoUrl"
                value={form.demoUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </label>


            {/* BUTTONS */}

            <div className="project-form-actions">

              <button
                type="submit"
                className="project-primary-button"
                disabled={loading}
              >
                {loading
                  ? editingId
                    ? "Updating..."
                    : "Adding..."
                  : editingId
                  ? "Update Project"
                  : "Add Project"}
              </button>


              {editingId && (
                <button
                  type="button"
                  className="project-secondary-button"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>


          {/* MESSAGE */}

          {message && (
            <p className="project-message">
              {message}
            </p>
          )}

        </div>


        {/* =================================================
            PROJECT LIST
        ================================================= */}

        <div className="projects-list">

          <div className="projects-list-header">

            <h3>Your Projects</h3>

            <span>
              {projects.length}
            </span>

          </div>


          {/* NO PROJECTS */}

          {projects.length === 0 ? (

            <div className="empty-projects">

              <h4>No projects yet</h4>

              <p>
                Add your first project using the form.
              </p>

            </div>

          ) : (

            <div className="project-grid">

              {projects.map((project) => (

                <div
                  key={project._id}
                  className="project-item-wrapper"
                >

                  <ProjectCard
                    project={project}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />


                  {/* =======================================
                      INLINE DELETE QUESTION
                  ======================================= */}

                  {deleteId === project._id && (

                    <div
                      className="delete-confirm-message"
                      style={{
                        marginTop: "10px",
                        padding: "14px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        background: "#fff",
                      }}
                    >

                      <p
                        style={{
                          margin: "0 0 10px 0",
                          fontWeight: "600",
                        }}
                      >
                        Are you sure you want to
                        delete this project?
                      </p>


                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                        }}
                      >

                        <button
                          type="button"
                          onClick={confirmDelete}
                          disabled={loading}
                          style={{
                            padding: "8px 16px",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          {loading
                            ? "Deleting..."
                            : "Yes, Delete"}
                        </button>


                        <button
                          type="button"
                          onClick={cancelDelete}
                          disabled={loading}
                          style={{
                            padding: "8px 16px",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            background: "white",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>

                      </div>

                    </div>

                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </section>
  );
}

export default Projects;