import { verifyAccessToken } from "../utils/tokens.js";
import { HttpError } from "../utils/error.js";

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return next(new HttpError(401, "Not authenticated"));

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (e) {
    next(new HttpError(401, "Invalid or expired token"));
  }
}

export function requireOwnerOrAdmin(getOwnerId) {
  return (req, res, next) => {
    const { user } = req;
    if (!user) return next(new HttpError(401, "Not authenticated"));
    const ownerId = getOwnerId(req);
    if (user.role === "admin" || String(user.id) === String(ownerId)) {
      return next();
    }
    return next(new HttpError(403, "Forbidden"));
  };
}
