import React, { useEffect, useState } from "react";
import "./Portfolio.css";

const PROFILE_API = "http://localhost:5000/api/profile";
const SKILLS_API = "http://localhost:5000/api/skills";
const PROJECTS_API = "http://localhost:5000/api/projects";
const ACHIEVEMENTS_API = "http://localhost:5000/api/achievements";
const SOCIAL_LINKS_API = "http://localhost:5000/api/social-links";

function Portfolio() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const profileResponse = await fetch(PROFILE_API);
      const profileData = await profileResponse.json();

      if (profileResponse.ok) {
        if (Array.isArray(profileData)) {
          setProfile(profileData[profileData.length - 1]);
        } else {
          setProfile(profileData);
        }
      }

      const skillsResponse = await fetch(SKILLS_API);
      const skillsData = await skillsResponse.json();

      if (skillsResponse.ok) {
        setSkills(skillsData);
      }

      const projectsResponse = await fetch(PROJECTS_API);
      const projectsData = await projectsResponse.json();

      if (projectsResponse.ok) {
        setProjects(projectsData);
      }

      const achievementsResponse = await fetch(
        ACHIEVEMENTS_API
      );
      const achievementsData =
        await achievementsResponse.json();

      if (achievementsResponse.ok) {
        setAchievements(achievementsData);
      }

      const socialLinksResponse = await fetch(
        SOCIAL_LINKS_API
      );
      const socialLinksData =
        await socialLinksResponse.json();

      if (socialLinksResponse.ok) {
        setSocialLinks(socialLinksData);
      }
    } catch (error) {
      console.error(
        "Portfolio loading error:",
        error
      );
    }
  };

  return (
    <div className="portfolio-container">

      <section className="portfolio-hero">
        <h1>
          {profile?.name || "My Portfolio"}
        </h1>

        <p>
          {profile?.branch ||
            "Computer Science Student"}
        </p>

        {profile?.college && (
          <p>{profile.college}</p>
        )}

        {profile?.email && (
          <p>{profile.email}</p>
        )}
      </section>

      <section className="portfolio-section">
        <h2>About Me</h2>

        {profile ? (
          <div className="profile-details">

            <p>
              <strong>Name:</strong>{" "}
              {profile.name || "Not available"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {profile.email || "Not available"}
            </p>

            <p>
              <strong>College:</strong>{" "}
              {profile.college || "Not available"}
            </p>

            <p>
              <strong>Branch:</strong>{" "}
              {profile.branch || "Not available"}
            </p>

            <p>
              <strong>Year:</strong>{" "}
              {profile.year || "Not available"}
            </p>

          </div>
        ) : (
          <p>
            Profile information is not available.
          </p>
        )}
      </section>

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
                <h3>{skill.name}</h3>
                <p>{skill.level}</p>
              </div>
            ))}

          </div>
        )}
      </section>

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
                <h3>{project.name}</h3>

                <p>
                  {project.description}
                </p>

                <p>
                  <strong>
                    Technologies:
                  </strong>{" "}
                  {project.technologies}
                </p>

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
                <h3>{achievement.title}</h3>

                <p>
                  {achievement.description}
                </p>

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

      <section className="portfolio-section">
        <h2>Social Links</h2>

        {socialLinks.length === 0 ? (
          <p>No social links added yet.</p>
        ) : (
          <div className="social-links">

            {socialLinks.map((socialLink) => (
              <a
                key={socialLink._id}
                href={socialLink.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {socialLink.platform}
              </a>
            ))}

          </div>
        )}
      </section>

    </div>
  );
}

export default Portfolio;