"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("../routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 8080;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(routes_1.subjectRouter);
/*app.use('/api/v1', [
  authRouter,
  facultiesDataRouter,
  userRouter,
  facultyRouter,
  moduleRouter,
  subjectRouter,
  lecturesRouter,
  finalRevisionRouter,
  practicalRouter
])*/
app.get("/", (req, res) => {
    res.json({
        message: "MAIN_FUNCTION",
        status: "APP_STATUS"
    });
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
