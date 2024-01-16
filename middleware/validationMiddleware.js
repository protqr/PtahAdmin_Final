import { body, param, validationResult } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customError.js";
import { TYPEPOSTURES, CHOOSEPOSTURES } from "../utils/constants.js";
import mongoose from "mongoose";
import Patient from "../models/PatientModel.js";
import User from "../models/UserModel.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        if (errorMessages[0].startsWith("no patient")) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith("not authorized")) {
          throw new UnauthorizedError("not authorized to access this route");
        }
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validatePatientInput = withValidationErrors([
  body("idPatient").notEmpty().withMessage("โปรดกรอกหมายเลขผู้ป่วยให้ถูกต้อง"),
  body("namePatient").notEmpty().withMessage("โปรดกรอกชื่อผู้ป่วยให้ถูกต้อง"),
  body("typePostures")
    .isIn(Object.values(TYPEPOSTURES))
    .withMessage("โปรดเลือกชื่อประเภทท่ากายภาพบำบัดให้ถูกต้อง"),
  body("choosePostures")
    .isIn(Object.values(CHOOSEPOSTURES))
    .withMessage("โปรดเลือกท่ากายภาพบำบัดให้ถูกต้อง"),
]);

export const validateIdParam = withValidationErrors([
  param("idPatient").custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const patient = await Patient.findById(value);
    if (!patient) throw new NotFoundError(`no patient with id : ${value}`);
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.userId === patient.createdBy.toString();
    if (!isAdmin && !isOwner)
      throw UnauthorizedError("not authorized to access this route");
  }),
]);

export const validateRegisterInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError("email already exists");
      }
    }),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
  body("location").notEmpty().withMessage("location is required"),
  body("lastName").notEmpty().withMessage("last name is required"),
]);

export const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("password").notEmpty().withMessage("password is required"),
]);

export const validateUpdateUserInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.userId) {
        throw new Error("email already exists");
      }
    }),
  body("lastName").notEmpty().withMessage("last name is required"),
  body("location").notEmpty().withMessage("location is required"),
]);
