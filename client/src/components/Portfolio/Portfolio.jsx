import React, { useEffect, useState } from "react";
import "./Portfolio.css";

const API = "https://career-vault-1xyt.onrender.com/api";

function Portfolio() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  };

  const loadPortfolio = async () => {
    try {
      setLoading(true);

      const headers = getHeaders();

      const [
        profileResponse,
        skillsResponse,
        projectsResponse,
        achievementsResponse,
        socialLinksResponse
      ] = await Promise.all([
        fetch(`${API}/profile`, {
          headers
        }),

        fetch(`${API}/skills`, {
          headers
        }),

        fetch(`${API}/projects`, {
          headers
        }),

        fetch(`${API}/achievements`, {
          headers
        }),

        fetch(`${API}/social-links`, {
          headers
        })
      ]);

      // -----------------------------
      // PROFILE
      // -----------------------------

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();

        if (Array.isArray(profileData)) {
          setProfile(
            profileData.length > 0
              ? profileData[profileData.length - 1]
              : null
          );
        } else {
          setProfile(profileData);
        }
      } else {
        setProfile(null);
      }

      // -----------------------------
      // SKILLS
      // -----------------------------

      if (skillsResponse.ok) {
        const skillsData = await skillsResponse.json();

        setSkills(
          Array.isArray(skillsData)
            ? skillsData
            : []
        );
      } else {
        setSkills([]);
      }

      // -----------------------------
      // PROJECTS
      // -----------------------------

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();

        setProjects(
          Array.isArray(projectsData)
            ? projectsData
            : []
        );
      } else {
        setProjects([]);
      }

      // -----------------------------
      // ACHIEVEMENTS
      // -----------------------------

      if (achievementsResponse.ok) {
        const achievementsData =
          await achievementsResponse.json();

        setAchievements(
          Array.isArray(achievementsData)
            ? achievementsData
            : []
        );
      } else {
        setAchievements([]);
      }

      // -----------------------------
      // SOCIAL LINKS
      // -----------------------------

      if (socialLinksResponse.ok) {
        const socialLinksData =
          await socialLinksResponse.json();

        setSocialLinks(
          Array.isArray(socialLinksData)
            ? socialLinksData
            : []
        );
      } else {
        setSocialLinks([]);
      }

    } catch (error) {
      console.error(
        "Portfolio loading error:",
        error
      );

      setProfile(null);
      setSkills([]);
      setProjects([]);
      setAchievements([]);
      setSocialLinks([]);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // LOADING
  // -----------------------------

  if (loading) {
    return (
      <div className="portfolio-container">
        <section className="portfolio-section">
          <p>Loading portfolio...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="portfolio-container">

      {/* =====================================
          HERO
      ===================================== */}

      <section className="portfolio-hero">

        <h1>
          {profile?.name || "My Portfolio"}
        </h1>

        {profile?.branch && (
          <p>{profile.branch}</p>
        )}

        {profile?.college && (
          <p>{profile.college}</p>
        )}

        {profile?.bio && (
          <p>{profile.bio}</p>
        )}

      </section>


      {/* =====================================
          ABOUT ME
      ===================================== */}

      <section className="portfolio-section">

        <h2>About Me</h2>

        {profile ? (
          <div className="profile-details">

            {profile.name && (
              <p>
                <strong>Name:</strong>{" "}
                {profile.name}
              </p>
            )}

            {profile.email && (
              <p>
                <strong>Email:</strong>{" "}
                {profile.email}
              </p>
            )}

            {profile.phone && (
              <p>
                <strong>Phone:</strong>{" "}
                {profile.phone}
              </p>
            )}

            {profile.college && (
              <p>
                <strong>College:</strong>{" "}
                {profile.college}
              </p>
            )}

            {profile.branch && (
              <p>
                <strong>Branch:</strong>{" "}
                {profile.branch}
              </p>
            )}

            {profile.year && (
              <p>
                <strong>Graduation Year:</strong>{" "}
                {profile.year}
              </p>
            )}

            {profile.location && (
              <p>
                <strong>Location:</strong>{" "}
                {profile.location}
              </p>
            )}

            {profile.bio && (
              <p>
                <strong>About:</strong>{" "}
                {profile.bio}
              </p>
            )}

          </div>
        ) : (
          <p>
            Profile information is not available.
          </p>
        )}

      </section>


      {/* =====================================
          SKILLS
      ===================================== */}

      <section className="portfolio-section">

        <h2>Skills</h2>

        {skills.length === 0 ? (
          <p>No skills added yet.</p>
        ) : (
          <div className="portfolio-skills">

            {skills.map((skill) => (
              <div
                className="portfolio-skill"
                key={skill._id}
              >

                <h3>
                  {skill.name}
                </h3>

                {skill.level && (
                  <p>
                    {skill.level}
                  </p>
                )}

              </div>
            ))}

          </div>
        )}

      </section>


      {/* =====================================
          PROJECTS
      ===================================== */}

      <section className="portfolio-section">

        <h2>Projects</h2>

        {projects.length === 0 ? (
          <p>No projects added yet.</p>
        ) : (
          <div className="portfolio-projects">

            {projects.map((project) => (
              <div
                className="portfolio-project"
                key={project._id}
              >

                <h3>
                  {project.name}
                </h3>

                {project.description && (
                  <p>
                    {project.description}
                  </p>
                )}

                {project.technologies && (
                  <p>
                    <strong>
                      Technologies:
                    </strong>{" "}
                    {project.technologies}
                  </p>
                )}

                {project.role && (
                  <p>
                    <strong>
                      Role:
                    </strong>{" "}
                    {project.role}
                  </p>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                )}

                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live Demo
                  </a>
                )}

                {project.projectLink && (
                  <a
                    href={project.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                  </a>
                )}

              </div>
            ))}

          </div>
        )}

      </section>


      {/* =====================================
          ACHIEVEMENTS
      ===================================== */}

      <section className="portfolio-section">

        <h2>Achievements</h2>

        {achievements.length === 0 ? (
          <p>No achievements added yet.</p>
        ) : (
          <div className="portfolio-projects">

            {achievements.map((achievement) => (
              <div
                className="portfolio-project"
                key={achievement._id}
              >

                {achievement.title && (
                  <h3>
                    {achievement.title}
                  </h3>
                )}

                {achievement.description && (
                  <p>
                    {achievement.description}
                  </p>
                )}

                {achievement.link && (
                  <a
                    href={achievement.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Achievement
                  </a>
                )}

              </div>
            ))}

          </div>
        )}

      </section>


      {/* =====================================
          SOCIAL LINKS
      ===================================== */}

      <section className="portfolio-section">

        <h2>Social Links</h2>

        {socialLinks.length === 0 &&
        !profile?.github &&
        !profile?.linkedin &&
        !profile?.portfolio ? (
          <p>No social links added yet.</p>
        ) : (
          <div className="social-links">

            {/* Profile GitHub */}
            {profile?.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            )}

            {/* Profile LinkedIn */}
            {profile?.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            )}

            {/* Profile Portfolio */}
            {profile?.portfolio && (
              <a
                href={profile.portfolio}
                target="_blank"
                rel="noopener noreferrer"
              >
                Portfolio
              </a>
            )}

            {/* Additional Social Links */}
            {socialLinks.map((socialLink) => (
              socialLink.url && (
                <a
                  key={socialLink._id}
                  href={socialLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {socialLink.platform}
                </a>
              )
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Portfolio;