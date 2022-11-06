const ROLES = {
  HOTEL: "HOTEL",
  CLIENT: "CLIENT",
  ADMIN: "ADMIN",
};

const inRole =
  (...roles) =>
  (req, res, next) => {
    const role = roles.find((role) => req.user.role === role);
    if (!role) {
      return res.json({
        status: "Failed",
        message: "common:You_are_not_authorized_to_access_this_resource",
      });
    }
    next();
  };

module.exports = {
  inRole,
  ROLES,
};
