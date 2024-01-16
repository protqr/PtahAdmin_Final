import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import Patient from "../models/PatientModel.js";

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const patient = await Patient.countDocuments();
  res.status(StatusCodes.OK).json({ users, patient });
};

export const updateUser = async (req, res) => {
  const obj = { ...req.body };
  delete obj.password;
  console.log(obj);
  const updatedUser = await User.findByIdAndUpdate(req.user.userId, req.body, obj);
  res.status(StatusCodes.OK).json({ msg: "user updated" });
};
