import mongoose from "mongoose";
import { TYPEPOSTURES, CHOOSEPOSTURES } from "../utils/constants.js";

const PatientSchema = new mongoose.Schema(
  {
    idPatient: String,
    namePatient: String,
    typePostures: {
      type: String,
      enum: Object.values(TYPEPOSTURES),
      default: TYPEPOSTURES.TYPE_1,
    },
    choosePostures: [
      {
        type: String,
        enum: CHOOSEPOSTURES,
        default: CHOOSEPOSTURES[0], // ตั้งค่าเริ่มต้น
      },
    ],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Patient", PatientSchema);
