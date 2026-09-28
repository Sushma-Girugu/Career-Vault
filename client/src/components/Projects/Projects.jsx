import React, { useEffect, useState } from "react";
import "./Projects.css";
import ProjectCard from "./ProjectCard";

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
      } else {
        alert(data.message || "Failed to fetch projects.");
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

    if (!formData.name.trim()) {
      alert("Please enter a project name.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter a project description.");
      return;
    }

    if (!formData.technologies.trim()) {
      alert("Please enter the technologies used.");
      return;
    }

    if (formData.projectLink.trim()) {
      try {
        new URL(formData.projectLink);
      } catch {
        alert("Please enter a valid project URL.");
        return;
      }
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
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          technologies: formData.technologies.trim(),
          projectLink: formData.projectLink.trim()
        })
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
      name: project.name || "",
      description: project.description || "",
      technologies: project.technologies || "",
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
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;