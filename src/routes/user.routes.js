import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
  addFavorite,
  removeFavorite,
  listFavorites,
} from "../../controllers/users.controller.js";

const router = Router();

// --- Profile Routes ---
// Renamed from "/me" to "/profile" for clarity.
router.get("/profile", requireAuth, getMyProfile);
router.patch("/profile", requireAuth, updateMyProfile);

// --- Favorites Routes ---
// Grouped for better organization.
router.get("/profile/favorites", requireAuth, listFavorites);
router.post("/profile/favorites/:propertyId", requireAuth, addFavorite);
router.delete("/profile/favorites/:propertyId", requireAuth, removeFavorite);

// --- Public Profile Route ---
// This should come last to avoid conflicts with the "/profile" routes above.
router.get("/:id", getPublicProfile);

export default router;

// import { Router } from "express";
// import { requireAuth } from "../middleware/auth.js";
// import {
//   me,
//   updateMe,
//   getPublicProfile,
//   addFavorite,
//   removeFavorite,
//   listFavorites,
// } from "../../controllers/users.controller.js";

// const router = Router();

// router.get("/me", requireAuth, me);
// router.patch("/me", requireAuth, updateMe);
// router.get("/:id", getPublicProfile);

// router.post("/me/favorites/:propertyId", requireAuth, addFavorite);
// router.delete("/me/favorites/:propertyId", requireAuth, removeFavorite);
// router.get("/me/favorites", requireAuth, listFavorites);

// export default router;
