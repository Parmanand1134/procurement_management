const express = require("express");
const authRoutes = require("./auth");
const checklistRoutes = require("./checklist");
const orderRoutes = require("./order");

const initializeRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/checklist", checklistRoutes);
  app.use("/api/order", orderRoutes);
};

module.exports = initializeRoutes;
