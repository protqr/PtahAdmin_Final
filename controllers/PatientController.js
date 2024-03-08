import Patient from "../models/PatientModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import day from "dayjs";

export const getAllPatients = async (req, res) => {
  const allusers = await Patient.find({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).json({ allusers });
};

export const createPatient = async (req, res) => {
  // Extract idPatient from request body
  const { _id } = req.body;

  // Check if idPatient already exists in the database
  const existingPatient = await Patient.findOne({ _id });
  if (existingPatient) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "idPatient already exists" });
  }

  // If idPatient does not exist, proceed to create new patient
  req.body.createdBy = req.user.userId;
  const patientuser = await Patient.create(req.body);
  res.status(StatusCodes.CREATED).json({ patientuser });
};

export const getPatient = async (req, res) => {
  const patient = await Patient.findById(req.params._id);
  if (!patient) throw new NotFoundError(`no patient with id : ${idPatient}`);
  res.status(StatusCodes.OK).json({ patient });
};

export const updatePatient = async (req, res) => {
  const updatedPatient = await Patient.findByIdAndUpdate(
    req.params._id,
    req.body,
    {
      new: true,
    }
  );

  if (!updatedPatient)
    throw new NotFoundError(`no patient with id : ${req.params._id}`);

  res.status(StatusCodes.OK).json({ patient: updatedPatient });
};

export const deletePatient = async (req, res) => {
  const removedPatient = await Patient.findByIdAndDelete(req.params._id);

  if (!removedPatient)
    throw new NotFoundError(`no patient with id : ${idPatient}`);
  res.status(StatusCodes.OK).json({ patient: removedPatient });
};

export const showStats = async (req, res) => {
  let stats = await Patient.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$userStatus", count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});
  console.log(stats);

  let patientall = await Patient.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$allusers", count: { $sum: 1 } } },
  ]);

  patientall = patientall.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});
  console.log(patientall);

  const defaultStats = {
    กำลังรักษา: stats.กำลังรักษา || 0,
    จบการรักษา: stats.จบการรักษา || 0,
    ผู้ป่วยทั้งหมด: patientall || 0,
  };

  let monthlyApplications = await Patient.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications.map((item) => {
    const {
      _id: { year, month },
      count,
    } = item;

    const date = day()
      .month(month - 1)
      .year(year)
      .format("MMM YY");

    return { date, count };
  })
  .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
