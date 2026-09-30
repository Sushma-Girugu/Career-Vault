function ResumePreview({ resume }) {

  const hasEducation =
    resume.education &&
    resume.education.some(
      (item) =>
        item.institution ||
        item.degree ||
        item.year ||
        item.cgpa
    );

  const hasSkills =
    resume.skills &&
    resume.skills.some(
      (item) =>
        item.name ||
        item.level
    );

  const hasProjects =
    resume.projects &&
    resume.projects.some(
      (item) =>
        item.name ||
        item.description ||
        item.technologies
    );

  const hasExperience =
    resume.experience &&
    resume.experience.some(
      (item) =>
        item.role ||
        item.company ||
        item.duration ||
        item.description
    );

  const hasAchievements =
    resume.achievements &&
    resume.achievements.some(
      (item) =>
        item.title ||
        item.description
    );

  const hasCertifications =
    resume.certifications &&
    resume.certifications.some(
      (item) =>
        item.name ||
        item.issuer ||
        item.year
    );

  const hasSocialLinks =
    resume.personalInfo?.linkedin ||
    resume.personalInfo?.github;

  return (
    <div className="resume-preview">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="resume-header">

        <h1>
          {resume.personalInfo?.name ||
            "Your Name"}
        </h1>

        {resume.education?.[0]?.degree && (
          <p className="resume-degree">
            {resume.education[0].degree}
          </p>
        )}

        <div className="contact-info">

          {resume.personalInfo?.email && (
            <span>
              {resume.personalInfo.email}
            </span>
          )}

          {resume.personalInfo?.phone && (
            <span>
              {resume.personalInfo.phone}
            </span>
          )}

          {resume.personalInfo?.location && (
            <span>
              {resume.personalInfo.location}
            </span>
          )}

        </div>

        {hasSocialLinks && (
          <div className="social-links">

            {resume.personalInfo?.linkedin && (
              <a
                href={
                  resume.personalInfo.linkedin.startsWith(
                    "http"
                  )
                    ? resume.personalInfo.linkedin
                    : `https://${resume.personalInfo.linkedin}`
                }
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            )}

            {resume.personalInfo?.github && (
              <a
                href={
                  resume.personalInfo.github.startsWith(
                    "http"
                  )
                    ? resume.personalInfo.github
                    : `https://${resume.personalInfo.github}`
                }
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            )}

          </div>
        )}

      </div>


      {/* =====================================================
          EDUCATION
      ===================================================== */}

      {hasEducation && (
        <section className="resume-section">

          <h3>EDUCATION</h3>

          {resume.education.map(
            (item, index) => {

              if (
                !item.institution &&
                !item.degree &&
                !item.year &&
                !item.cgpa
              ) {
                return null;
              }

              return (
                <div
                  className="resume-entry"
                  key={index}
                >

                  {item.institution && (
                    <div className="entry-title">
                      {item.institution}
                    </div>
                  )}

                  {(item.degree ||
                    item.year) && (
                    <div className="entry-subtitle">

                      {item.degree}

                      {item.degree &&
                        item.year &&
                        " | "}

                      {item.year}

                    </div>
                  )}

                  {item.cgpa && (
                    <div className="entry-detail">
                      CGPA: {item.cgpa}
                    </div>
                  )}

                </div>
              );
            }
          )}

        </section>
      )}


      {/* =====================================================
          SKILLS
      ===================================================== */}

      {hasSkills && (
        <section className="resume-section">

          <h3>TECHNICAL SKILLS</h3>

          <div className="skills-list">

            {resume.skills.map(
              (item, index) => {

                if (
                  !item.name &&
                  !item.level
                ) {
                  return null;
                }

                return (
                  <span
                    className="skill-item"
                    key={index}
                  >
                    {item.name}

                    {item.level &&
                      ` (${item.level})`}
                  </span>
                );
              }
            )}

          </div>

        </section>
      )}


      {/* =====================================================
          PROJECTS
      ===================================================== */}

      {hasProjects && (
        <section className="resume-section">

          <h3>PROJECTS</h3>

          {resume.projects.map(
            (item, index) => {

              if (
                !item.name &&
                !item.description &&
                !item.technologies
              ) {
                return null;
              }

              return (
                <div
                  className="resume-entry project-entry"
                  key={index}
                >

                  {item.name && (
                    <div className="entry-title">
                      {item.name}
                    </div>
                  )}

                  {item.technologies && (
                    <div className="project-technologies">
                      {item.technologies}
                    </div>
                  )}

                  {item.description && (
                    <div className="entry-detail">
                      {item.description}
                    </div>
                  )}

                  {/* 
                    IMPORTANT:
                    Project links are intentionally NOT displayed.
                    No "View Project" button/link.
                  */}

                </div>
              );
            }
          )}

        </section>
      )}


      {/* =====================================================
          EXPERIENCE
      ===================================================== */}

      {hasExperience && (
        <section className="resume-section">

          <h3>EXPERIENCE</h3>

          {resume.experience.map(
            (item, index) => {

              if (
                !item.role &&
                !item.company &&
                !item.duration &&
                !item.description
              ) {
                return null;
              }

              return (
                <div
                  className="resume-entry"
                  key={index}
                >

                  {item.role && (
                    <div className="entry-title">
                      {item.role}
                    </div>
                  )}

                  {item.company && (
                    <div className="entry-subtitle">
                      {item.company}
                    </div>
                  )}

                  {item.duration && (
                    <div className="entry-detail">
                      {item.duration}
                    </div>
                  )}

                  {item.description && (
                    <div className="entry-detail">
                      {item.description}
                    </div>
                  )}

                </div>
              );
            }
          )}

        </section>
      )}


      {/* =====================================================
          ACHIEVEMENTS
      ===================================================== */}

      {hasAchievements && (
        <section className="resume-section">

          <h3>ACHIEVEMENTS</h3>

          {resume.achievements.map(
            (item, index) => {

              if (
                !item.title &&
                !item.description
              ) {
                return null;
              }

              return (
                <div
                  className="resume-entry"
                  key={index}
                >

                  {item.title && (
                    <div className="entry-title">
                      {item.title}
                    </div>
                  )}

                  {item.description && (
                    <div className="entry-detail">
                      {item.description}
                    </div>
                  )}

                </div>
              );
            }
          )}

        </section>
      )}


      {/* =====================================================
          CERTIFICATIONS
      ===================================================== */}

      {hasCertifications && (
        <section className="resume-section">

          <h3>CERTIFICATIONS</h3>

          {resume.certifications.map(
            (item, index) => {

              if (
                !item.name &&
                !item.issuer &&
                !item.year
              ) {
                return null;
              }

              return (
                <div
                  className="resume-entry"
                  key={index}
                >

                  {item.name && (
                    <div className="entry-title">
                      {item.name}
                    </div>
                  )}

                  {(item.issuer ||
                    item.year) && (
                    <div className="entry-subtitle">

                      {item.issuer}

                      {item.issuer &&
                        item.year &&
                        " | "}

                      {item.year}

                    </div>
                  )}

                </div>
              );
            }
          )}

        </section>
      )}

    </div>
  );
}

export default ResumePreview;