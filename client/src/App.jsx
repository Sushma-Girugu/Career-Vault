import Projects from "./components/Projects/Projects";
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api";
import JobApplications from "./components/JobApplications/JobApplications";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [page, setPage] = useState("home");
  // =====================================================
  // PROFILE STATE
  // =====================================================

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    college: "",
    branch: "",
    year: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    bio: ""
});

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    skills: 1,
    projects: 0,
    applications: 0,
    profile: 0
  });

  // ================================
  // NAVIGATION
  // ================================

  const navigation = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Profile", icon: "◉" },
    { name: "Skills", icon: "◆" },
    { name: "Projects", icon: "▣" },
    { name: "Job Applications", icon: "▤" },
    { name: "Job Test", icon: "✓" },
    { name: "Resume", icon: "▥" }
  ];

  const handleNavigation = (page) => {
    setActivePage(page);
    setMessage("");
    setError("");
  };

  // ================================
  // LOAD PROFILE
  // ================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setProfileLoading(true);

      const response = await fetch(`${API}/profile`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load profile");
      }

      if (Array.isArray(data) && data.length > 0) {
        const savedProfile = data[0];

        setProfile((prev) => ({
          ...prev,
          ...savedProfile
        }));

        calculateProfileCompletion(savedProfile);
      }
    } catch (err) {
      console.log("Profile loading error:", err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  // =====================================================
  // LOAD SKILLS
  // =====================================================
    const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));

    setError("");
    setMessage("");
  };

  const loadSkills = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/skills"
      );

      const data = await response.json();

      if (response.ok) {
        setSkills(data);
      } else {
        console.log("Failed to load skills:", data);
      }
    } catch (error) {
      console.log("Skills fetch error:", error);
    }
  };

  // =====================================================
  // ADD SKILL
  // =====================================================
  const calculateProfileCompletion = (data = profile) => {
    const fields = [
      data.name,
      data.email,
      data.college,
      data.branch,
      data.year,
      data.phone,
      data.location,
      data.linkedin,
      data.github,
      data.portfolio,
      data.bio
    ];

    const completed = fields.filter(
      (field) => field && field.toString().trim() !== ""
    ).length;

    const percentage = Math.round(
      (completed / fields.length) * 100
    );

    setStats((prev) => ({
      ...prev,
      profile: percentage
    }));

    return percentage;
  };
  const addSkill = async () => {
    if (!skillName.trim()) {
      alert("Please enter a skill name");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/skills",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: skillName,
            level: skillLevel
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Skill added successfully!");

        console.log("Saved skill:", data);

        setSkillName("");
        setSkillLevel("Beginner");

        loadSkills();
      } else {
        alert("Failed to add skill");
        console.log(data);
      }
    } catch (error) {
      console.log("Skill save error:", error);
      alert("Server connection failed");
    }
  };

  // =====================================================
  // DELETE SKILL
  // =====================================================
    const validateProfile = () => {
    if (!profile.name.trim()) {
      setError("Full name is required.");
      return false;
    }

    if (profile.name.trim().length < 3) {
      setError("Full name must contain at least 3 characters.");
      return false;
    }

    if (!profile.email.trim()) {
      setError("Email address is required.");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(profile.email.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!profile.college.trim()) {
      setError("College / University is required.");
      return false;
    }

    if (!profile.branch.trim()) {
      setError("Branch / Course is required.");
      return false;
    }

    if (profile.phone) {
      if (!/^[0-9]{10}$/.test(profile.phone)) {
        setError(
          "Phone number must contain exactly 10 digits."
        );
        return false;
      }
    }

    if (profile.year) {
      if (!/^\d{4}$/.test(profile.year)) {
        setError(
          "Graduation year must contain 4 digits."
        );
        return false;
      }
    }

    if (
      profile.linkedin &&
      !profile.linkedin.startsWith("http")
    ) {
      setError(
        "LinkedIn URL must start with http:// or https://"
      );
      return false;
    }

    if (
      profile.github &&
      !profile.github.startsWith("http")
    ) {
      setError(
        "GitHub URL must start with http:// or https://"
      );
      return false;
    }

    if (
      profile.portfolio &&
      !profile.portfolio.startsWith("http")
    ) {
      setError(
        "Portfolio URL must start with http:// or https://"
      );
      return false;
    }

    return true;
  };

  const deleteSkill = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/skills/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Skill deleted successfully!");

        console.log("Deleted skill:", data);

        loadSkills();
      } else {
        alert("Failed to delete skill");
        console.log(data);
      }
    } catch (error) {
      console.log("Skill delete error:", error);
      alert("Server connection failed");
    }
  };

  // =====================================================
  // LOAD JOB APPLICATIONS
  // =====================================================

  const loadApplications = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/job-applications"
      );

      const data = await response.json();

      if (response.ok) {
        setApplications(data);
      } else {
        console.log(
          "Failed to load job applications:",
          data
        );
      }
    } catch (error) {
      console.log(
        "Job applications fetch error:",
        error
      );
    }
  };

  // =====================================================
  // JOB APPLICATION FORM CHANGE
  // =====================================================

  const handleApplicationChange = (e) => {
    setApplicationForm({
      ...applicationForm,
      [e.target.name]: e.target.value
    });
  };

  // =====================================================
  // ADD / UPDATE JOB APPLICATION
  // =====================================================

  const saveApplication = async () => {
    if (!applicationForm.company.trim()) {
      alert("Please enter company name");
      return;
    }

    if (!applicationForm.role.trim()) {
      alert("Please enter job role");
      return;
    }

    try {
      let response;

      // UPDATE
      if (editingApplicationId) {
        response = await fetch(
          `http://localhost:5000/api/job-applications/${editingApplicationId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(applicationForm)
          }
        );
      }

      // ADD
      else {
        response = await fetch(
          "http://localhost:5000/api/job-applications",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(applicationForm)
          }
        );
      }

      const data = await response.json();

      if (response.ok) {
        if (editingApplicationId) {
          alert(
            "Job application updated successfully!"
          );
        } else {
          alert(
            "Job application added successfully!"
          );
        }

        console.log(
          "Job application response:",
          data
        );

        clearApplicationForm();

        loadApplications();
      } else {
        alert(
          "Failed to save job application"
        );

        console.log(data);
      }
    } catch (error) {
      console.log(
        "Job application save error:",
        error
      );

      alert("Server connection failed");
    }
  };

  // =====================================================
  // EDIT JOB APPLICATION
  // =====================================================

  const editApplication = (application) => {
    setApplicationForm({
      company: application.company,
      role: application.role,
      status: application.status,
      appliedDate: application.appliedDate
        ? application.appliedDate.substring(0, 10)
        : "",
      jobLink: application.jobLink || ""
    });

    setEditingApplicationId(
      application._id
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =====================================================
  // DELETE JOB APPLICATION
  // =====================================================

  const deleteApplication = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job application?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/job-applications/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          "Job application deleted successfully!"
        );

        console.log(
          "Deleted application:",
          data
        );

        loadApplications();
      } else {
        alert(
          "Failed to delete job application"
        );

        console.log(data);
      }
    } catch (error) {
      console.log(
        "Job application delete error:",
        error
      );

      alert("Server connection failed");
    }
  };

  // =====================================================
  // CLEAR JOB APPLICATION FORM
  // =====================================================

  const clearApplicationForm = () => {
    setApplicationForm({
      company: "",
      role: "",
      status: "Applied",
      appliedDate: "",
      jobLink: ""
    });

    setEditingApplicationId(null);
  };

  // =====================================================
  // LOAD DATA WHEN APP STARTS
  // =====================================================

  useEffect(() => {
    loadSkills();
    loadApplications();
  }, []);

  // =====================================================
  // UI
  // =====================================================

        <header className="topbar">

          <div>
            <h1>
              {activePage}
            </h1>

            <p>
              {activePage === "Dashboard"
                ? "Welcome back! Here's your career overview."
                : activePage === "Profile"
                ? "Manage your personal and professional information."
                : `Manage your ${activePage.toLowerCase()} information.`}
            </p>
          </div>

          <div className="user-area">

            <div className="notification">
              ♢
            </div>

            {/* CLICKABLE PROFILE AVATAR */}
            <button
              type="button"
              className="avatar"
              onClick={() =>
                handleNavigation("Profile")
              }
              title="Open Profile"
            >
              {profile.name
                ? profile.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </button>

          </div>

        </header>

        {/* ======================================
            DASHBOARD
        ====================================== */}

        {activePage === "Dashboard" && (

          <section>

            <div className="welcome-card">

              <div>

                <span className="small-label">
                  YOUR CAREER JOURNEY
                </span>

                <h2>
                  Build your future with CareerVault.
                </h2>

                <p>
                  Keep your profile, skills,
                  projects, applications and
                  resume organized in one place.
                </p>

                <button
                  type="button"
                  className="primary-btn"
                  onClick={() =>
                    handleNavigation("Profile")
                  }
                >
                  Complete Profile →
                </button>

              </div>

              <div className="welcome-circle">
                <span>
                  {stats.profile}%
                </span>

                <small>
                  Profile
                </small>
              </div>

            </div>

            <div className="section-heading">

              <div>
                <h2>
                  Career Overview
                </h2>

                <p>
                  Your current career progress
                </p>
              </div>

            </div>

            <div className="stats-grid">

              <div className="stat-card">

                <div className="stat-icon purple">
                  ◉
                </div>

                <div>
                  <span>
                    Profile
                  </span>

                  <strong>
                    {stats.profile}%
                  </strong>

                  <small>
                    Completion
                  </small>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon blue">
                  ◆
                </div>

                <div>
                  <span>
                    Skills
                  </span>

                  <strong>
                    {stats.skills}
                  </strong>

                  <small>
                    Skills added
                  </small>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon green">
                  ▣
                </div>

                <div>
                  <span>
                    Projects
                  </span>

                  <strong>
                    {stats.projects}
                  </strong>

                  <small>
                    Projects added
                  </small>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon orange">
                  ▤
                </div>

                <div>
                  <span>
                    Applications
                  </span>

                  <strong>
                    {stats.applications}
                  </strong>

                  <small>
                    Job applications
                  </small>
                </div>

              </div>

            </div>

            <div className="dashboard-grid">

              {/* PROFILE PROGRESS */}

              <div className="panel">

                <div className="panel-header">

                  <div>
                    <h3>
                      Profile Progress
                    </h3>

                    <p>
                      Complete your profile
                      to stand out.
                    </p>
                  </div>

                  <strong>
                    {stats.profile}%
                  </strong>

                </div>

                <div className="progress">

                  <div
                    style={{
                      width: `${stats.profile}%`
                    }}
                  ></div>

                </div>

                <div className="progress-items">

                  <span>
                    {profile.name &&
                    profile.email
                      ? "✓"
                      : "○"}{" "}
                    Basic information
                  </span>

                  <span>
                    {profile.college &&
                    profile.branch
                      ? "✓"
                      : "○"}{" "}
                    Education
                  </span>

                  <span>
                    {profile.linkedin ||
                    profile.github
                      ? "✓"
                      : "○"}{" "}
                    Professional links
                  </span>

                  <span>
                    {profile.bio
                      ? "✓"
                      : "○"}{" "}
                    Bio
                  </span>

                </div>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() =>
                    handleNavigation("Profile")
                  }
                >
                  Update Profile
                </button>

              </div>

              {/* QUICK ACTIONS */}

              <div className="panel">

                <div className="panel-header">

                  <div>
                    <h3>
                      Quick Actions
                    </h3>

                    <p>
                      Manage your career faster.
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  className="action-btn"
                  onClick={() =>
                    handleNavigation("Profile")
                  }
                >
                  <span>👤</span>
                  Update Profile
                  <b>→</b>
                </button>

      <button
        onClick={() => setPage("projects")}
      >
        Projects
      </button>

      <button
                  type="button"
                  className="action-btn"
                  onClick={() =>
                    handleNavigation("Projects")
                  }
                >
                  <span>💼</span>
                  Add Project
                  <b>→</b>
                </button>
      <button
        onClick={() => setPage("resume")}
      >
        Resume
      </button>

              </div>

            </div>

          </section>

        )}

        {/* ======================================
            PROFILE PAGE
        ====================================== */}

        {activePage === "Profile" && (

          <section className="profile-page">

            {/* PROFILE HEADER */}

            <div className="profile-header-card">

              <div className="profile-avatar">

                {profile.name
                  ? profile.name
                      .charAt(0)
                      .toUpperCase()
                  : "U"}

              </div>

              <div>

                <h2>
                  {profile.name ||
                    "Your Name"}
                </h2>

                <p>
                  {profile.branch ||
                    "Student"}

                  {profile.college
                    ? ` • ${profile.college}`
                    : ""}
                </p>

                <span className="profile-status">
                  ● Profile
                </span>

              </div>

            </div>

            {/* PROFILE FORM */}

            <form
              className="profile-form"
              onSubmit={saveProfile}
            >

              {/* PERSONAL */}

              <div className="form-section">

                <div className="form-title">

                  <h3>
                    Personal Information
                  </h3>

                  <p>
                    Tell us about yourself.
                  </p>

                </div>

                <div className="form-grid">

                  <div className="field">

                    <label>
                      Full Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />

                  </div>

                  <div className="field">

                    <label>
                      Email *
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                    />

                  </div>

                  <div className="field">

                    <label>
                      Phone
                    </label>

          <input
            type="text"
            name="branch"
            placeholder="Branch"
            value={profile.branch}
            onChange={handleChange}
          />

          <br />
          <br />

          <input
            type="text"
            name="year"
            placeholder="Year"
            value={profile.year}
            onChange={handleChange}
          />

          <br />
          <br />

          <button onClick={saveProfile}>
            Save Profile
          </button>
        </div>
      )}

      {/* =================================================
          SKILLS
      ================================================= */}

      {page === "skills" && (
        <div>
          <h2>Skills</h2>

          <p>
            Add and manage your technical skills.
          </p>

            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              placeholder="City, State"
            />

          <input
            type="text"
            placeholder="Enter skill name"
            value={skillName}
            onChange={(e) =>
              setSkillName(e.target.value)
            }
          />

          <br />
          <br />

          <select
            value={skillLevel}
            onChange={(e) =>
              setSkillLevel(e.target.value)
            }
          >
            <option value="Beginner">
              Beginner
            </option>

            <option value="Intermediate">
              Intermediate
            </option>

            <option value="Advanced">
              Advanced
            </option>
          </select>

          <br />
          <br />

          <button onClick={addSkill}>
            Add Skill
          </button>

          <hr />

          <h3>My Skills</h3>

          {skills.length === 0 ? (
            <p>
              No skills added yet.
            </p>
          ) : (
            <ul>
              {skills.map((skill) => (
                <li key={skill._id}>
                  <strong>
                    {skill.name}
                  </strong>

                  {" - "}

                  {skill.level}

                  {" "}

                  <button
                    onClick={() =>
                      deleteSkill(
                        skill._id
                      )
                    }
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* =================================================
          JOB APPLICATIONS
      ================================================= */}

      {page === "applications" && (
        <div>
          <h2>
            Job Applications
          </h2>

          <p>
            Track your job applications
            and their current status.
          </p>

          <hr />

          <h3>
            {editingApplicationId
              ? "Edit Job Application"
              : "Add Job Application"}
          </h3>

          {/* COMPANY */}

          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={
              applicationForm.company
            }
            onChange={
              handleApplicationChange
            }
          />

          <br />
          <br />

          {/* ROLE */}

          <input
            type="text"
            name="role"
            placeholder="Job Role"
            value={
              applicationForm.role
            }
            onChange={
              handleApplicationChange
            }
          />

          <br />
          <br />

          {/* STATUS */}

          <select
            name="status"
            value={
              applicationForm.status
            }
            onChange={
              handleApplicationChange
            }
          >
            <option value="Applied">
              Applied
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

          <br />
          <br />

          {/* APPLIED DATE */}

          <input
            type="date"
            name="appliedDate"
            value={
              applicationForm.appliedDate
            }
            onChange={
              handleApplicationChange
            }
          />

          <br />
          <br />

          {/* JOB LINK */}

          <input
            type="url"
            name="jobLink"
            placeholder="Job Link"
            value={
              applicationForm.jobLink
            }
            onChange={
              handleApplicationChange
            }
          />

          <br />
          <br />

          {/* ADD / UPDATE */}

          <button
            onClick={saveApplication}
          >
            {editingApplicationId
              ? "Update Application"
              : "Add Application"}
          </button>

          {" "}

          {/* CANCEL */}

          {editingApplicationId && (
            <button
              onClick={
                clearApplicationForm
              }
            >
              Cancel Edit
            </button>
          )}

          <hr />

          {/* APPLICATION LIST */}

          <h3>
            My Applications
          </h3>

          {applications.length === 0 ? (
            <p>
              No job applications
              added yet.
            </p>
          ) : (
            <ul>
              {applications.map(
                (application) => (
                  <li
                    key={
                      application._id
                    }
                  >
                    <strong>
                      {
                        application.company
                      }
                    </strong>

                    {" - "}

                    {
                      application.role
                    }

                    {" | Status: "}

                    <strong>
                      {
                        application.status
                      }
                    </strong>

                    {" | Applied: "}

                    {application.appliedDate
                      ? application.appliedDate.substring(
                          0,
                          10
                        )
                      : "N/A"}

                    {" "}

                    {application.jobLink && (
                      <>
                        {" | "}

                        <a
                          href={
                            application.jobLink
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          Job Link
                        </a>
                      </>
                    )}

                    {" "}

                    <button
                      onClick={() =>
                        editApplication(
                          application
                        )
                      }
                    >
                      Edit
                    </button>

                    {" "}

                    <button
                      onClick={() =>
                        deleteApplication(
                          application._id
                        )
                      }
                    >
                      Delete
                    </button>
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      )}

      {/* =================================================
          PROJECTS
      ================================================= */}

      {page === "projects" && (
        <div>
          <h2>Projects</h2>

          <p>
            Add and manage your projects.
          </p>
        </div>
      )}

      {/* =================================================
          RESUME
      ================================================= */}

      {page === "resume" && <Resume profile={profile} />}
      {/* =================================================
          JOB TESTS
      ================================================= */}

      {page === "jobtest" && (
        <div>
          <h2>Resume</h2>

          <p>
            Your resume information
            will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;