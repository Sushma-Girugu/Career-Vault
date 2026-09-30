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

    skills: [],

    projects: [],

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

  const [resumeId, setResumeId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  // =====================================================
  // GET AUTH TOKEN
  // =====================================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("jwt")
    );
  };


  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    if (!profile) {
      return;
    }

    setResume((previous) => ({
      ...previous,

      personalInfo: {
        ...previous.personalInfo,

        name:
          profile.name ||
          profile.fullName ||
          "",

        email:
          profile.email ||
          "",

        phone:
          profile.phone ||
          "",

        location:
          profile.location ||
          "",

        linkedin:
          profile.linkedin ||
          profile.linkedIn ||
          "",

        github:
          profile.github ||
          profile.gitHub ||
          ""
      },

      education: [
        {
          ...previous.education[0],

          institution:
            profile.college ||
            profile.collegeUniversity ||
            "",

          degree:
            profile.branch ||
            profile.course ||
            "",

          year:
            profile.year ||
            profile.graduationYear ||
            "",

          cgpa:
            profile.cgpa ||
            ""
        },

        ...previous.education.slice(1)
      ]
    }));
  }, [profile]);


  // =====================================================
  // LOAD SKILLS FROM SKILLS MODULE
  // =====================================================

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const token = getToken();

        if (!token) {
          console.warn(
            "No authentication token found."
          );
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/skills",
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Failed to load skills"
          );
        }

        let skillsData = [];

        if (Array.isArray(data)) {
          skillsData = data;
        } else if (
          Array.isArray(data.skills)
        ) {
          skillsData = data.skills;
        } else if (
          Array.isArray(data.data)
        ) {
          skillsData = data.data;
        }

        const formattedSkills =
          skillsData.map((skill) => ({
            name:
              skill.name ||
              skill.skillName ||
              skill.title ||
              "",

            level:
              skill.level ||
              skill.skillLevel ||
              ""
          }));

        console.log(
          "Skills loaded for Resume:",
          formattedSkills
        );

        setResume((previous) => ({
          ...previous,
          skills: formattedSkills
        }));

      } catch (error) {
        console.error(
          "Error loading skills for resume:",
          error
        );
      }
    };

    loadSkills();
  }, []);


  // =====================================================
  // LOAD PROJECTS FROM PROJECTS MODULE
  // =====================================================

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const token = getToken();

        if (!token) {
          console.warn(
            "No authentication token found."
          );
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/projects",
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Failed to load projects"
          );
        }

        console.log(
          "Projects API response:",
          data
        );

        let projectsData = [];

        if (Array.isArray(data)) {
          projectsData = data;
        } else if (
          Array.isArray(data.projects)
        ) {
          projectsData = data.projects;
        } else if (
          Array.isArray(data.data)
        ) {
          projectsData = data.data;
        }

        const formattedProjects =
          projectsData.map((project) => ({
            name:
              project.name ||
              project.title ||
              "",

            description:
              project.description ||
              "",

            technologies:
              Array.isArray(
                project.technologies
              )
                ? project.technologies.join(", ")
                : project.technologies ||
                  ""
          }));

        console.log(
          "Projects loaded for Resume:",
          formattedProjects
        );

        setResume((previous) => ({
          ...previous,

          projects:
            formattedProjects
        }));

      } catch (error) {
        console.error(
          "Error loading projects for resume:",
          error
        );
      }
    };

    loadProjects();
  }, []);


  // =====================================================
  // LOAD SAVED RESUME
  // =====================================================

  useEffect(() => {
    const loadSavedResume = async () => {
      try {
        const token = getToken();

        if (!token) {
          console.warn(
            "No authentication token found."
          );
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/resumes",
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        console.log(
          "Saved resume response:",
          data
        );

        let savedResume = null;

        if (Array.isArray(data)) {
          savedResume = data[0];

        } else if (
          Array.isArray(data.resumes)
        ) {
          savedResume = data.resumes[0];

        } else if (data.resume) {
          savedResume = data.resume;

        } else if (data.data) {
          savedResume =
            Array.isArray(data.data)
              ? data.data[0]
              : data.data;
        }

        if (!savedResume) {
          return;
        }

        setResumeId(savedResume._id);

        setResume((previous) => ({
          ...previous,

          // =================================================
          // PERSONAL INFORMATION
          // =================================================

          personalInfo: {
            name:
              profile?.name ||
              profile?.fullName ||
              savedResume.personalInfo?.name ||
              "",

            email:
              profile?.email ||
              savedResume.personalInfo?.email ||
              "",

            phone:
              profile?.phone ||
              savedResume.personalInfo?.phone ||
              "",

            location:
              profile?.location ||
              savedResume.personalInfo?.location ||
              "",

            linkedin:
              profile?.linkedin ||
              profile?.linkedIn ||
              savedResume.personalInfo?.linkedin ||
              "",

            github:
              profile?.github ||
              profile?.gitHub ||
              savedResume.personalInfo?.github ||
              ""
          },


          // =================================================
          // EDUCATION
          // =================================================

          education:
            savedResume.education?.length > 0
              ? savedResume.education
              : previous.education,


          // =================================================
          // IMPORTANT
          // =================================================
          // Skills DO NOT come from saved resume.
          // Skills always come from Skills module.

          skills:
            previous.skills,


          // =================================================
          // IMPORTANT
          // =================================================
          // Projects DO NOT come from saved resume.
          // Projects always come from Projects module.

          projects:
            previous.projects,


          // =================================================
          // EXPERIENCE
          // =================================================

          experience:
            savedResume.experience?.length > 0
              ? savedResume.experience
              : previous.experience,


          // =================================================
          // ACHIEVEMENTS
          // =================================================

          achievements:
            savedResume.achievements?.length > 0
              ? savedResume.achievements
              : previous.achievements,


          // =================================================
          // CERTIFICATIONS
          // =================================================

          certifications:
            savedResume.certifications?.length > 0
              ? savedResume.certifications
              : previous.certifications
        }));

      } catch (error) {
        console.error(
          "Error loading saved resume:",
          error
        );
      }
    };

    loadSavedResume();

  }, [profile]);


  // =====================================================
  // SAVE / UPDATE RESUME
  // =====================================================

  const saveResume = async () => {
    try {
      setMessage("");
      setError("");

      const token = getToken();

      if (!token) {
        setError(
          "Please login again before saving your resume."
        );
        return;
      }

      if (
        !resume.personalInfo.name ||
        !resume.personalInfo.name.trim()
      ) {
        setError(
          "Please enter your full name."
        );
        return;
      }

      const url = resumeId
        ? `http://localhost:5000/api/resumes/${resumeId}`
        : "http://localhost:5000/api/resumes";

      const method =
        resumeId ? "PUT" : "POST";

      const response = await fetch(
        url,
        {
          method,

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(resume)
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(
          "Save resume error:",
          data
        );

        setError(
          data.message ||
          "Failed to save resume"
        );

        return;
      }

      if (data.resume?._id) {
        setResumeId(
          data.resume._id
        );
      } else if (data._id) {
        setResumeId(
          data._id
        );
      }

      setMessage(
        resumeId
          ? "Resume updated successfully!"
          : "Resume saved successfully!"
      );

    } catch (error) {

      console.error(
        "Resume save error:",
        error
      );

      setError(
        "Server connection failed"
      );
    }
  };


  // =====================================================
  // DOWNLOAD RESUME PDF
  // =====================================================

  const downloadPDF = () => {

    const resumeElement =
      document.querySelector(
        ".resume-preview"
      );

    if (!resumeElement) {
      setError(
        "Resume preview not found."
      );
      return;
    }

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=900,height=1200"
      );

    if (!printWindow) {
      setError(
        "Please allow pop-ups for this website."
      );
      return;
    }

    const resumeClone =
      resumeElement.cloneNode(true);

    let styles = "";

    for (
      const sheet of document.styleSheets
    ) {
      try {

        if (sheet.cssRules) {

          for (
            const rule of sheet.cssRules
          ) {
            styles += rule.cssText;
          }

        }

      } catch (error) {

        console.warn(
          "Could not read stylesheet:",
          error
        );

      }
    }

    printWindow.document.open();

    printWindow.document.write(`
      <!DOCTYPE html>

      <html>

        <head>

          <title>Resume</title>

          <style>

            ${styles}

            * {
              box-sizing: border-box;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              background: white;
            }

            body {
              display: flex;
              justify-content: center;
            }

            .resume-preview {
              width: 210mm !important;
              min-height: 297mm !important;
              margin: 0 !important;
              padding: 15mm !important;
              background: white !important;
              border: none !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              box-sizing: border-box !important;
            }

            @page {
              size: A4;
              margin: 0;
            }

            @media print {

              html,
              body {
                width: 210mm;
                min-height: 297mm;
                margin: 0;
                padding: 0;
              }

              .resume-preview {
                width: 210mm !important;
                min-height: 297mm !important;
              }

            }

          </style>

        </head>

        <body>

          ${resumeClone.outerHTML}

          <script>

            window.onload = function () {

              setTimeout(
                function () {
                  window.print();
                },
                500
              );

            };

            window.onafterprint = function () {
              window.close();
            };

          <\/script>

        </body>

      </html>
    `);

    printWindow.document.close();
  };


  // =====================================================
  // PERSONAL INFORMATION CHANGE
  // =====================================================

  const handlePersonalChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setResume((previous) => ({
      ...previous,

      personalInfo: {
        ...previous.personalInfo,
        [name]: value
      }
    }));

  };


  // =====================================================
  // ARRAY SECTION CHANGE
  // =====================================================

  const handleArrayChange = (
    section,
    index,
    e
  ) => {

    const updated = [
      ...resume[section]
    ];

    updated[index] = {
      ...updated[index],
      [e.target.name]:
        e.target.value
    };

    setResume((previous) => ({
      ...previous,
      [section]: updated
    }));

  };


  // =====================================================
  // ADD ITEM
  // =====================================================

  const addItem = (
    section,
    item
  ) => {

    setResume((previous) => ({
      ...previous,

      [section]: [
        ...previous[section],
        item
      ]
    }));

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

        <h1>
          Resume Builder
        </h1>


        {/* =================================================
            SUCCESS / ERROR MESSAGE
        ================================================= */}

        {message && (
          <div className="resume-success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="resume-error-message">
            {error}
          </div>
        )}


        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <h2>
          Personal Information
        </h2>

        <input
          name="name"
          placeholder="Full Name"
          value={
            resume.personalInfo.name
          }
          onChange={
            handlePersonalChange
          }
        />

        <input
          name="email"
          placeholder="Email"
          value={
            resume.personalInfo.email
          }
          onChange={
            handlePersonalChange
          }
        />

        <input
          name="phone"
          placeholder="Phone"
          value={
            resume.personalInfo.phone
          }
          onChange={
            handlePersonalChange
          }
        />

        <input
          name="location"
          placeholder="Location"
          value={
            resume.personalInfo.location
          }
          onChange={
            handlePersonalChange
          }
        />

        <input
          name="linkedin"
          placeholder="LinkedIn"
          value={
            resume.personalInfo.linkedin
          }
          onChange={
            handlePersonalChange
          }
        />

        <input
          name="github"
          placeholder="GitHub"
          value={
            resume.personalInfo.github
          }
          onChange={
            handlePersonalChange
          }
        />


        {/* =================================================
            EDUCATION
        ================================================= */}

        <h2>
          Education
        </h2>

        {resume.education.map(
          (item, index) => (

            <div
              className="section-box"
              key={index}
            >

              <input
                name="institution"
                placeholder="Institution"
                value={
                  item.institution
                }
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
                value={
                  item.degree
                }
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
                value={
                  item.year
                }
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
                value={
                  item.cgpa
                }
                onChange={(e) =>
                  handleArrayChange(
                    "education",
                    index,
                    e
                  )
                }
              />

            </div>

          )
        )}

        <button
          onClick={() =>
            addItem(
              "education",
              {
                institution: "",
                degree: "",
                year: "",
                cgpa: ""
              }
            )
          }
        >
          Add Education
        </button>


        {/* =================================================
            SKILLS
        ================================================= */}

        <h2>
          Skills
        </h2>

        {resume.skills.length === 0 ? (

          <p>
            No skills added yet.
          </p>

        ) : (

          resume.skills.map(
            (item, index) => (

              <div
                className="section-box"
                key={index}
              >

                <input
                  name="name"
                  placeholder="Skill"
                  value={
                    item.name
                  }
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
                  value={
                    item.level
                  }
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

            )
          )

        )}

        <button
          onClick={() =>
            addItem(
              "skills",
              {
                name: "",
                level: ""
              }
            )
          }
        >
          Add Skill
        </button>


        {/* =================================================
            PROJECTS
        ================================================= */}

        <h2>
          Projects
        </h2>

        {resume.projects.length === 0 ? (

          <p>
            No projects added yet.
          </p>

        ) : (

          resume.projects.map(
            (item, index) => (

              <div
                className="section-box"
                key={index}
              >

                <input
                  name="name"
                  placeholder="Project Name"
                  value={
                    item.name
                  }
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
                  value={
                    item.description
                  }
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
                  value={
                    item.technologies
                  }
                  onChange={(e) =>
                    handleArrayChange(
                      "projects",
                      index,
                      e
                    )
                  }
                />

              </div>

            )
          )

        )}

        <button
          onClick={() =>
            addItem(
              "projects",
              {
                name: "",
                description: "",
                technologies: ""
              }
            )
          }
        >
          Add Project
        </button>


        {/* =================================================
            EXPERIENCE
        ================================================= */}

        <h2>
          Experience
        </h2>

        {resume.experience.map(
          (item, index) => (

            <div
              className="section-box"
              key={index}
            >

              <input
                name="company"
                placeholder="Company"
                value={
                  item.company
                }
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
                value={
                  item.role
                }
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
                value={
                  item.duration
                }
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
                value={
                  item.description
                }
                onChange={(e) =>
                  handleArrayChange(
                    "experience",
                    index,
                    e
                  )
                }
              />

            </div>

          )
        )}

        <button
          onClick={() =>
            addItem(
              "experience",
              {
                company: "",
                role: "",
                duration: "",
                description: ""
              }
            )
          }
        >
          Add Experience
        </button>


        {/* =================================================
            ACHIEVEMENTS
        ================================================= */}

        <h2>
          Achievements
        </h2>

        {resume.achievements.map(
          (item, index) => (

            <div
              className="section-box"
              key={index}
            >

              <input
                name="title"
                placeholder="Achievement"
                value={
                  item.title
                }
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
                value={
                  item.description
                }
                onChange={(e) =>
                  handleArrayChange(
                    "achievements",
                    index,
                    e
                  )
                }
              />

            </div>

          )
        )}

        <button
          onClick={() =>
            addItem(
              "achievements",
              {
                title: "",
                description: ""
              }
            )
          }
        >
          Add Achievement
        </button>


        {/* =================================================
            CERTIFICATIONS
        ================================================= */}

        <h2>
          Certifications
        </h2>

        {resume.certifications.map(
          (item, index) => (

            <div
              className="section-box"
              key={index}
            >

              <input
                name="name"
                placeholder="Certification Name"
                value={
                  item.name
                }
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
                value={
                  item.issuer
                }
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
                value={
                  item.year
                }
                onChange={(e) =>
                  handleArrayChange(
                    "certifications",
                    index,
                    e
                  )
                }
              />

            </div>

          )
        )}

        <button
          onClick={() =>
            addItem(
              "certifications",
              {
                name: "",
                issuer: "",
                year: ""
              }
            )
          }
        >
          Add Certification
        </button>


        {/* =================================================
            SAVE
        ================================================= */}

        <button
          onClick={saveResume}
          className="save-resume-button"
        >
          {resumeId
            ? "Update Resume"
            : "Save Resume"}
        </button>


        {/* =================================================
            DOWNLOAD
        ================================================= */}

        <button
          onClick={downloadPDF}
          className="download-resume-button"
        >
          Download Resume PDF
        </button>

      </div>


      {/* =================================================
          RESUME PREVIEW
      ================================================= */}

      <ResumePreview
        resume={resume}
      />

    </div>
  );
}

export default ResumeBuilder;