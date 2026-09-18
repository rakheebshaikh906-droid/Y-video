import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
});

import connectDB from "./db/database.js";

connectDB()
    .then(() => {
        app.on("error", (err) => {
            console.log("Error while starting the server", err);
            process.exit(1);
        });
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => console.log("error occurs while connecting to database", error));
