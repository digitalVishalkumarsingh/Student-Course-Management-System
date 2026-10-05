const Enrollment = require("../models/Enrollment");

const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let data;

    if (role === "admin") {
      data = await Enrollment.getDashboardData();
    } else {
      data = await Enrollment.getStudentDashboardData(userId);
    }

    res.json({
      success: true,
      role,
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard
};
