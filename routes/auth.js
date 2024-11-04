const express = require("express");
const {
  register,
  login,
  createInitialAdmin,
  createInspectionManager,
  registerInspectionManager,
  registerProcurementManager,
  registerClient,
  assignInspectionManager,
  unassignInspectionManager,
  registerInspectionManagerByProcurement,
  registerClientByProcurement,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const router = express.Router();

// Admin can register users
router.post("/create-initial-admin", createInitialAdmin);
router.post("/login", login);
router.post("/register", register);
// router.post('/create-inspection-manager', authMiddleware, authorize(['procurement_manager']), createInspectionManager);
router.post(
  "/register/procurement-manager",
  authMiddleware,
  authorize(["admin"]),
  registerProcurementManager
);
router.post(
  "/register/inspection-manager",
  authMiddleware,
  authorize(["admin"]),
  registerInspectionManager
);
router.post(
  "/register/client",
  authMiddleware,
  authorize(["admin"]),
  registerClient
);

router.post(
  "/register/inspection-manager-procurement",
  authMiddleware,
  authorize(["procurement_manager"]),
  registerInspectionManagerByProcurement
);
router.post(
  "/register/client-procurement",
  authMiddleware,
  authorize(["procurement_manager"]),
  registerClientByProcurement
);

router.post(
  "/assign-inspection-manager",
  authMiddleware,
  authorize(["admin"]),
  assignInspectionManager
);
router.post(
  "/unassign-inspection-manager",
  authMiddleware,
  authorize(["admin"]),
  unassignInspectionManager
);

module.exports = router;
