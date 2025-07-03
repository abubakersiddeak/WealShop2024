import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export function generateToken(user) {
  return jwt.sign({ id: user._id, name: user.name, role: user.role }, SECRET, {
    expiresIn: "1d",
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
}
