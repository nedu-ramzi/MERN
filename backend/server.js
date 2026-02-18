import express from "express";
const app = express();
import goalRoutes from "../backend/routes/goalRoutes.js";
import { errorHandler } from "../backend/middleware/errorMiddleware.js";
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/goals', goalRoutes);

//error Handler
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});