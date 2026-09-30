const express = require("express");

const Resume = require("../models/Resume");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// RESUME ROUTE LOADED
// =====================================================

console.log("### RESUME ROUTE LOADED ###");

// =====================================================
// RESUME ROUTER REQUEST LOGGER
// =====================================================

router.use((req, res, next) => {
    console.log(
        "RESUME ROUTER HIT:",
        req.method,
        req.originalUrl
    );

    next();
});

// =====================================================
// CREATE RESUME
// POST /api/resumes
// =====================================================

router.post(
    "/",
    authMiddleware,
    async (req, res) => {

        try {

            console.log("=================================");
            console.log("CREATE RESUME REQUEST");
            console.log("USER ID:", req.user.id);
            console.log("=================================");

            const {
                personalInfo,
                education,
                skills,
                projects,
                experience,
                achievements,
                certifications
            } = req.body;

            // -------------------------------------------------
            // Validate personal information
            // -------------------------------------------------

            if (
                !personalInfo ||
                !personalInfo.name ||
                !personalInfo.name.trim()
            ) {
                return res.status(400).json({
                    message: "Full name is required"
                });
            }

            // -------------------------------------------------
            // Create resume
            // -------------------------------------------------

            const resume = new Resume({

                userId: req.user.id,

                personalInfo,

                education:
                    Array.isArray(education)
                        ? education
                        : [],

                skills:
                    Array.isArray(skills)
                        ? skills
                        : [],

                projects:
                    Array.isArray(projects)
                        ? projects
                        : [],

                experience:
                    Array.isArray(experience)
                        ? experience
                        : [],

                achievements:
                    Array.isArray(achievements)
                        ? achievements
                        : [],

                certifications:
                    Array.isArray(certifications)
                        ? certifications
                        : []
            });

            const savedResume =
                await resume.save();

            console.log(
                "RESUME CREATED:",
                savedResume._id
            );

            return res.status(201).json({
                message:
                    "Resume created successfully",

                resume:
                    savedResume
            });

        } catch (error) {

            console.error(
                "CREATE RESUME ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to create resume",

                error:
                    error.message
            });
        }
    }
);

// =====================================================
// GET CURRENT USER'S RESUMES
// GET /api/resumes
// =====================================================

router.get(
    "/",
    authMiddleware,
    async (req, res) => {

        try {

            console.log("=================================");
            console.log("GET RESUMES");
            console.log("USER ID:", req.user.id);
            console.log("=================================");

            const resumes =
                await Resume.find({
                    userId: req.user.id
                }).sort({
                    createdAt: -1
                });

            return res.status(200).json(
                resumes
            );

        } catch (error) {

            console.error(
                "GET RESUMES ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to fetch resumes",

                error:
                    error.message
            });
        }
    }
);

// =====================================================
// GET RESUME BY ID
// GET /api/resumes/:id
// =====================================================

router.get(
    "/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const resume =
                await Resume.findOne({
                    _id: req.params.id,
                    userId: req.user.id
                });

            if (!resume) {
                return res.status(404).json({
                    message:
                        "Resume not found"
                });
            }

            return res.status(200).json(
                resume
            );

        } catch (error) {

            console.error(
                "GET RESUME BY ID ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to fetch resume",

                error:
                    error.message
            });
        }
    }
);

// =====================================================
// UPDATE RESUME
// PUT /api/resumes/:id
// =====================================================

router.put(
    "/:id",
    authMiddleware,
    async (req, res) => {

        try {

            console.log("=================================");
            console.log("UPDATE RESUME");
            console.log(
                "RESUME ID:",
                req.params.id
            );
            console.log(
                "USER ID:",
                req.user.id
            );
            console.log("=================================");

            const {
                personalInfo,
                education,
                skills,
                projects,
                experience,
                achievements,
                certifications
            } = req.body;

            if (
                !personalInfo ||
                !personalInfo.name ||
                !personalInfo.name.trim()
            ) {
                return res.status(400).json({
                    message:
                        "Full name is required"
                });
            }

            const resume =
                await Resume.findOneAndUpdate(
                    {
                        _id: req.params.id,
                        userId: req.user.id
                    },

                    {
                        personalInfo,

                        education:
                            Array.isArray(education)
                                ? education
                                : [],

                        skills:
                            Array.isArray(skills)
                                ? skills
                                : [],

                        projects:
                            Array.isArray(projects)
                                ? projects
                                : [],

                        experience:
                            Array.isArray(experience)
                                ? experience
                                : [],

                        achievements:
                            Array.isArray(achievements)
                                ? achievements
                                : [],

                        certifications:
                            Array.isArray(certifications)
                                ? certifications
                                : []
                    },

                    {
                        new: true,
                        runValidators: true
                    }
                );

            if (!resume) {
                return res.status(404).json({
                    message:
                        "Resume not found"
                });
            }

            console.log(
                "RESUME UPDATED:",
                resume._id
            );

            return res.status(200).json({
                message:
                    "Resume updated successfully",

                resume:
                    resume
            });

        } catch (error) {

            console.error(
                "UPDATE RESUME ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to update resume",

                error:
                    error.message
            });
        }
    }
);

// =====================================================
// DELETE RESUME
// DELETE /api/resumes/:id
// =====================================================

router.delete(
    "/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const resume =
                await Resume.findOneAndDelete({
                    _id: req.params.id,
                    userId: req.user.id
                });

            if (!resume) {
                return res.status(404).json({
                    message:
                        "Resume not found"
                });
            }

            return res.status(200).json({
                message:
                    "Resume deleted successfully",

                resume:
                    resume
            });

        } catch (error) {

            console.error(
                "DELETE RESUME ERROR:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to delete resume",

                error:
                    error.message
            });
        }
    }
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;