"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const posts_routes_1 = __importDefault(require("./routes/posts_routes"));
const comments_routes_1 = __importDefault(require("./routes/comments_routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const user_routes_1 = __importDefault(require("./routes/user_routes"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/posts", posts_routes_1.default);
app.use("/comments", comments_routes_1.default);
app.use("/users", user_routes_1.default);
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: " Project Web Dev 2025 REST API",
            version: "1.0.0",
            description: "REST server including authentication using JWT (API for user authentication, post management, and comments)",
        },
        servers: [{ url: "http://localhost:3003", },],
    },
    apis: ["./src/routes/*.ts"],
};
const specs = (0, swagger_jsdoc_1.default)(options);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
// Swagger setup
// const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const initApp = () => {
    console.log('initApp start');
    return new Promise((resolve, reject) => {
        const db = mongoose_1.default.connection;
        db.on("error", (err) => {
            console.log(err);
        });
        db.once("open", () => {
            console.log("connected to MongoDB");
        });
        if (process.env.DB_CONNECT === undefined) {
            console.error("DB_CONNECT is not set");
            reject();
        }
        else {
            mongoose_1.default.connect(process.env.DB_CONNECT).then(() => {
                console.log('initApp finish');
                app.get("/about", (req, res) => {
                    res.send("About page");
                });
                resolve(app);
            });
        }
    });
};
exports.default = initApp;
//# sourceMappingURL=server.js.map