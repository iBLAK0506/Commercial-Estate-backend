import { User } from "../src/models/User.js";
import { HttpError } from "../src/utils/error.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../src/utils/tokens.js";

// This helper function is correct.
function setRefreshCookie(res, token) {
  const secure = process.env.COOKIE_SECURE === "true";
  const domain = process.env.COOKIE_DOMAIN || "localhost";
  res.cookie("rtk", token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    domain,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}

export async function register(req, res, next) {
  try {
    // FIX 1: Read 'username' from the request and assign it to a variable called 'name'.
    const { username: name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new HttpError(400, "Missing fields");
    }
    const existing = await User.findOne({ email });
    if (existing) {
      throw new HttpError(409, "Email already in use");
    }

    // FIX 2: Create the new user with the correct 'name' field.
    const user = new User({ name, email });
    await user.setPassword(password);
    await user.save();

    const access = signAccessToken({ sub: user._id, role: user.role });
    const refresh = signRefreshToken({ sub: user._id, role: user.role });
    setRefreshCookie(res, refresh);

    // FIX 3: Use the .toJSON() method from your User model to send a safe user object.
    res.status(201).json({
      message: "Registered",
      accessToken: access,
      user: user.toJSON(),
    });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new HttpError(400, "Missing fields");

    const user = await User.findOne({ email });
    if (!user) throw new HttpError(401, "Invalid credentials");

    const ok = await user.validatePassword(password);
    if (!ok) throw new HttpError(401, "Invalid credentials");

    const access = signAccessToken({ sub: user._id, role: user.role });
    const refresh = signRefreshToken({ sub: user._id, role: user.role });
    setRefreshCookie(res, refresh);

    // FIX 3 (Applied here too): Send a safe user object without the password hash.
    res.json({
      message: "Logged in",
      accessToken: access,
      user: user.toJSON(),
    });
  } catch (e) {
    next(e);
  }
}

export async function refreshToken(req, res, next) {
  try {
    const token = req.cookies?.rtk;
    if (!token) throw new HttpError(401, "No refresh token");

    const payload = verifyRefreshToken(token);
    const access = signAccessToken({ sub: payload.sub, role: payload.role });
    const newRefresh = signRefreshToken({
      sub: payload.sub,
      role: payload.role,
    });

    setRefreshCookie(res, newRefresh);
    res.json({ accessToken: access });
  } catch (e) {
    next(new HttpError(401, "Invalid refresh token"));
  }
}

export async function logout(req, res, next) {
  try {
    res.clearCookie("rtk", {
      path: "/",
      domain: process.env.COOKIE_DOMAIN || "localhost",
    });
    res.json({ message: "Logged out" });
  } catch (e) {
    next(e);
  }
}
