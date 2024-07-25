"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helpers_1 = require("./utlis/helpers");
const routes_1 = require("./routes");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("./utlis/db"));
dotenv_1.default.config();
const port = process.env.APP_PORT;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/v1', [
    routes_1.authRouter,
    routes_1.userRouter,
    routes_1.facultyRouter,
    routes_1.moduleRouter,
    routes_1.subjectRouter
]);
app.get('/', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = yield bcrypt_1.default.hash("123456789", 10);
    yield db_1.default.user.create({
        data: {
            name: "Abdp",
            email: "a@a.com",
            facultyId: 1,
            yearId: 1,
            password
        }
    });
    return res.status(200).json({
        message: "Faculty API - Documentation",
        info: "To start using the api head to this route: /api/login",
        status: 200,
        password
    });
}));
app.listen(port, () => {
    (0, helpers_1.showAppURLCMD)(port);
});
exports.default = app;
