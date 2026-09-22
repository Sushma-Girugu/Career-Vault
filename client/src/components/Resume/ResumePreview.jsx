function ResumePreview({ resume }) {
  return (
    <div className="resume-preview">
      <h1>Resume Preview</h1>

      <h2>{resume.personalInfo.name || "Your Name"}</h2>

      <p>{resume.personalInfo.email}</p>
      <p>{resume.personalInfo.phone}</p>
      <p>{resume.personalInfo.location}</p>

      <h3>Education</h3>
      {resume.education.map((item, index) => (
        <div key={index}>
          <strong>{item.institution}</strong>
          <p>{item.degree} | {item.year}</p>
          <p>CGPA: {item.cgpa}</p>
        </div>
      ))}

      <h3>Skills</h3>
      {resume.skills.map((item, index) => (
        <p key={index}>
          {item.name} - {item.level}
        </p>
      ))}

      <h3>Projects</h3>
      {resume.projects.map((item, index) => (
        <div key={index}>
          <strong>{item.name}</strong>
          <p>{item.description}</p>
          <p>{item.technologies}</p>
        </div>
      ))}

      <h3>Experience</h3>
      {resume.experience.map((item, index) => (
        <div key={index}>
          <strong>{item.role}</strong>
          <p>{item.company}</p>
          <p>{item.duration}</p>
          <p>{item.description}</p>
        </div>
      ))}

      <h3>Achievements</h3>
      {resume.achievements.map((item, index) => (
        <div key={index}>
          <strong>{item.title}</strong>
          <p>{item.description}</p>
        </div>
      ))}

      <h3>Certifications</h3>
      {resume.certifications.map((item, index) => (
        <div key={index}>
          <strong>{item.name}</strong>
          <p>{item.issuer} | {item.year}</p>
        </div>
      ))}
    </div>
  );
}

export default ResumePreview;