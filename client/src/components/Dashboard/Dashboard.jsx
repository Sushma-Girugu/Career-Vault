import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard({ setPage }) {
    const [skillsCount, setSkillsCount] = useState(0);
    const [applicationsCount, setApplicationsCount] = useState(0);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // GET SKILLS
            const skillsResponse = await fetch(
                "http://localhost:5000/api/skills"
            );

            const skillsData = await skillsResponse.json();

            if (skillsResponse.ok) {
                setSkillsCount(skillsData.length);
            }

            // GET JOB APPLICATIONS
            const applicationsResponse = await fetch(
                "http://localhost:5000/api/job-applications"
            );

            const applicationsData =
                await applicationsResponse.json();

            if (applicationsResponse.ok) {
                setApplicationsCount(
                    applicationsData.length
                );
            }

            // GET PROFILE
            const profileResponse = await fetch(
                "http://localhost:5000/api/profile"
            );

            const profileData =
                await profileResponse.json();

            if (
                profileResponse.ok &&
                profileData.length > 0
            ) {
                setProfile(
                    profileData[profileData.length - 1]
                );
            }

        } catch (error) {
            console.log(
                "Dashboard data fetch error:",
                error
            );
        }
    };

    // PROFILE COMPLETION
    const isProfileComplete =
        profile &&
        profile.name &&
        profile.email &&
        profile.college &&
        profile.branch &&
        profile.year;

    return (
        <div className="dashboard">

            <h1>Welcome to CareerVault</h1>

            <p className="dashboard-subtitle">
                Manage your career journey in one place.
            </p>

            <div className="dashboard-cards">

                {/* PROFILE */}
                <div
                    className="dashboard-card"
                    onClick={() => setPage("profile")}
                >
                    <h3>Profile</h3>

                    <p>
                        {isProfileComplete
                            ? "Profile Complete"
                            : "Complete your profile"}
                    </p>
                </div>

                {/* SKILLS */}
                <div
                    className="dashboard-card"
                    onClick={() => setPage("skills")}
                >
                    <h3>Skills</h3>

                    <p>
                        {skillsCount} Skills
                    </p>
                </div>

                {/* PROJECTS */}
                <div
                    className="dashboard-card"
                    onClick={() => setPage("projects")}
                >
                    <h3>Projects</h3>

                    <p>
                        0 Projects
                    </p>
                </div>

                {/* APPLICATIONS */}
                <div
                    className="dashboard-card"
                    onClick={() => setPage("applications")}
                >
                    <h3>Applications</h3>

                    <p>
                        {applicationsCount} Applications
                    </p>
                </div>

                {/* RESUME */}
                <div
                    className="dashboard-card"
                    onClick={() => setPage("resume")}
                >
                    <h3>Resume</h3>

                    <p>
                        Build your resume
                    </p>
                </div>

                {/* JOB TESTS */}
                <div
                    className="dashboard-card"
                    onClick={() => setPage("jobtest")}
                >
                    <h3>Job Tests</h3>

                    <p>
                        Practice now
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;