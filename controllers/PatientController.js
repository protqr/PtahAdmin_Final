import Patient from "../models/PatientModel.js";
import { StatusCodes } from "http-status-codes";

import { nanoid } from "nanoid";

// Allusers Page
// let allusers = [
//   { idPatient: "1199900555111", namePatient: "apple cherry" },
//   { idPatient: "1199900555222", namePatient: "cherry apple" },
// ];

// export const getAllPatients = async (req, res) => {
//   res.status(200).json({ allusers });
// };

export const getAllPatients = async (req, res) => {
  const allusers = await Patient.find({createdBy:req.user.userId});
  res.status(StatusCodes.OK).json({ allusers });
};

export const createPatient = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const patientuser = await Patient.create(req.body);
  res.status(StatusCodes.CREATED).json({ patientuser });
};

// export const getPatient = async (req, res) => {
//   const { idPatient } = req.params;
//   const patient = allusers.find((patient) => patient.idPatient === idPatient);
//   if (!patient) {
//     throw new Error("ไม่พบข้อมูลผู้ป่วยหมายเลขนี้");
//     return res
//       .status(404)
//       .json({ msg: `ไม่พบหมายเลขผู้ป่วย ${idPatient} ในฐานข้อมูลนี้` });
//   }
//   res.status(200).json({ patient });
// };

export const getPatient = async (req, res) => {
  const patient = await Patient.findById(req.params.idPatient);
  if (!patient) throw new NotFoundError(`no patient with id : ${idPatient}`);
  res.status(StatusCodes.OK).json({ patient });
};

// export const updatePatient = async (req, res) => {
//   const { namePatient } = req.body;
//   if (!namePatient) {
//     return res.status(400).json({ msg: "กรุณาระบุชื่อผู้ป่วย" });
//   }
//   const { idPatient } = req.params;
//   const patient = allusers.find((patient) => patient.idPatient === idPatient);
//   if (!patient) {
//     return res
//       .status(404)
//       .json({ msg: `ไม่พบหมายเลขผู้ป่วย ${idPatient} ในฐานข้อมูลนี้` });
//   }

//   patient.namePatient = namePatient;
//   res.status(200).json({ msg: "ข้อมูลได้รับการบันทึกเรียบร้อยแล้ว", patient });
// };

export const updatePatient = async (req, res) => {
  const updatedPatient = await Patient.findByIdAndUpdate(
    req.params.idPatient,
    req.body,
    {
      new: true,
    }
  );

  if (!updatedPatient)
    throw new NotFoundError(`no patient with id : ${idPatient}`);

  // {
  //   return res.status(404).json({ msg: `no patient with id ${idPatient}` });
  // }

  res.status(StatusCodes.OK).json({ patient: updatedPatient });
};

// export const deletePatient = async (req, res) => {
//   const { idPatient } = req.params;
//   const patient = allusers.find((patient) => patient.idPatient === idPatient);
//   if (!patient) {
//     return res
//       .status(404)
//       .json({ msg: `ไม่พบหมายเลขผู้ป่วย ${idPatient} ในฐานข้อมูลนี้` });
//   }
//   const newPatients = allusers.filter(
//     (patient) => patient.idPatient !== idPatient
//   );
//   allusers = newPatients;

//   res.status(200).json({ msg: "ข้อมูลถูกลบเรียบร้อยแล้ว" });
// };

export const deletePatient = async (req, res) => {
  const removedPatient = await Patient.findByIdAndDelete(req.params.idPatient);

  if (!removedPatient)
    throw new NotFoundError(`no patient with id : ${idPatient}`);

  // {
  //   return res.status(404).json({ msg: `no patient with id ${idPatient}` });
  // }
  res.status(StatusCodes.OK).json({ patient: removedPatient });
};
