const requireAdmin = (req, res, next) => {
  const rawAdminIds = process.env.ADMIN_USER_IDS || "";
  const adminIds = rawAdminIds
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!adminIds.length) {
    return res.status(503).json({
      error: "Admin access is not configured. Set ADMIN_USER_IDS in environment.",
    });
  }

  const userId = req.user?.id;
  if (!userId || !adminIds.includes(userId)) {
    return res.status(403).json({ error: "Admin access required" });
  }

  return next();
};

export default requireAdmin;

