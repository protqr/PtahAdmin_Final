import { Router } from "express";
const router = Router();

import {
  getAllPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controllers/PatientController.js";
import {
  validatePatientInput,
  validateIdParam,
} from "../middleware/validationMiddleware.js";

// router.get('/', getAllPatients);
// router.post('/', createPatient);

router.route("/").get(getAllPatients).post(validatePatientInput, createPatient);
router
  .route("/:idPatient")
  .get(validateIdParam, getPatient)
  .patch(validatePatientInput, validateIdParam, updatePatient)
  .delete(validateIdParam, deletePatient);

export default router;
