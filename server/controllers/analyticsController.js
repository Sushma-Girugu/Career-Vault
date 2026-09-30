const Profile = require("../models/Profile");
const Skill = require("../models/skill");
const JobApplication = require("../models/JobApplication");
const Question = require("../models/Question");

const getAnalytics = async (req, res) => {
  try {
    const profileCount = await Profile.countDocuments();
    const skillCount = await Skill.countDocuments();
    const applicationCount = await JobApplication.countDocuments();
    const questionCount = await Question.countDocuments();

    const appliedCount = await JobApplication.countDocuments({
      status: "Applied"
    });

    const interviewCount = await JobApplication.countDocuments({
      status: "Interview"
    });

    const selectedCount = await JobApplication.countDocuments({
      status: "Selected"
    });

    const rejectedCount = await JobApplication.countDocuments({
      status: "Rejected"
    });

    res.status(200).json({
      profile: profileCount > 0 ? "Completed" : "Not Completed",
      totalSkills: skillCount,
      totalApplications: applicationCount,
      totalQuestions: questionCount,
      applicationsByStatus: {
        Applied: appliedCount,
        Interview: interviewCount,
        Selected: selectedCount,
        Rejected: rejectedCount
      }
    });
  } catch (error) {
    console.error("Analytics error:", error);

    res.status(500).json({
      message: "Failed to fetch analytics"
    });
  }
};

module.exports = {
  getAnalytics
};