import { User } from "../src/models/User.js";
import { HttpError } from "../src/utils/error.js";

// Renamed from 'me'
export async function getMyProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    res.json({ user });
  } catch (e) {
    next(e);
  }
}

// Renamed from 'updateMe' and upgraded for security
export async function updateMyProfile(req, res, next) {
  try {
    const { name, email, password, avatarUrl } = req.body;

    // 1. Find the user document first
    const userToUpdate = await User.findById(req.user.id);

    if (!userToUpdate) {
      return next(new HttpError(404, "User not found"));
    }

    // 2. Update fields only if they were provided in the request
    if (name) userToUpdate.name = name;
    if (email) userToUpdate.email = email;
    if (avatarUrl) userToUpdate.avatarUrl = avatarUrl;

    // 3. If a new password was sent, hash it before saving
    if (password) {
      await userToUpdate.setPassword(password);
    }

    // 4. Save the updated user document to the database
    await userToUpdate.save();

    // 5. Send back the updated user, sanitized by the .toJSON() method
    res.status(200).json({ user: userToUpdate.toJSON() });
  } catch (e) {
    next(e);
  }
}

export async function getPublicProfile(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select(
      "name avatarUrl role createdAt"
    );
    if (!user) throw new HttpError(404, "User not found");
    res.json({ user });
  } catch (e) {
    next(e);
  }
}

export async function addFavorite(req, res, next) {
  try {
    const { propertyId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { favorites: propertyId } }, // Use $addToSet to prevent duplicates
      { new: true }
    ).populate("favorites");
    res.json({ favorites: user.favorites });
  } catch (e) {
    next(e);
  }
}

export async function removeFavorite(req, res, next) {
  try {
    const { propertyId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { favorites: propertyId } },
      { new: true }
    ).populate("favorites");
    res.json({ favorites: user.favorites });
  } catch (e) {
    next(e);
  }
}

export async function listFavorites(req, res, next) {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.json({ favorites: user.favorites });
  } catch (e) {
    next(e);
  }
}
