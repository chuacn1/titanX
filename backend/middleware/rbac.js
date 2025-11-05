const rbac = (...allowedRoles) => {
  return (req, res, next) => {
      if (!req.user || !req.user.role) {
          return res.status(403).json({ message: "Forbidden: Not Authenticated" });
      }
//To allow multiple roles
//Wont pose a security risk as roles are defined on routes
      if (!allowedRoles.includes(req.user.role)) {
          return res.status(403).json({ message: "Forbidden: Not the Required Role" });
      }

      next();
  };
};
  
  export default rbac;