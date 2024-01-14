import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    idPatient: String,
    namePatient: String,
    typePostures: {
      type: String,
      enum: ["หลอดเลือดสมองระยะฟื้นฟู", "หลอดเลือดสมองระยะฟื้นฟู2"],
      default: "หลอดเลือดสมองระยะฟื้นฟู",
    },
    choosePostures: {
      type: String,
      enum: [
        "ท่าทั้งหมด",
        "ท่าที่ 1",
        "ท่าที่ 2",
        "ท่าที่ 3",
        "ท่าที่ 4",
        "ท่าที่ 5",
        "ท่าที่ 6",
      ],
      default: "ท่าทั้งหมด",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Patient", PatientSchema);
