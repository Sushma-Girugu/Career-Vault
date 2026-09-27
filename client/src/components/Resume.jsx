import { useState } from "react";
import "./Resume.css";

function Resume() {
  const [resume, setResume] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    education: "",
    skills: "",
    experience: "",
    projects: "",
    certifications: "",
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setResume((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setResume({
      name: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      education: "",
      skills: "",
      experience: "",
      projects: "",
      certifications: "",
    });

    setShowPreview(false);
  };

  return (
    <div className="resume-page">
      <div className="resume-header">
        <h2>Resume Builder</h2>
        <p>Create and preview your professional resume.</p>
      </div>

      {!showPreview ? (
        <div className="resume-form-card">
          <div className="resume-section">
            <h3>Personal Information</h3>

            <div className="resume-grid">
              <div className="resume-field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={resume.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="resume-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={resume.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="resume-field">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={resume.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="resume-field">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={resume.location}
                  onChange={handleChange}
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>

          <div className="resume-section">
            <h3>Professional Summary</h3>

            <textarea
              name="summary"
              value={resume.summary}
              onChange={handleChange}
              placeholder="Write a short professional summary..."
              rows="4"
            />
          </div>

          <div className="resume-section">
            <h3>Education</h3>

            <textarea
              name="education"
              value={resume.education}
              onChange={handleChange}
              placeholder="Example: B.Tech in Computer Science - ABC College, 2026"
              rows="4"
            />
          </div>

          <div className="resume-section">
            <h3>Skills</h3>

            <textarea
              name="skills"
              value={resume.skills}
              onChange={handleChange}
              placeholder="Example: React, Node.js, MongoDB, JavaScript"
              rows="3"
            />
          </div>

          <div className="resume-section">
            <h3>Experience</h3>

            <textarea
              name="experience"
              value={resume.experience}
              onChange={handleChange}
              placeholder="Add internships, jobs, or other experience..."
              rows="5"
            />
          </div>

          <div className="resume-section">
            <h3>Projects</h3>

            <textarea
              name="projects"
              value={resume.projects}
              onChange={handleChange}
              placeholder="Describe your important projects..."
              rows="5"
            />
          </div>

          <div className="resume-section">
            <h3>Certifications</h3>

            <textarea
              name="certifications"
              value={resume.certifications}
              onChange={handleChange}
              placeholder="Add your certifications..."
              rows="4"
            />
          </div>

          <div className="resume-actions">
            <button className="resume-clear-btn" onClick={handleClear}>
              Clear
            </button>

            <button
              className="resume-preview-btn"
              onClick={() => setShowPreview(true)}
            >
              Preview Resume
            </button>
          </div>
        </div>
      ) : (
        <div className="resume-preview-card">
          <div className="preview-actions">
            <button
              className="resume-back-btn"
              onClick={() => setShowPreview(false)}
            >
              ← Edit Resume
            </button>

            <button
              className="resume-print-btn"
              onClick={() => window.print()}
            >
              Print / Save PDF
            </button>
          </div>

                      <div className="resume-document">
              <div className="resume-document-header">
                <h1>{resume.name || "Your Name"}</h1>

                <div className="contact-details">
                  {resume.email && <span>{resume.email}</span>}
                  {resume.phone && <span>{resume.phone}</span>}
                  {resume.location && <span>{resume.location}</span>}
                </div>
              </div>

              {resume.summary && (
                <section>
                  <h2>Professional Summary</h2>
                  <p>{resume.summary}</p>
                </section>
              )}

              {resume.education && (
                <section>
                  <h2>Education</h2>
                  <p>{resume.education}</p>
                </section>
              )}

              {resume.skills && (
                <section>
                  <h2>Skills</h2>
                  <p>{resume.skills}</p>
                </section>
              )}

              {resume.experience && (
                <section>
                  <h2>Experience</h2>
                  <p>{resume.experience}</p>
                </section>
              )}

              {resume.projects && (
                <section>
                  <h2>Projects</h2>
                  <p>{resume.projects}</p>
                </section>
              )}

              {resume.certifications && (
                <section>
                  <h2>Certifications</h2>
                  <p>{resume.certifications}</p>
                </section>
              )}
            </div>
          </div>
        )}
      </div>
    );
}

export default Resume;