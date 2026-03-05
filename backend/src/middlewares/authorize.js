const { forbidden } = require("../utils/apiResponse");

module.exports = function authorize(requiredPermission) {
  return (req, res, next) => {
    const perms = req.user?.permissions || [];
    if (!perms.includes(requiredPermission)) return forbidden(res, `Missing permission: ${requiredPermission}`);
    return next();
  };
};
