"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// for image upload
if (!fs_1.default.existsSync("public/files/uploads")) {
    if (!fs_1.default.existsSync("public/files")) {
        fs_1.default.mkdirSync("public/files");
    }
    if (!fs_1.default.existsSync("public/files/uploads")) {
        fs_1.default.mkdirSync("public/files/uploads");
    }
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/files/uploads");
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, Date.now() + Math.floor(Math.random() * 99) + 1 + "." + extension);
    },
});
// Router import
const models_1 = require("./models");
const viewRouter_1 = __importDefault(require("./router/viewRouter"));
const seeker_router_1 = __importDefault(require("./router/seeker.router"));
const recruiter_router_1 = __importDefault(require("./router/recruiter.router"));
const post_router_1 = __importDefault(require("./router/post.router"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, multer_1.default)({ storage: storage, limits: { fileSize: 1000000 } }).any());
app.enable("trust proxy");
// konfigurasi static item dalam public folder
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../public")));
// konfigurasi view engine "EJS"
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "../views"));
// konfigurasi sequelize dengan option alter
let PORT = process.env.PORT || 8080;
(0, models_1.connectToDatabase)()
    .then(() => {
    // set router
    const VERSION_API = "v1";
    app.use("/", viewRouter_1.default);
    app.use(`/api/${VERSION_API}/seeker`, seeker_router_1.default);
    app.use(`/api/${VERSION_API}/recruiter`, recruiter_router_1.default);
    app.use(`/api/${VERSION_API}/posts`, post_router_1.default);
    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error("Koneksi database gagal:", error);
});
//# sourceMappingURL=server.js.map