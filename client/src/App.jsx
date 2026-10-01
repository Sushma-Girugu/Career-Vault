
import { useEffect, useState } from "react";
import Portfolio from "./components/Portfolio/Portfolio";
import "./App.css";

import Projects from "./components/Projects/Projects";
import JobTest from "./components/JobTest/JobTest";
import Resume from "./components/Resume";
import Auth from "./components/Auth/Auth";
import Gemini from "./components/Gemini/Gemini";
import Analytics from "./pages/Analytics";
import NotificationPanel from "./components/NotificationPanel";


const API = "/api";

const emptyProfile = {
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
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [activePage, setActivePage] = useState("Dashboard");

  const [profile, setProfile] = useState(emptyProfile);
  const [profileLoading, setProfileLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const [skillLoading, setSkillLoading] = useState(false);

  const [applications, setApplications] = useState([]);
  const [applicationForm, setApplicationForm] = useState({
    company: "",
    role: "",
    status: "Applied",
    appliedDate: "",
    jobLink: ""
  });
  const [editingApplicationId, setEditingApplicationId] = useState(null);

  const [projectCount, setProjectCount] = useState(0);
  const [stats, setStats] = useState({
    profile: 0,
    skills: 0,
    projects: 0,
    applications: 0
  });

  const navigation = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Profile", icon: "◉" },
    { name: "Skills", icon: "◆" },
    { name: "Projects", icon: "▣" },
    { name: "Portfolio", icon: "▤" },
    { name: "Job Applications", icon: "▤" },
    { name: "Job Test", icon: "✓" },
    { name: "Resume", icon: "▥" },
    { name: "Gemini AI", icon: "✦" },
    { name: "Analytics", icon: "◫" },
    { name: "Notifications", icon: "♢" }
  ];

  const getToken = () => localStorage.getItem("token");

  const authHeaders = () => {
    const token = getToken();

    return token
      ? {
          Authorization: `Bearer ${token}`
        }
      : {};
  };

  const jsonHeaders = () => ({
    "Content-Type": "application/json",
    ...authHeaders()
  });

  const handleNavigation = (page) => {
    setActivePage(page);
    setMessage("");
    setError("");
  };

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

    const percentage = Math.round((completed / fields.length) * 100);

    setStats((previous) => ({
      ...previous,
      profile: percentage
    }));

    return percentage;
  };

  const handleLogin = (user) => {
    setCurrentUser(user || null);
    setIsAuthenticated(true);
    setActivePage("Dashboard");
    setMessage("");
    setError("");

    loadProfile();
    loadSkills();
    loadApplications();
    loadProjects();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setCurrentUser(null);
    setIsAuthenticated(false);
    setProfile(emptyProfile);
    setSkills([]);
    setApplications([]);
    setProjectCount(0);
    setStats({
      profile: 0,
      skills: 0,
      projects: 0,
      applications: 0
    });
    setActivePage("Dashboard");
    setMessage("");
    setError("");
  };

  const loadApplicationCount = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
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

      if (response.ok && Array.isArray(data)) {
        setStats((prev) => ({
          ...prev,
          applications: data.length
        }));
      }
    } catch (err) {
      console.log(
        "Application count error:",
        err.message
      );
    }
  };

  useEffect(() => {
    loadApplicationCount();
  }, [activePage]);

  const loadProfile = async () => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      setProfileLoading(true);

      const response = await fetch(`${API}/profile`, {
        method: "GET",
        headers: authHeaders()
      });

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (response.status === 404) {
        setProfile(emptyProfile);
        calculateProfileCompletion(emptyProfile);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to load profile");
      }

      const savedProfile = data.profile || data;

      if (savedProfile) {
        const updatedProfile = {
          ...emptyProfile,
          ...savedProfile
        };

        setProfile(updatedProfile);
        calculateProfileCompletion(updatedProfile);
      }
    } catch (err) {
      console.error("Profile loading error:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value
    }));

    setError("");
    setMessage("");
  };

  const validateProfile = () => {
    setError("");

    if (!profile.name.trim()) {
      setError("Full name is required.");
      return false;
    }

    if (!profile.email.trim()) {
      setError("Email address is required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    if (profile.phone && !/^[0-9]{10}$/.test(profile.phone)) {
      setError("Phone number must contain exactly 10 digits.");
      return false;
    }

    if (profile.year && !/^\d{4}$/.test(profile.year)) {
      setError("Graduation year must contain 4 digits.");
      return false;
    }

    if (profile.linkedin && !profile.linkedin.startsWith("http")) {
      setError("LinkedIn URL must start with http:// or https://");
      return false;
    }

    if (profile.github && !profile.github.startsWith("http")) {
      setError("GitHub URL must start with http:// or https://");
      return false;
    }

    if (profile.portfolio && !profile.portfolio.startsWith("http")) {
      setError("Portfolio URL must start with http:// or https://");
      return false;
    }

    return true;
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    if (!validateProfile()) {
      return;
    }

    if (!getToken()) {
      setError("Please login first.");
      return;
    }

    try {
      setProfileLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(`${API}/profile`, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(profile)
      });

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to save profile");
      }

      const savedProfile = data.profile || data;
      const updatedProfile = {
        ...emptyProfile,
        ...profile,
        ...savedProfile
      };

      setProfile(updatedProfile);
      calculateProfileCompletion(updatedProfile);
      setMessage("Profile saved successfully.");
    } catch (err) {
      console.error("Profile save error:", err);
      setError(err.message || "Failed to save profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const loadSkills = async () => {
    const token = getToken();

    if (!token) {
      setSkills([]);
      return;
    }

    try {
      const response = await fetch(`${API}/skills`, {
        headers: authHeaders()
      });

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to load skills");
      }

      const skillList = Array.isArray(data)
        ? data
        : data.skills || [];

      setSkills(skillList);

      setStats((previous) => ({
        ...previous,
        skills: skillList.length
      }));
    } catch (err) {
      console.error("Skills fetch error:", err);
    }
  };

  const addSkill = async (e) => {
    e.preventDefault();

    if (!skillName.trim()) {
      alert("Please enter a skill name.");
      return;
    }

    if (!getToken()) {
      alert("Please login first.");
      return;
    }

    try {
      setSkillLoading(true);

      const response = await fetch(`${API}/skills`, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify({
          name: skillName.trim(),
          level: skillLevel
        })
      });

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to add skill");
      }

      setSkillName("");
      setSkillLevel("Beginner");
      await loadSkills();
    } catch (err) {
      console.error("Skill save error:", err);
      alert(err.message || "Server connection failed.");
    } finally {
      setSkillLoading(false);
    }
  };

  const deleteSkill = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/skills/${id}`, {
        method: "DELETE",
        headers: authHeaders()
      });

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete skill");
      }

      await loadSkills();
    } catch (err) {
      console.error("Skill delete error:", err);
      alert(err.message || "Server connection failed.");
    }
  };

  const loadProjects = async () => {
    if (!getToken()) {
      return;
    }

    try {
      const response = await fetch(`${API}/projects`, {
        headers: authHeaders()
      });

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        return;
      }

      const projectList = Array.isArray(data)
        ? data
        : data.projects || [];

      setProjectCount(projectList.length);

      setStats((previous) => ({
        ...previous,
        projects: projectList.length
      }));
    } catch (err) {
      console.error("Projects fetch error:", err);
    }
  };

  const loadApplications = async () => {
    if (!getToken()) {
      setApplications([]);
      return;
    }

    try {
      const response = await fetch(`${API}/job-applications`, {
        headers: authHeaders()
      });

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        return;
      }

      const applicationList = Array.isArray(data)
        ? data
        : data.applications || [];

      setApplications(applicationList);

      setStats((previous) => ({
        ...previous,
        applications: applicationList.length
      }));
    } catch (err) {
      console.error("Job applications fetch error:", err);
    }
  };

  const handleApplicationChange = (e) => {
    const { name, value } = e.target;

    setApplicationForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

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

  const saveApplication = async (e) => {
    e.preventDefault();

    if (!applicationForm.company.trim()) {
      alert("Please enter company name.");
      return;
    }

    if (!applicationForm.role.trim()) {
      alert("Please enter job role.");
      return;
    }

    try {
      const url = editingApplicationId
        ? `${API}/job-applications/${editingApplicationId}`
        : `${API}/job-applications`;

      const response = await fetch(url, {
        method: editingApplicationId ? "PUT" : "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(applicationForm)
      });

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save job application"
        );
      }

      clearApplicationForm();
      await loadApplications();
    } catch (err) {
      console.error("Job application save error:", err);
      alert(err.message || "Server connection failed.");
    }
  };

  const editApplication = (application) => {
    setApplicationForm({
      company: application.company || "",
      role: application.role || "",
      status: application.status || "Applied",
      appliedDate: application.appliedDate
        ? application.appliedDate.substring(0, 10)
        : "",
      jobLink: application.jobLink || ""
    });

    setEditingApplicationId(application._id);
    setActivePage("Job Applications");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteApplication = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this job application?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/job-applications/${id}`,
        {
          method: "DELETE",
          headers: authHeaders()
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete application"
        );
      }

      await loadApplications();
    } catch (err) {
      console.error("Job application delete error:", err);
      alert(err.message || "Server connection failed.");
    }
  };

  const getPageDescription = () => {
    if (activePage === "Dashboard") {
      return "Welcome back! Here's your career overview.";
    }

    if (activePage === "Profile") {
      return "Manage your personal and professional information.";
    }

    if (activePage === "Skills") {
      return "Add and manage your technical skills.";
    }

    if (activePage === "Projects") {
      return "Add and manage your projects.";
    }

    if (activePage === "Job Applications") {
      return "Track your job applications and their current status.";
    }

    if (activePage === "Portfolio") {
      return "View and manage your professional portfolio.";
    }

    if (activePage === "Gemini AI") {
      return "Get AI-powered career guidance and assistance.";
    }

    return `Manage your ${activePage.toLowerCase()} information.`;
  };

  const renderDashboard = () => (
    <section>
      <div className="dashboard-hero">
        <div>
          <span className="small-label">YOUR CAREER JOURNEY</span>

          <h2>Good Afternoon, {profile.name || currentUser?.name || "there"}! 👋</h2>

          <p>Here’s your career progress overview.</p>

          <button
            type="button"
            className="primary-btn"
            onClick={() => handleNavigation("Profile")}
          >
            Complete Profile
          </button>
        </div>

        <div
          className="welcome-circle"
          style={{
            "--profile-progress": `${stats.profile}%`
          }}
        >
          <div className="welcome-circle-inner">
            <span>{stats.profile}%</span>
            <small>Profile</small>
          </div>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <h2>Career Overview</h2>
          <p>Your current career progress</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">◉</div>
          <div>
            <span>Profile</span>
            <strong>{stats.profile}%</strong>
            <small>Completion</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">◆</div>
          <div>
            <span>Skills</span>
            <strong>{stats.skills}</strong>
            <small>Skills added</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">▣</div>
          <div>
            <span>Projects</span>
            <strong>{stats.projects}</strong>
            <small>Projects added</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">▤</div>
          <div>
            <span>Applications</span>
            <strong>{stats.applications}</strong>
            <small>Job applications</small>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Profile Progress</h3>
              <p>Complete your profile to stand out.</p>
            </div>

            <strong>{stats.profile}%</strong>
          </div>

          <div className="progress">
            <div
              className="progress-fill"
              style={{ width: `${stats.profile}%` }}
            />
          </div>

          <div className="progress-items">
            <span>
              {profile.name && profile.email ? "✓" : "○"} Basic information
            </span>

            <span>
              {profile.college && profile.branch ? "✓" : "○"} Education
            </span>

            <span>
              {profile.linkedin || profile.github ? "✓" : "○"} Professional links
            </span>

            <span>
              {profile.bio ? "✓" : "○"} Bio
            </span>
          </div>

          <button
            type="button"
            className="secondary-btn"
            onClick={() => handleNavigation("Profile")}
          >
            Update Profile
          </button>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Manage your career faster.</p>
            </div>
          </div>

          <button
            type="button"
            className="quick-action"
            onClick={() => handleNavigation("Profile")}
          >
            <span>👤</span>
            Edit Profile
            <b>→</b>
          </button>

          <button
            type="button"
            className="quick-action"
            onClick={() => handleNavigation("Skills")}
          >
            <span>◆</span>
            Add Skill
            <b>→</b>
          </button>

          <button
            type="button"
            className="quick-action"
            onClick={() => handleNavigation("Job Applications")}
          >
            <span>▤</span>
            Add Application
            <b>→</b>
          </button>

      </div>
    </div>
  </section>
  );

  const renderProfile = () => (
    <section>
      <div className="section-heading">
        <div>
          <h2>My Profile</h2>
          <p>Keep your professional information updated.</p>
        </div>
      </div>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={saveProfile}>
        <div className="form-section">
          <div className="form-title">
            <h3>Personal Information</h3>
            <p>Tell us about yourself.</p>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="field">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                placeholder="you@example.com"
              />
            </div>

            <div className="field">
              <label>College / University *</label>
              <input
                type="text"
                name="college"
                value={profile.college}
                onChange={handleProfileChange}
                placeholder="College / University"
              />
            </div>

            <div className="field">
              <label>Branch / Course *</label>
              <input
                type="text"
                name="branch"
                value={profile.branch}
                onChange={handleProfileChange}
                placeholder="AI & Data Science"
              />
            </div>

            <div className="field">
              <label>Graduation Year</label>
              <input
                type="text"
                name="year"
                value={profile.year}
                onChange={handleProfileChange}
                placeholder="2027"
                maxLength="4"
              />
            </div>

            <div className="field">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                placeholder="10 digit phone number"
                maxLength="10"
              />
            </div>

            <div className="field">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleProfileChange}
                placeholder="City, State"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-title">
            <h3>Professional Links</h3>
            <p>Add your professional profiles.</p>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={profile.linkedin}
                onChange={handleProfileChange}
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div className="field">
              <label>GitHub</label>
              <input
                type="url"
                name="github"
                value={profile.github}
                onChange={handleProfileChange}
                placeholder="https://github.com/..."
              />
            </div>

            <div className="field">
              <label>Portfolio</label>
              <input
                type="url"
                name="portfolio"
                value={profile.portfolio}
                onChange={handleProfileChange}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-title">
            <h3>About You</h3>
            <p>Write a short professional bio.</p>
          </div>

          <div className="field">
            <label>Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleProfileChange}
              placeholder="Write a short description about yourself..."
              rows="5"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="primary-btn"
            disabled={profileLoading}
          >
            {profileLoading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </section>
  );

  const renderSkills = () => (
    <section>
      <div className="section-heading">
        <div>
          <h2>Skills</h2>
          <p>Add and manage your technical skills.</p>
        </div>
      </div>

      <div className="panel">
        <h3>Add New Skill</h3>

        <form onSubmit={addSkill}>
          <div className="form-grid">
            <div className="field">
              <label>Skill Name</label>
              <input
                type="text"
                placeholder="Enter skill name"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Skill Level</label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={skillLoading}
          >
            {skillLoading ? "Adding..." : "Add Skill"}
          </button>
        </form>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>My Skills</h3>
            <p>
              {skills.length} skill{skills.length !== 1 ? "s" : ""} added
            </p>
          </div>
        </div>

        {skills.length === 0 ? (
          <p>No skills added yet.</p>
        ) : (
          <div className="skills-list">
            {skills.map((skill) => (
              <div
                key={skill._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid #eee"
                }}
              >
                <div>
                  <strong>{skill.name}</strong>
                  <span>{" - "}{skill.level}</span>
                </div>

                <button
                  type="button"
                  onClick={() => deleteSkill(skill._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );

  const renderApplications = () => (
    <section>
      <div className="section-heading">
        <div>
          <h2>Job Applications</h2>
          <p>Track your job applications and their current status.</p>
        </div>
      </div>

      <div className="panel">
        <h3>
          {editingApplicationId
            ? "Edit Job Application"
            : "Add Job Application"}
        </h3>

        <form onSubmit={saveApplication}>
          <div className="form-grid">
            <div className="field">
              <label>Company</label>
              <input
                type="text"
                name="company"
                placeholder="Company Name"
                value={applicationForm.company}
                onChange={handleApplicationChange}
              />
            </div>

            <div className="field">
              <label>Job Role</label>
              <input
                type="text"
                name="role"
                placeholder="Software Engineer"
                value={applicationForm.role}
                onChange={handleApplicationChange}
              />
            </div>

            <div className="field">
              <label>Status</label>
              <select
                name="status"
                value={applicationForm.status}
                onChange={handleApplicationChange}
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="field">
              <label>Applied Date</label>
              <input
                type="date"
                name="appliedDate"
                value={applicationForm.appliedDate}
                onChange={handleApplicationChange}
              />
            </div>

            <div className="field">
              <label>Job Link</label>
              <input
                type="url"
                name="jobLink"
                placeholder="https://..."
                value={applicationForm.jobLink}
                onChange={handleApplicationChange}
              />
            </div>
          </div>

          <button type="submit" className="primary-btn">
            {editingApplicationId
              ? "Update Application"
              : "Add Application"}
          </button>

          {editingApplicationId && (
            <button
              type="button"
              className="secondary-btn"
              onClick={clearApplicationForm}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div className="panel">
        <h3>My Applications</h3>

        {applications.length === 0 ? (
          <p>No job applications added yet.</p>
        ) : (
          <ul className="applications-list">
            {applications.map((application) => (
              <li key={application._id}>
                <div>
                  <strong>{application.company}</strong>
                  <span>{" - "}{application.role}</span>

                  <p>
                    Status: <strong>{application.status}</strong>
                  </p>

                  <p>
                    Applied:{" "}
                    {application.appliedDate
                      ? application.appliedDate.substring(0, 10)
                      : "N/A"}
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

                  <button
                    type="button"
                    onClick={() => editApplication(application)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    style={{ marginLeft: "10px" }}
                    onClick={() =>
                      deleteApplication(application._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    loadProfile();
    loadSkills();
    loadApplications();
    loadProjects();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">CV</div>

          <div>
            <h2>CareerVault</h2>
            <span>Career Management</span>
          </div>
        </div>

        <div className="menu-title">MAIN MENU</div>

        <nav>
          {navigation.map((item) => (
            <button
              type="button"
              key={item.name}
              className={
                activePage === item.name
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => handleNavigation(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="help-box"
            onClick={() => {
              setActivePage("Profile");
              setMessage(
                "Need help? Complete your profile information first, then add your skills, projects, applications and resume."
              );
              setError("");
            }}
            title="Get help with your career profile"
          >
            <div className="help-icon">?</div>

            <div>
              <strong>Need help?</strong>
              <p>Click here for guidance.</p>
            </div>
          </button>
        </div>
      </aside>

                <main className="main">
        <header className="topbar">
          <div className="topbar-title">
            <h1>{activePage}</h1>
            <p>{getPageDescription()}</p>
          </div>

          <div className="top-search">
            <span>⌕</span>
            <input aria-label="Search" placeholder="Search anything..." />
          </div>

          <div className="user-area">
            <div className="notification">♢</div>

            <button
              type="button"
              className="top-signout"
              onClick={handleLogout}
              title="Sign out of CareerVault"
            >
              ↪ Sign Out
            </button>

            <button
              type="button"
              className="avatar"
              onClick={() => handleNavigation("Profile")}
              title="Open Profile"
            >
              {profile.name
                ? profile.name.charAt(0).toUpperCase()
                : currentUser?.name
                ? currentUser.name.charAt(0).toUpperCase()
                : "U"}
            </button>
          </div>
        </header>

        {message && (
          <div className="success-message">{message}</div>
        )}

        {/* ======================================
            JOB APPLICATIONS
        ====================================== */}


        {error && (
          <div className="error-message">{error}</div>
        )}

        {activePage === "Dashboard" && renderDashboard()}

        {activePage === "Profile" && renderProfile()}

        {activePage === "Skills" && renderSkills()}

        {activePage === "Projects" && (
          <section className="cv-module-page page-projects">
            <Projects />
          </section>
        )}

        {activePage === "Portfolio" && (
          <section className="cv-module-page page-portfolio">
            <Portfolio />
          </section>
        )}

        {activePage === "Job Applications" &&
          renderApplications()}

        {activePage === "Job Test" && (
          <section className="cv-module-page page-job-test">
            <JobTest />
          </section>
        )}

        {activePage === "Resume" && (
          <section className="cv-module-page page-resume">
            <Resume profile={profile} />
          </section>
        )}

        {activePage === "Gemini AI" && (
          <section className="cv-module-page page-gemini">
            <Gemini profile={profile} skills={skills} />
          </section>
        )}

        {/* ======================================
            ANALYTICS
        ====================================== */}

        {activePage === "Analytics" && (
          <section className="cv-module-page page-analytics">
            <Analytics />
          </section>
        )}

        {/* ======================================
            NOTIFICATIONS
        ====================================== */}

        {activePage === "Notifications" && (
          <section className="cv-module-page page-notifications">
            <NotificationPanel />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
