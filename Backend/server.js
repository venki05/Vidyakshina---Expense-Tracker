import dotenv from "dotenv";
import connectDB from "./common/db.js";
import app from "./main.js";


dotenv.config();
connectDB();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
