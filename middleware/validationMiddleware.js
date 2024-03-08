import { body, param, validationResult } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customError.js";
import { TYPEPOSTURES, CHOOSEPOSTURES, TYPESTATUS } from "../utils/constants.js";
import mongoose from "mongoose";
import Patient from "../models/PatientModel.js";
import User from "../models/UserModel.js";
// import { existingPatient } from "../controllers/PatientController.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        if (errorMessages[0].startsWith("no patient")) {
          // แสดง alert เมื่อไม่พบผู้ป่วย
          alert("ไม่พบผู้ป่วย");
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith("not authorized")) {
          // แสดง alert เมื่อไม่ได้รับอนุญาตให้เข้าถึงเส้นทางนี้
          alert("ไม่ได้รับอนุญาตให้เข้าถึงเส้นทางนี้");
          throw new UnauthorizedError("not authorized to access this route");
        }
        // แสดง alert เมื่อข้อมูลไม่ถูกต้อง
        alert("ข้อมูลไม่ถูกต้อง");
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};


export const validatePatientInput = withValidationErrors([
  body("idPatient")
    .notEmpty()
    .withMessage("โปรดกรอกหมายเลขผู้ป่วยให้ถูกต้อง")
    .custom(async (value) => {
      // Check if idPatient already exists in the database
      const existingPatient = await Patient.findOne({ idPatient: value });
      if (existingPatient) {
        throw new BadRequestError("หมายเลขผู้ป่วยซ้ำ");
      }
    }),
  body("namePatient").notEmpty().withMessage("โปรดกรอกชื่อผู้ป่วยให้ถูกต้อง"),
  body("userType")
    .isIn(Object.values(TYPEPOSTURES))
    .withMessage("โปรดเลือกชื่อประเภทท่ากายภาพบำบัดให้ถูกต้อง"),
  body("userPosts")
    .isIn(Object.values(CHOOSEPOSTURES))
    .withMessage("โปรดเลือกท่ากายภาพบำบัดให้ถูกต้อง"),
  body("userStatus")
    .isIn(Object.values(TYPESTATUS))
    .withMessage("โปรดเลือกสถานะปัจจุบันของคนไข้ให้ถูกต้อง"),
]);

export const validateIdParam = withValidationErrors([
  param("_id").custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");
    const patient = await Patient.findById(value);
    if (!patient) throw new NotFoundError(`no patient with id : ${value}`);
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.userId === patient.createdBy.toString();
    if (!isAdmin && !isOwner)
      throw new UnauthorizedError("not authorized to access this route");
  }),
]);

export const validateRegisterInput = withValidationErrors([
  // โค้ด validateRegisterInput นี่เราไม่ได้แก้ไขใด ๆ
]);

export const validateLoginInput = withValidationErrors([
  // โค้ด validateLoginInput นี่เราไม่ได้แก้ไขใด ๆ
]);

export const validateUpdateUserInput = withValidationErrors([
  // โค้ด validateUpdateUserInput นี่เราไม่ได้แก้ไขใด ๆ
]);
