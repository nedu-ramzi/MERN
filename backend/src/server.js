//Dependency imports
import express from "express";

//File imports
import goalRoutes from "./routes/goalRoutes.js";
import authUserRoutes from "./routes/authUserRoute.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import {config} from "./config/main.js";


const app = express();
const port = process.env.PORT || 5000;

//Database connection
config.database();

//middleware body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: `MERN APP is running on port ${process.env.PORT}` });
});

app.use('/api/goals', goalRoutes);
app.use('/api/auth', authUserRoutes);

//error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});