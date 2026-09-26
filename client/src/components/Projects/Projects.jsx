import React, { useEffect, useState } from "react";
import "./Projects.css";

const API_URL = "http://localhost:5000/api/projects";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    technologies: "",
    projectLink: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (response.ok) {
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.technologies
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to save project.");
        return;
      }

      if (editingId) {
        setProjects(
          projects.map((project) =>
            project._id === editingId ? data : project
          )
        );

        alert("Project updated successfully!");
      } else {
        setProjects([data, ...projects]);

        alert("Project added successfully!");
      }

      resetForm();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      name: project.name,
      description: project.description,
      technologies: project.technologies,
      projectLink: project.projectLink || ""
    });

    setEditingId(project._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete project.");
        return;
      }

      setProjects(
        projects.filter((project) => project._id !== id)
      );

      alert("Project deleted successfully!");
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Unable to connect to server.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      technologies: "",
      projectLink: ""
    });

    setEditingId(null);
  };

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h2>Projects</h2>
        <p>Add and manage your projects.</p>
      </div>

      <div className="project-form-card">
        <h3>
          {editingId ? "Edit Project" : "Add New Project"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name *</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter project name"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Technologies *</label>

            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div className="form-group">
            <label>Project Link</label>

            <input
              type="url"
              name="projectLink"
              value={formData.projectLink}
              onChange={handleChange}
              placeholder="https://github.com/your-project"
            />
          </div>

          <div className="form-buttons">
            <button
              type="submit"
              className="save-button"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Project"
                : "Add Project"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="projects-list">
        <h3>My Projects</h3>

        {projects.length === 0 ? (
          <div className="empty-projects">
            <p>No projects added yet.</p>
            <p>Add your first project using the form above.</p>
          </div>
        ) : (
          <div className="project-grid">
            {projects.map((project) => (
              <div className="project-card" key={project._id}>
                <h3>{project.name}</h3>

                <p className="project-description">
                  {project.description}
                </p>

                <div className="technology-section">
                  <strong>Technologies:</strong>
                  <p>{project.technologies}</p>
                </div>

                {project.projectLink && (
                  <a
                    href={project.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-button"
                  >
                    View Project
                  </a>
                )}

                <div className="project-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(project)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => handleDelete(project._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;