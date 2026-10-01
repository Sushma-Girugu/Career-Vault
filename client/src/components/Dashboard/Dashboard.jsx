import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard({ setPage }) {
    const [skillsCount, setSkillsCount] = useState(0);
    const [applicationsCount, setApplicationsCount] = useState(0);
    const [projectsCount, setProjectsCount] = useState(0);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.log("No authentication token found");
                return;
            }

            const authHeaders = {
                Authorization: `Bearer ${token}`
            };

            // ==========================================
            // GET SKILLS
            // ==========================================

            const skillsResponse = await fetch(
                "https://career-vault-1xyt.onrender.com/api/skills",
                {
                    headers: authHeaders
                }
            );

            if (skillsResponse.ok) {
                const skillsData = await skillsResponse.json();

                setSkillsCount(
                    Array.isArray(skillsData)
                        ? skillsData.length
                        : 0
                );
            }

            // ==========================================
            // GET JOB APPLICATIONS
            // ==========================================

            const applicationsResponse = await fetch(
                "https://career-vault-1xyt.onrender.com/api/job-applications",
                {
                    headers: authHeaders
                }
            );

            if (applicationsResponse.ok) {
                const applicationsData =
                    await applicationsResponse.json();

                setApplicationsCount(
                    Array.isArray(applicationsData)
                        ? applicationsData.length
                        : 0
                );
            }

            // ==========================================
            // GET PROJECTS
            // ==========================================

            const projectsResponse = await fetch(
                "https://career-vault-1xyt.onrender.com/api/projects",
                {
                    headers: authHeaders
                }
            );

            if (projectsResponse.ok) {
                const projectsData =
                    await projectsResponse.json();

                setProjectsCount(
                    Array.isArray(projectsData)
                        ? projectsData.length
                        : 0
                );
            }

            // ==========================================
            // GET PROFILE
            // ==========================================

            const profileResponse = await fetch(
                "https://career-vault-1xyt.onrender.com/api/profile",
                {
                    headers: authHeaders
                }
            );

            if (profileResponse.ok) {
                const profileData =
                    await profileResponse.json();

                /*
                 * Profile API may return either:
                 * 1. An array
                 * 2. A single profile object
                 */

                if (Array.isArray(profileData)) {
                    if (profileData.length > 0) {
                        setProfile(
                            profileData[profileData.length - 1]
                        );
                    } else {
                        setProfile(null);
                    }
                } else if (
                    profileData &&
                    typeof profileData === "object"
                ) {
                    setProfile(profileData);
                } else {
                    setProfile(null);
                }
            }

        } catch (error) {
            console.log(
                "Dashboard data fetch error:",
                error
            );
        }
    };

    // ==========================================
    // PROFILE COMPLETION
    // ==========================================

    const profileFields = [
        profile?.name,
        profile?.email,
        profile?.college,
        profile?.branch,
        profile?.year,
        profile?.phone
    ];

    const completedFields = profileFields.filter(
        (field) =>
            field !== undefined &&
            field !== null &&
            String(field).trim() !== ""
    ).length;

    const totalProfileFields = profileFields.length;

    const profileCompletion =
        totalProfileFields === 0
            ? 0
            : Math.round(
                  (completedFields / totalProfileFields) * 100
              );

    // ==========================================
    // PROFILE STATUS
    // ==========================================

    const isProfileComplete =
        profileCompletion === 100;

    // ==========================================
    // CIRCULAR PROGRESS
    // ==========================================

    const progressStyle = {
        background: `conic-gradient(
            #4f46e5 ${profileCompletion}%,
            #e5e7eb ${profileCompletion}%
        )`
    };

    return (
        <div className="dashboard">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>

                    <p className="dashboard-subtitle">
                        Welcome back! Here's your career overview.
                    </p>
                </div>
            </div>

            {/* ==========================================
                PROFILE PROGRESS SECTION
            ========================================== */}

            <div className="dashboard-progress-section">

                <div className="progress-content">

                    <p className="progress-label">
                        YOUR CAREER JOURNEY
                    </p>

                    <h2>
                        Build your future with CareerVault.
                    </h2>

                    <p>
                        Keep your profile, skills, projects,
                        applications and resume organized in one place.
                    </p>

                    <button
                        className="complete-profile-button"
                        onClick={() => setPage("profile")}
                    >
                        {isProfileComplete
                            ? "View Profile →"
                            : "Complete Profile →"}
                    </button>

                </div>

                {/* CIRCULAR PROGRESS */}

                <div
                    className="profile-progress-circle"
                    style={progressStyle}
                >
                    <div className="profile-progress-inner">

                        <strong>
                            {profileCompletion}%
                        </strong>

                        <span>
                            Profile
                        </span>

                    </div>
                </div>

            </div>

            {/* ==========================================
                CAREER OVERVIEW
            ========================================== */}

            <div className="career-overview">

                <h2>Career Overview</h2>

                <p>
                    Your current career progress
                </p>

            </div>

            {/* ==========================================
                DASHBOARD CARDS
            ========================================== */}

            <div className="dashboard-cards">

                {/* PROFILE */}

                <div
                    className="dashboard-card"
                    onClick={() => setPage("profile")}
                >
                    <div className="dashboard-card-icon">
                        ◉
                    </div>

                    <div>
                        <h3>Profile</h3>

                        <p className="dashboard-number">
                            {profileCompletion}%
                        </p>

                        <span>
                            Completion
                        </span>
                    </div>
                </div>

                {/* SKILLS */}

                <div
                    className="dashboard-card"
                    onClick={() => setPage("skills")}
                >
                    <div className="dashboard-card-icon">
                        ◆
                    </div>

                    <div>
                        <h3>Skills</h3>

                        <p className="dashboard-number">
                            {skillsCount}
                        </p>

                        <span>
                            Skills added
                        </span>
                    </div>
                </div>

                {/* PROJECTS */}

                <div
                    className="dashboard-card"
                    onClick={() => setPage("projects")}
                >
                    <div className="dashboard-card-icon">
                        ▣
                    </div>

                    <div>
                        <h3>Projects</h3>

                        <p className="dashboard-number">
                            {projectsCount}
                        </p>

                        <span>
                            Projects added
                        </span>
                    </div>
                </div>

                {/* APPLICATIONS */}

                <div
                    className="dashboard-card"
                    onClick={() =>
                        setPage("applications")
                    }
                >
                    <div className="dashboard-card-icon">
                        ▤
                    </div>

                    <div>
                        <h3>Applications</h3>

                        <p className="dashboard-number">
                            {applicationsCount}
                        </p>

                        <span>
                            Job applications
                        </span>
                    </div>
                </div>

            </div>

            {/* ==========================================
                LOWER DASHBOARD
            ========================================== */}

            <div className="dashboard-lower-section">

                {/* PROFILE PROGRESS */}

                <div className="dashboard-panel">

                    <div className="panel-header">

                        <div>
                            <h3>
                                Profile Progress
                            </h3>

                            <p>
                                Complete your profile to stand out.
                            </p>
                        </div>

                        <strong>
                            {profileCompletion}%
                        </strong>

                    </div>

                    <div className="progress-bar">

                        <div
                            className="progress-bar-fill"
                            style={{
                                width: `${profileCompletion}%`
                            }}
                        />

                    </div>

                </div>

                {/* QUICK ACTIONS */}

                <div className="dashboard-panel">

                    <h3>
                        Quick Actions
                    </h3>

                    <p>
                        Manage your career faster.
                    </p>

                    <div className="quick-actions">

                        <button
                            onClick={() =>
                                setPage("profile")
                            }
                        >
                            Edit Profile
                        </button>

                        <button
                            onClick={() =>
                                setPage("skills")
                            }
                        >
                            Add Skills
                        </button>

                        <button
                            onClick={() =>
                                setPage("projects")
                            }
                        >
                            Add Project
                        </button>

                        <button
                            onClick={() =>
                                setPage("resume")
                            }
                        >
                            Build Resume
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;