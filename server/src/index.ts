import express from "express";
import cors from "cors";
import jobs from "./routes/jobs";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/jobs", jobs);

const uiDist = path.resolve(__dirname, "../../ui/dist");
if (fs.existsSync(uiDist)) {
    app.use(express.static(uiDist));
    app.get("*", (req, res) => res.sendFile(path.join(uiDist, "index.html")));
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
