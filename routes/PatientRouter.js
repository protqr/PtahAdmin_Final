import { Router } from "express";
const router = Router();

import {
  getAllPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controllers/PatientController.js";

// router.get('/', getAllPatients);
// router.post('/', createPatient);

router.route("/").get(getAllPatients).post(createPatient);
router
  .route("/:idPatient")
  .get(getPatient)
  .patch(updatePatient)
  .delete(deletePatient);

export default router;
