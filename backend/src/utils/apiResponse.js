function ok(res, data = null, message = "OK") {
  return res.status(200).json({ success: true, message, data });
}
function created(res, data = null, message = "Created") {
  return res.status(201).json({ success: true, message, data });
}
function badRequest(res, message = "Bad Request", details = null) {
  return res.status(400).json({ success: false, message, details });
}
function unauthorized(res, message = "Unauthorized") {
  return res.status(401).json({ success: false, message });
}
function forbidden(res, message = "Forbidden") {
  return res.status(403).json({ success: false, message });
}
function notFound(res, message = "Not Found") {
  return res.status(404).json({ success: false, message });
}
module.exports = { ok, created, badRequest, unauthorized, forbidden, notFound };
