import { Property } from "../src/models/Property.js";
import { HttpError } from "../src/utils/error.js";

export async function listProperties(req, res, next) {
  try {
    const { city, type, minPrice, maxPrice, beds, baths, q } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(`^${city}$`, "i");
    if (type) filter.type = type;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (beds) filter.beds = { $gte: Number(beds) };
    if (baths) filter.baths = { $gte: Number(baths) };
    if (q)
      filter.$or = [
        { title: new RegExp(q, "i") },
        { description: new RegExp(q, "i") },
        { city: new RegExp(q, "i") },
        { address: new RegExp(q, "i") },
      ];
    const items = await Property.find(filter).populate(
      "owner",
      "name avatarUrl"
    );
    res.json({ items });
  } catch (e) {
    next(e);
  }
}

export async function getProperty(req, res, next) {
  try {
    const item = await Property.findById(req.params.id).populate(
      "owner",
      "name avatarUrl"
    );
    if (!item) throw new HttpError(404, "Property not found");
    res.json({ item });
  } catch (e) {
    next(e);
  }
}

export async function createProperty(req, res, next) {
  try {
    const body = req.body;
    const item = await Property.create({ ...body, owner: req.user.id });
    res.status(201).json({ item });
  } catch (e) {
    next(e);
  }
}

export async function updateProperty(req, res, next) {
  try {
    const item = await Property.findById(req.params.id);
    if (!item) throw new HttpError(404, "Property not found");
    if (String(item.owner) !== String(req.user.id) && req.user.role !== "admin")
      throw new HttpError(403, "Forbidden");
    Object.assign(item, req.body);
    await item.save();
    res.json({ item });
  } catch (e) {
    next(e);
  }
}

export async function deleteProperty(req, res, next) {
  try {
    const item = await Property.findById(req.params.id);
    if (!item) throw new HttpError(404, "Property not found");
    if (String(item.owner) !== String(req.user.id) && req.user.role !== "admin")
      throw new HttpError(403, "Forbidden");
    await item.deleteOne();
    res.json({ message: "Deleted" });
  } catch (e) {
    next(e);
  }
}
