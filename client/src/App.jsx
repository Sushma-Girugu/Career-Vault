import { useEffect, useState } from "react";
import Resume from "./components/Resume";

function App() {
  const [page, setPage] = useState("home");

  // =====================================================
  // PROFILE STATE
  // =====================================================

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    college: "",
    branch: "",
    year: ""
  });

  // =====================================================
  // SKILLS STATE
  // =====================================================

  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState("Beginner");

  // =====================================================
  // JOB APPLICATION STATE
  // =====================================================

  const [applications, setApplications] = useState([]);

  const [applicationForm, setApplicationForm] = useState({
    company: "",
    role: "",
    status: "Applied",
    appliedDate: "",
    jobLink: ""
  });

  const [editingApplicationId, setEditingApplicationId] =
    useState(null);

  // =====================================================
  // PROFILE FUNCTIONS
  // =====================================================

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const saveProfile = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(profile)
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Profile saved successfully!");
        console.log("Saved profile:", data);
      } else {
        alert("Failed to save profile");
        console.log(data);
      }
    } catch (error) {
      console.log("Profile save error:", error);
      alert("Server connection failed");
    }
  };

  // =====================================================
  // LOAD SKILLS
  // =====================================================

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

  return (
    <div>
      <h1>CareerVault</h1>

      <p>
        Your Personal Career Management Platform
      </p>

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <button
        onClick={() => setPage("home")}
      >
        Home
      </button>

      <button
        onClick={() => setPage("profile")}
      >
        My Profile
      </button>

      <button
        onClick={() => setPage("skills")}
      >
        Skills
      </button>

      <button
        onClick={() => setPage("applications")}
      >
        Job Applications
      </button>

      <button
        onClick={() => setPage("projects")}
      >
        Projects
      </button>

      <button
        onClick={() => setPage("resume")}
      >
        Resume
      </button>

      <hr />

      {/* =================================================
          HOME
      ================================================= */}

      {page === "home" && (
        <div>
          <h2>
            Welcome to CareerVault
          </h2>

          <p>
            Manage your career information
            in one place.
          </p>
        </div>
      )}

      {/* =================================================
          PROFILE
      ================================================= */}

      {page === "profile" && (
        <div>
          <h2>My Profile</h2>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={profile.name}
            onChange={handleChange}
          />

          <br />
          <br />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={profile.email}
            onChange={handleChange}
          />

          <br />
          <br />

          <input
            type="text"
            name="college"
            placeholder="College"
            value={profile.college}
            onChange={handleChange}
          />

          <br />
          <br />

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

      {page === "resume" && <Resume />}
    </div>
  );
}

export default App;
