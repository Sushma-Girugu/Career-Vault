import React from "react";

function ProjectCard({
  project,
  onEdit,
  onDelete
}) {
  return (
    <div className="project-card">
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
          onClick={() => onEdit(project)}
        >
          Edit
        </button>

        <button
          className="delete-button"
          onClick={() => onDelete(project._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;