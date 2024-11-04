const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Role = require("../models/role");
const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string().email().optional().allow(""), // Optional and allows an empty string
  password: Joi.string().min(6).optional().allow(""), // Optional and allows an empty string
  role: Joi.string()
    .valid("admin", "procurement_manager", "inspection_manager", "client")
    .required(), // Required role field
  mobile: Joi.string().optional().allow(""), // Optional mobile field
});

// exports.register = async (req, res) => {
//     const { error } = userSchema.validate(req.body);
//     if (error) return res.status(400).json({ error: error.details[0].message });

//     const { email, password, role, mobile } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     try {
//         const user = await User.create({ email, password: hashedPassword, role, mobile });
//         res.status(201).json({ message: 'User created', user });
//     } catch (error) {
//         res.status(400).json({ error: 'User already exists or invalid data' });
//     }
// };

exports.createInitialAdmin = async (req, res) => {
  const { email, password } = req.body;

  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    return res.status(400).json({ error: "Admin already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const admin = await User.create({
      email,
      password: hashedPassword,
      role: "admin",
    });
    res.status(201).json({ message: "Admin created", admin });
  } catch (error) {
    res.status(400).json({ error: "Error creating admin" });
  }
};

exports.register = async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const { email, password, role: roleName, mobile } = req.body;

    // Check if the provided role exists in the roles collection by name
    const existingRole = await Role.findOne({ name: roleName });
    if (!existingRole) throw new Error("Invalid role provided.");

    // Additional checks for specific roles
    if (existingRole.name === "inspection_manager") {
      // Ensure mobile is provided for inspection managers
      if (!mobile)
        throw new Error("Mobile is required for inspection managers.");

      // Check if an inspection manager with this mobile number already exists
      const existingManager = await User.findOne({ mobile });
      if (existingManager)
        throw new Error("Mobile already exists for inspection managers.");

      // Create the inspection manager user if no errors
      const user = await User.create({
        mobile,
        role: existingRole._id, // Use the ObjectId of the found role
      });

      return res.status(201).json({ message: "User created", user });
    }

    // Check if an existing user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email already exists.");

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await User.create({
      email,
      password: hashedPassword,
      role: existingRole._id, // Use the ObjectId of the found role
      mobile: mobile ? mobile : "",
    });

    res.status(201).json({ message: "User created", user });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, mobile } = req.body; // identifier could be email or mobile

    let user;
    if (mobile) {
      user = await User.findOne({ mobile }).populate("role");
      if (!user) throw new Error("Invalid credentials");

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        token,
        user: user,
      });
    }

    user = await User.findOne({ email }).populate("role");
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// exports.createInspectionManager = async (req, res) => {
//     const { email, password, mobile } = req.body;

//     // Check if the mobile number is already taken
//     const existingManager = await User.findOne({ mobile });
//     if (existingManager) {
//         return res.status(400).json({ error: 'Inspection manager already exists. Please contact admin.' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     try {
//         const user = await User.create({ email, password: hashedPassword, role: 'inspection_manager', mobile });
//         res.status(201).json({ message: 'Inspection Manager created', user });
//     } catch (error) {
//         res.status(400).json({ error: 'Error creating Inspection Manager' });
//     }
// };

exports.registerProcurementManager = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "User already exists with this email." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      email,
      password: hashedPassword,
      role: "procurement_manager",
    });
    res.status(201).json({ message: "Procurement Manager created", user });
  } catch (error) {
    res.status(400).json({ error: "Error creating Procurement Manager" });
  }
};

exports.registerInspectionManager = async (req, res) => {
  const { email, password, mobile, assignedProcurementManager } = req.body;

  const existingManager = await User.findOne({ mobile });
  if (existingManager) {
    return res.status(400).json({
      error: "Inspection manager already exists. Please contact admin.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      email,
      password: hashedPassword,
      role: "inspection_manager",
      mobile,
      assignedProcurementManager,
    });
    res.status(201).json({ message: "Inspection Manager created", user });
  } catch (error) {
    res.status(400).json({ error: "Error creating Inspection Manager" });
  }
};

exports.registerClient = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "User already exists with this email." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      email,
      password: hashedPassword,
      role: "client",
    });
    res.status(201).json({ message: "Client created", user });
  } catch (error) {
    res.status(400).json({ error: "Error creating Client" });
  }
};

exports.assignInspectionManager = async (req, res) => {
  const { inspectionManagerId, procurementManagerId } = req.body;

  const inspectionManager = await User.findById(inspectionManagerId);
  if (!inspectionManager || inspectionManager.role !== "inspection_manager") {
    return res.status(400).json({ error: "Invalid Inspection Manager ID" });
  }

  // Assign to the procurement manager
  inspectionManager.assignedProcurementManager = procurementManagerId;
  await inspectionManager.save();
  res.status(200).json({ message: "Inspection Manager assigned successfully" });
};

exports.unassignInspectionManager = async (req, res) => {
  const { inspectionManagerId } = req.body;

  const inspectionManager = await User.findById(inspectionManagerId);
  if (!inspectionManager || inspectionManager.role !== "inspection_manager") {
    return res.status(400).json({ error: "Invalid Inspection Manager ID" });
  }

  // Unassign the procurement manager
  inspectionManager.assignedProcurementManager = null;
  await inspectionManager.save();
  res
    .status(200)
    .json({ message: "Inspection Manager unassigned successfully" });
};

exports.registerInspectionManagerByProcurement = async (req, res) => {
  const { email, password, mobile } = req.body;

  const existingManager = await User.findOne({ mobile });
  if (existingManager) {
    return res.status(400).json({
      error: "Inspection manager already exists. Please contact admin.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      email,
      password: hashedPassword,
      role: "inspection_manager",
      mobile,
      assignedProcurementManager: req.user.id,
    });
    res.status(201).json({ message: "Inspection Manager created", user });
  } catch (error) {
    res.status(400).json({ error: "Error creating Inspection Manager" });
  }
};

exports.registerClientByProcurement = async (req, res) => {
  const { email, password } = req.body;

  // Check if the client already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "User already exists with this email." });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      email,
      password: hashedPassword,
      role: "client",
      assignedProcurementManager: req.user.id, // Link to the procurement manager creating this user
    });
    res.status(201).json({ message: "Client created", user });
  } catch (error) {
    res.status(400).json({ error: "Error creating Client" });
  }
};
