const router = require('express').Router();

const userRoutes = require("./userRoutes");
router.use("/api/users", userRoutes);

const thoughtRoutes = require("./thoughtRoutes");
router.use("/api/thoughts", thoughtRoutes)

module.exports = router;