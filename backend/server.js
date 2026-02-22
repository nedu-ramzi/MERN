import express from "express";
import goalRoutes from "../backend/routes/goalRoutes.js";
import { errorHandler } from "../backend/middleware/errorMiddleware.js";
import {config} from "../backend/config/main.js";


const app = express();
const port = process.env.PORT || 5000;

//Database connection
config.database();

//middleware body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/goals', goalRoutes);

//error Handler
app.use(errorHandler);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});