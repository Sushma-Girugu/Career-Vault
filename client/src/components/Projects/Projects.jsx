import { useEffect, useState } from "react";
import "./Projects.css";
import ProjectCard from "./ProjectCard";

const API_URL = "http://localhost:5000/api/projects";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    technologies: "",
    githubUrl: "",
    demoUrl: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchProjects = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load projects.");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      setMessage("Project name and description are required.");
      return;
    }

    setLoading(true);
    setMessage("");

    const projectData = {
      name: form.name.trim(),
      description: form.description.trim(),
      technologies: form.technologies
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean),
      githubUrl: form.githubUrl.trim(),
      demoUrl: form.demoUrl.trim()
    };

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
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        throw new Error("Failed to save project");
      }

      await fetchProjects();

      setForm({
        name: "",
        description: "",
        technologies: "",
        githubUrl: "",
        demoUrl: ""
      });

      setEditingId(null);

      setMessage(
        editingId
          ? "Project updated successfully."
          : "Project added successfully."
      );
    } catch (error) {
      console.error(error);
      setMessage("Unable to save project.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setForm({
      name: project.name || "",
      description: project.description || "",
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : project.technologies || "",
      githubUrl: project.githubUrl || "",
      demoUrl: project.demoUrl || ""
    });

    setEditingId(project._id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      await fetchProjects();

      if (editingId === id) {
        setEditingId(null);
        setForm({
          name: "",
          description: "",
          technologies: "",
          githubUrl: "",
          demoUrl: ""
        });
      }

      setMessage("Project deleted successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to delete project.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);

    setForm({
      name: "",
      description: "",
      technologies: "",
      githubUrl: "",
      demoUrl: ""
    });

    setMessage("");
  };

  return (
    <section className="projects-page">
      <div className="projects-header">
        <div>
          <h2>Projects</h2>
          <p>
            Add and manage your academic, personal, and professional
            projects.
          </p>
        </div>
      </div>

      <div className="projects-layout">
        <div className="project-form-card">
          <h3>{editingId ? "Edit Project" : "Add Project"}</h3>

          <form onSubmit={handleSubmit}>
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

            <label>
              Technologies
              <input
                type="text"
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
              />
              <small>Separate technologies with commas.</small>
            </label>

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

            <div className="project-form-actions">
              <button
                type="submit"
                className="project-primary-button"
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
                  className="project-secondary-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {message && (
            <p className="project-message">{message}</p>
          )}
        </div>

        <div className="projects-list">
          <div className="projects-list-header">
            <h3>Your Projects</h3>
            <span>{projects.length}</span>
          </div>

          {projects.length === 0 ? (
            <div className="empty-projects">
              <h4>No projects yet</h4>
              <p>Add your first project using the form.</p>
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
    </section>
  );
}

export default Projects;