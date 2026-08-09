import { useState } from "react";

function App() {
  const [page, setPage] = useState("home");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    college: "",
    branch: "",
    year: ""
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const saveProfile = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profile)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profile saved successfully!");
        console.log("Saved profile:", data);
      } else {
        alert("Failed to save profile");
        console.log(data);
      }
    } catch (error) {
      console.log(error);
      alert("Server connection failed");
    }
  };

  return (
    <div>
      <h1>CareerVault</h1>

      <p>Your Personal Career Management Platform</p>

      <button onClick={() => setPage("home")}>Home</button>
      <button onClick={() => setPage("profile")}>My Profile</button>
      <button onClick={() => setPage("skills")}>Skills</button>
      <button onClick={() => setPage("projects")}>Projects</button>
      <button onClick={() => setPage("resume")}>Resume</button>

      <hr />

      {/* HOME */}
      {page === "home" && (
        <div>
          <h2>Welcome to CareerVault</h2>
          <p>Manage your career information in one place.</p>
        </div>
      )}

      {/* PROFILE */}
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

          <button onClick={saveProfile}>Save Profile</button>
        </div>
      )}

      {/* SKILLS */}
      {page === "skills" && (
        <div>
          <h2>Skills</h2>
          <p>Add and manage your technical skills.</p>
        </div>
      )}

      {/* PROJECTS */}
      {page === "projects" && (
        <div>
          <h2>Projects</h2>
          <p>Add and manage your projects.</p>
        </div>
      )}

      {/* RESUME */}
      {page === "resume" && (
        <div>
          <h2>Resume</h2>
          <p>Your resume information will appear here.</p>
        </div>
      )}
    </div>
  );
}

export default App;