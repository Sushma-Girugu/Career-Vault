import Projects from "./components/Projects/Projects";
import { useEffect, useState } from "react";
import JobApplications from "./components/JobApplications/JobApplications";

function App() {
  const [page, setPage] = useState("home");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    college: "",
    branch: "",
    year: ""
  });

  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState("Beginner");

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

  useEffect(() => {
    loadSkills();
  }, []);

  return (
    <div>
      <h1>CareerVault</h1>

      <p>
        Your Personal Career Management Platform
      </p>

      <button onClick={() => setPage("home")}>
        Home
      </button>

      <button onClick={() => setPage("profile")}>
        My Profile
      </button>

      <button onClick={() => setPage("skills")}>
        Skills
      </button>

      <button onClick={() => setPage("applications")}>
        Job Applications
      </button>

      <button onClick={() => setPage("projects")}>
        Projects
      </button>

      <button onClick={() => setPage("resume")}>
        Resume
      </button>

      <hr />

      {page === "home" && (
        <div>
          <h2>Welcome to CareerVault</h2>

          <p>
            Manage your career information in one place.
          </p>
        </div>
      )}

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
            <p>No skills added yet.</p>
          ) : (
            <ul>
              {skills.map((skill) => (
                <li key={skill._id}>
                  <strong>{skill.name}</strong>
                  {" - "}
                  {skill.level}

                  {" "}

                  <button
                    onClick={() =>
                      deleteSkill(skill._id)
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

      {page === "applications" && (
        <JobApplications />
      )}

      {page === "projects" && <Projects />}

      {page === "resume" && (
        <div>
          <h2>Resume</h2>

          <p>
            Your resume information will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;