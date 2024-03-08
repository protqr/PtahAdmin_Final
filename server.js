import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import morgan from "morgan";
import mongoose from "mongoose";
import "express-async-errors";
import cookieParser from "cookie-parser";

// routers
import PatientRouter from "./routes/PatientRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";

// middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

// ลองเรียก api
// try {
//   const response = await fetch(
//     "https://www.course-api.com/react-useReducer-cart-project"
//   );
//   const cartData = await response.json();
//   console.log(cartData);
// } catch (error) {
//   console.log(error);
// }

// fetch("https://www.course-api.com/react-useReducer-cart-project")
//   .then((res) => res.json())
//   .then((data) => console.log(data));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "test route" });
});

app.use("/api/v1/allusers", authenticateUser, PatientRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authenticateUser, userRouter);


// ไม่พบข้อมูล
app.use("*", (req, res) => {
  res.status(404).json({ msg: "Not Found" });
});

// error
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
