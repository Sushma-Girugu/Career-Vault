import { useEffect, useState } from "react";
import ResumePreview from "./ResumePreview";
import "./Resume.css";

function ResumeBuilder({ profile }) {
  const [resume, setResume] = useState({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: ""
    },

    education: [
      {
        institution: "",
        degree: "",
        year: "",
        cgpa: ""
      }
    ],

    skills: [
      {
        name: "",
        level: ""
      }
    ],

    projects: [
      {
        name: "",
        description: "",
        technologies: "",
        link: ""
      }
    ],

    experience: [
      {
        company: "",
        role: "",
        duration: "",
        description: ""
      }
    ],

    achievements: [
      {
        title: "",
        description: ""
      }
    ],

    certifications: [
      {
        name: "",
        issuer: "",
        year: ""
      }
    ]
  });

  // =====================================================
  // RESUME ID
  // =====================================================

  const [resumeId, setResumeId] = useState(null);

  // =====================================================
  // LOAD PROFILE INTO RESUME
  // =====================================================

  useEffect(() => {
    if (!profile) {
      return;
    }

    setResume((previous) => ({
      ...previous,

      personalInfo: {
        ...previous.personalInfo,
        name: profile.name || "",
        email: profile.email || ""
      },

      education: [
        {
          ...previous.education[0],
          institution: profile.college || "",
          degree: profile.branch || "",
          year: profile.year || ""
        },
        ...previous.education.slice(1)
      ]
    }));
  }, [profile]);

  // =====================================================
  // LOAD SKILLS
  // =====================================================

  useEffect(() => {
    fetch("http://localhost:5000/api/skills")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load skills");
        }

        return response.json();
      })
      .then((data) => {
        setResume((previous) => ({
          ...previous,

          skills:
            data.length > 0
              ? data.map((skill) => ({
                  name: skill.name || "",
                  level: skill.level || ""
                }))
              : [
                  {
                    name: "",
                    level: ""
                  }
                ]
        }));
      })
      .catch((error) => {
        console.error("Error loading skills:", error);
      });
  }, []);

  // =====================================================
  // LOAD PROJECTS
  // =====================================================

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load projects");
        }

        return response.json();
      })
      .then((data) => {
        setResume((previous) => ({
          ...previous,

          projects:
            data.length > 0
              ? data.map((project) => ({
                  name: project.name || "",
                  description: project.description || "",

                  technologies: Array.isArray(project.technologies)
                    ? project.technologies.join(", ")
                    : project.technologies || "",

                  link:
                    project.githubUrl ||
                    project.demoUrl ||
                    ""
                }))
              : [
                  {
                    name: "",
                    description: "",
                    technologies: "",
                    link: ""
                  }
                ]
        }));
      })
      .catch((error) => {
        console.error("Error loading projects:", error);
      });
  }, []);

  // =====================================================
  // LOAD SAVED RESUME
  // =====================================================

  useEffect(() => {
    fetch("http://localhost:5000/api/resumes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load resumes");
        }

        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          const savedResume = data[0];

          setResumeId(savedResume._id);

          setResume({
            personalInfo: {
              name: savedResume.personalInfo?.name || "",
              email: savedResume.personalInfo?.email || "",
              phone: savedResume.personalInfo?.phone || "",
              location: savedResume.personalInfo?.location || "",
              linkedin: savedResume.personalInfo?.linkedin || "",
              github: savedResume.personalInfo?.github || ""
            },

            education:
              savedResume.education?.length > 0
                ? savedResume.education
                : [
                    {
                      institution: "",
                      degree: "",
                      year: "",
                      cgpa: ""
                    }
                  ],

            skills:
              savedResume.skills?.length > 0
                ? savedResume.skills
                : [
                    {
                      name: "",
                      level: ""
                    }
                  ],

            projects:
              savedResume.projects?.length > 0
                ? savedResume.projects
                : [
                    {
                      name: "",
                      description: "",
                      technologies: "",
                      link: ""
                    }
                  ],

            experience:
              savedResume.experience?.length > 0
                ? savedResume.experience
                : [
                    {
                      company: "",
                      role: "",
                      duration: "",
                      description: ""
                    }
                  ],

            achievements:
              savedResume.achievements?.length > 0
                ? savedResume.achievements
                : [
                    {
                      title: "",
                      description: ""
                    }
                  ],

            certifications:
              savedResume.certifications?.length > 0
                ? savedResume.certifications
                : [
                    {
                      name: "",
                      issuer: "",
                      year: ""
                    }
                  ]
          });
        }
      })
      .catch((error) => {
        console.error("Error loading saved resume:", error);
      });
  }, []);

  // =====================================================
  // SAVE RESUME
  // =====================================================

  const saveResume = async () => {
    try {
      const url = resumeId
        ? `http://localhost:5000/api/resumes/${resumeId}`
        : "http://localhost:5000/api/resumes";

      const method = resumeId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(resume)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Save resume error:", data);
        alert(data.message || "Failed to save resume");
        return;
      }

      if (resumeId) {
        alert("Resume updated successfully!");
      } else {
        alert("Resume saved successfully!");

        if (data.resume?._id) {
          setResumeId(data.resume._id);
        }
      }

      console.log("Resume saved:", data);
    } catch (error) {
      console.error("Resume save error:", error);
      alert("Server connection failed");
    }
  };

  // =====================================================
  // PERSONAL INFORMATION CHANGE
  // =====================================================

  const handlePersonalChange = (e) => {
    setResume({
      ...resume,

      personalInfo: {
        ...resume.personalInfo,
        [e.target.name]: e.target.value
      }
    });
  };

  // =====================================================
  // ARRAY SECTION CHANGE
  // =====================================================

  const handleArrayChange = (section, index, e) => {
    const updated = [...resume[section]];

    updated[index] = {
      ...updated[index],
      [e.target.name]: e.target.value
    };

    setResume({
      ...resume,
      [section]: updated
    });
  };

  // =====================================================
  // ADD NEW ITEM
  // =====================================================

  const addItem = (section, item) => {
    setResume({
      ...resume,

      [section]: [
        ...resume[section],
        item
      ]
    });
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="resume-builder">

      {/* =================================================
          RESUME FORM
      ================================================= */}

      <div className="resume-form">

        <h1>Resume Builder</h1>

        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <h2>Personal Information</h2>

        <input
          name="name"
          placeholder="Full Name"
          value={resume.personalInfo.name}
          onChange={handlePersonalChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={resume.personalInfo.email}
          onChange={handlePersonalChange}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={resume.personalInfo.phone}
          onChange={handlePersonalChange}
        />

        <input
          name="location"
          placeholder="Location"
          value={resume.personalInfo.location}
          onChange={handlePersonalChange}
        />

        <input
          name="linkedin"
          placeholder="LinkedIn"
          value={resume.personalInfo.linkedin}
          onChange={handlePersonalChange}
        />

        <input
          name="github"
          placeholder="GitHub"
          value={resume.personalInfo.github}
          onChange={handlePersonalChange}
        />

        {/* =================================================
            EDUCATION
        ================================================= */}

        <h2>Education</h2>

        {resume.education.map((item, index) => (
          <div
            className="section-box"
            key={index}
          >

            <input
              name="institution"
              placeholder="Institution"
              value={item.institution}
              onChange={(e) =>
                handleArrayChange(
                  "education",
                  index,
                  e
                )
              }
            />

            <input
              name="degree"
              placeholder="Degree"
              value={item.degree}
              onChange={(e) =>
                handleArrayChange(
                  "education",
                  index,
                  e
                )
              }
            />

            <input
              name="year"
              placeholder="Year"
              value={item.year}
              onChange={(e) =>
                handleArrayChange(
                  "education",
                  index,
                  e
                )
              }
            />

            <input
              name="cgpa"
              placeholder="CGPA"
              value={item.cgpa}
              onChange={(e) =>
                handleArrayChange(
                  "education",
                  index,
                  e
                )
              }
            />

          </div>
        ))}

        <button
          onClick={() =>
            addItem("education", {
              institution: "",
              degree: "",
              year: "",
              cgpa: ""
            })
          }
        >
          Add Education
        </button>

        {/* =================================================
            SKILLS
        ================================================= */}

        <h2>Skills</h2>

        {resume.skills.map((item, index) => (
          <div
            className="section-box"
            key={index}
          >

            <input
              name="name"
              placeholder="Skill"
              value={item.name}
              onChange={(e) =>
                handleArrayChange(
                  "skills",
                  index,
                  e
                )
              }
            />

            <select
              name="level"
              value={item.level}
              onChange={(e) =>
                handleArrayChange(
                  "skills",
                  index,
                  e
                )
              }
            >
              <option value="">
                Select Level
              </option>

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

          </div>
        ))}

        <button
          onClick={() =>
            addItem("skills", {
              name: "",
              level: ""
            })
          }
        >
          Add Skill
        </button>

        {/* =================================================
            PROJECTS
        ================================================= */}

        <h2>Projects</h2>

        {resume.projects.map((item, index) => (
          <div
            className="section-box"
            key={index}
          >

            <input
              name="name"
              placeholder="Project Name"
              value={item.name}
              onChange={(e) =>
                handleArrayChange(
                  "projects",
                  index,
                  e
                )
              }
            />

            <textarea
              name="description"
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                handleArrayChange(
                  "projects",
                  index,
                  e
                )
              }
            />

            <input
              name="technologies"
              placeholder="Technologies"
              value={item.technologies}
              onChange={(e) =>
                handleArrayChange(
                  "projects",
                  index,
                  e
                )
              }
            />

            <input
              name="link"
              placeholder="Project Link"
              value={item.link}
              onChange={(e) =>
                handleArrayChange(
                  "projects",
                  index,
                  e
                )
              }
            />

          </div>
        ))}

        <button
          onClick={() =>
            addItem("projects", {
              name: "",
              description: "",
              technologies: "",
              link: ""
            })
          }
        >
          Add Project
        </button>

        {/* =================================================
            EXPERIENCE
        ================================================= */}

        <h2>Experience</h2>

        {resume.experience.map((item, index) => (
          <div
            className="section-box"
            key={index}
          >

            <input
              name="company"
              placeholder="Company"
              value={item.company}
              onChange={(e) =>
                handleArrayChange(
                  "experience",
                  index,
                  e
                )
              }
            />

            <input
              name="role"
              placeholder="Role"
              value={item.role}
              onChange={(e) =>
                handleArrayChange(
                  "experience",
                  index,
                  e
                )
              }
            />

            <input
              name="duration"
              placeholder="Duration"
              value={item.duration}
              onChange={(e) =>
                handleArrayChange(
                  "experience",
                  index,
                  e
                )
              }
            />

            <textarea
              name="description"
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                handleArrayChange(
                  "experience",
                  index,
                  e
                )
              }
            />

          </div>
        ))}

        <button
          onClick={() =>
            addItem("experience", {
              company: "",
              role: "",
              duration: "",
              description: ""
            })
          }
        >
          Add Experience
        </button>

        {/* =================================================
            ACHIEVEMENTS
        ================================================= */}

        <h2>Achievements</h2>

        {resume.achievements.map((item, index) => (
          <div
            className="section-box"
            key={index}
          >

            <input
              name="title"
              placeholder="Achievement"
              value={item.title}
              onChange={(e) =>
                handleArrayChange(
                  "achievements",
                  index,
                  e
                )
              }
            />

            <textarea
              name="description"
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                handleArrayChange(
                  "achievements",
                  index,
                  e
                )
              }
            />

          </div>
        ))}

        <button
          onClick={() =>
            addItem("achievements", {
              title: "",
              description: ""
            })
          }
        >
          Add Achievement
        </button>

        {/* =================================================
            CERTIFICATIONS
        ================================================= */}

        <h2>Certifications</h2>

        {resume.certifications.map((item, index) => (
          <div
            className="section-box"
            key={index}
          >

            <input
              name="name"
              placeholder="Certification Name"
              value={item.name}
              onChange={(e) =>
                handleArrayChange(
                  "certifications",
                  index,
                  e
                )
              }
            />

            <input
              name="issuer"
              placeholder="Issuer"
              value={item.issuer}
              onChange={(e) =>
                handleArrayChange(
                  "certifications",
                  index,
                  e
                )
              }
            />

            <input
              name="year"
              placeholder="Year"
              value={item.year}
              onChange={(e) =>
                handleArrayChange(
                  "certifications",
                  index,
                  e
                )
              }
            />

          </div>
        ))}

        <button
          onClick={() =>
            addItem("certifications", {
              name: "",
              issuer: "",
              year: ""
            })
          }
        >
          Add Certification
        </button>

        {/* =================================================
            SAVE RESUME
        ================================================= */}

        <button
          onClick={saveResume}
          className="save-resume-button"
        >
          {resumeId ? "Update Resume" : "Save Resume"}
        </button>

      </div>

      {/* =================================================
          RESUME PREVIEW
      ================================================= */}

      <ResumePreview resume={resume} />

    </div>
  );
}

export default ResumeBuilder;