import mongoose from "mongoose";
import { TYPEPOSTURES, CHOOSEPOSTURES, TYPESTATUS } from "../utils/constants.js";

const PatientSchema = new mongoose.Schema(
  {
    idPatient: String,
    namePatient: String,
    userType: {
      type: String,
      enum: Object.values(TYPEPOSTURES),
      default: TYPEPOSTURES.TYPE_1,
    },
    userPosts: [
      {
        type: String,
        enum: CHOOSEPOSTURES,
        default: CHOOSEPOSTURES[0], // ตั้งค่าเริ่มต้น
      },
    ],
    userStatus: {
      type: String,
      enum: Object.values(TYPESTATUS),
      default: TYPESTATUS.TYPE_ST1,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Patient", PatientSchema);
