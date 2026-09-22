import { useState } from "react";
import ResumePreview from "./ResumePreview";
import "./Resume.css";

function ResumeBuilder() {
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

  const handlePersonalChange = (e) => {
    setResume({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [e.target.name]: e.target.value
      }
    });
  };

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

  const addItem = (section, item) => {
    setResume({
      ...resume,
      [section]: [...resume[section], item]
    });
  };

  return (
    <div className="resume-builder">
      <div className="resume-form">
        <h1>Resume Builder</h1>

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

        <h2>Education</h2>

        {resume.education.map((item, index) => (
          <div className="section-box" key={index}>
            <input
              name="institution"
              placeholder="Institution"
              value={item.institution}
              onChange={(e) =>
                handleArrayChange("education", index, e)
              }
            />

            <input
              name="degree"
              placeholder="Degree"
              value={item.degree}
              onChange={(e) =>
                handleArrayChange("education", index, e)
              }
            />

            <input
              name="year"
              placeholder="Year"
              value={item.year}
              onChange={(e) =>
                handleArrayChange("education", index, e)
              }
            />

            <input
              name="cgpa"
              placeholder="CGPA"
              value={item.cgpa}
              onChange={(e) =>
                handleArrayChange("education", index, e)
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

        <h2>Skills</h2>

        {resume.skills.map((item, index) => (
          <div className="section-box" key={index}>
            <input
              name="name"
              placeholder="Skill"
              value={item.name}
              onChange={(e) =>
                handleArrayChange("skills", index, e)
              }
            />

            <select
              name="level"
              value={item.level}
              onChange={(e) =>
                handleArrayChange("skills", index, e)
              }
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
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

        <h2>Projects</h2>

        {resume.projects.map((item, index) => (
          <div className="section-box" key={index}>
            <input
              name="name"
              placeholder="Project Name"
              value={item.name}
              onChange={(e) =>
                handleArrayChange("projects", index, e)
              }
            />

            <textarea
              name="description"
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                handleArrayChange("projects", index, e)
              }
            />

            <input
              name="technologies"
              placeholder="Technologies"
              value={item.technologies}
              onChange={(e) =>
                handleArrayChange("projects", index, e)
              }
            />

            <input
              name="link"
              placeholder="Project Link"
              value={item.link}
              onChange={(e) =>
                handleArrayChange("projects", index, e)
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

        <h2>Experience</h2>

        {resume.experience.map((item, index) => (
          <div className="section-box" key={index}>
            <input
              name="company"
              placeholder="Company"
              value={item.company}
              onChange={(e) =>
                handleArrayChange("experience", index, e)
              }
            />

            <input
              name="role"
              placeholder="Role"
              value={item.role}
              onChange={(e) =>
                handleArrayChange("experience", index, e)
              }
            />

            <input
              name="duration"
              placeholder="Duration"
              value={item.duration}
              onChange={(e) =>
                handleArrayChange("experience", index, e)
              }
            />

            <textarea
              name="description"
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                handleArrayChange("experience", index, e)
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

        <h2>Achievements</h2>

        {resume.achievements.map((item, index) => (
          <div className="section-box" key={index}>
            <input
              name="title"
              placeholder="Achievement"
              value={item.title}
              onChange={(e) =>
                handleArrayChange("achievements", index, e)
              }
            />

            <textarea
              name="description"
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                handleArrayChange("achievements", index, e)
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

        <h2>Certifications</h2>

        {resume.certifications.map((item, index) => (
          <div className="section-box" key={index}>
            <input
              name="name"
              placeholder="Certification Name"
              value={item.name}
              onChange={(e) =>
                handleArrayChange("certifications", index, e)
              }
            />

            <input
              name="issuer"
              placeholder="Issuer"
              value={item.issuer}
              onChange={(e) =>
                handleArrayChange("certifications", index, e)
              }
            />

            <input
              name="year"
              placeholder="Year"
              value={item.year}
              onChange={(e) =>
                handleArrayChange("certifications", index, e)
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
      </div>

      <ResumePreview resume={resume} />
    </div>
  );
}

export default ResumeBuilder;