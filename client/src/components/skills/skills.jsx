import { useEffect, useState } from "react";
import "./skills.css";

const API = "http://localhost:5000/api";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    };
  };

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/skills`, {
        headers: getHeaders()
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load skills");
      }

      setSkills(data);
    } catch (err) {
      console.error("Load skills error:", err);
      setError(err.message || "Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Skill name is required.");
      return;
    }

    try {
      setLoading(true);

      const url = editingId
        ? `${API}/skills/${editingId}`
        : `${API}/skills`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({ name: name.trim(), level })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save skill");
      }

      setMessage(
        editingId
          ? "Skill updated successfully."
          : "Skill added successfully."
      );
      setName("");
      setLevel("Beginner");
      setEditingId(null);
      await loadSkills();
    } catch (err) {
      console.error("Save skill error:", err);
      setError(err.message || "Failed to save skill");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill._id);
    setName(skill.name);
    setLevel(skill.level);
    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const response = await fetch(`${API}/skills/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete skill");
      }

      setMessage("Skill deleted successfully.");
      await loadSkills();
    } catch (err) {
      console.error("Delete skill error:", err);
      setError(err.message || "Failed to delete skill");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setLevel("Beginner");
    setMessage("");
    setError("");
  };

  return (
    <section className="skills-page">
      <div className="skills-header">
        <div>
          <h2>Manage Your Skills</h2>
          <p>Add and manage your technical and professional skills.</p>
        </div>
      </div>

      <div className="skills-form-card">
        <h3>{editingId ? "Edit Skill" : "Add New Skill"}</h3>

        <form onSubmit={handleSubmit}>
          <div className="skills-form-grid">
            <div className="field">
              <label>Skill Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Java, Python, React"
              />
            </div>

            <div className="field">
              <label>Skill Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="skills-form-actions">
            {editingId && (
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            )}
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Saving..." : editingId ? "Update Skill" : "Add Skill"}
            </button>
          </div>
        </form>
      </div>

      {error && <div className="alert error">⚠ {error}</div>}
      {message && <div className="alert success">✓ {message}</div>}

      <div className="skills-list-section">
        <div className="section-heading">
          <div>
            <h3>Your Skills</h3>
            <p>{skills.length} skill(s) added</p>
          </div>
        </div>

        {loading && skills.length === 0 ? (
          <div className="empty-state">Loading skills...</div>
        ) : skills.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◆</div>
            <h3>No skills added yet</h3>
            <p>Add your first skill using the form above.</p>
          </div>
        ) : (
          <div className="skills-grid">
            {skills.map((skill) => (
              <div className="skill-card" key={skill._id}>
                <div className="skill-icon">◆</div>
                <div className="skill-info">
                  <h3>{skill.name}</h3>
                  <span className={`skill-level ${skill.level.toLowerCase()}`}>
                    {skill.level}
                  </span>
                </div>
                <div className="skill-actions">
                  <button type="button" onClick={() => handleEdit(skill)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(skill._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Skills;
