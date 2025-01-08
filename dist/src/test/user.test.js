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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const posts_model_1 = __importDefault(require("../models/posts_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield user_model_1.default.deleteMany();
    yield posts_model_1.default.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const baseUrl = "/users";
const testUser = {
    email: "user1@test.com",
    password: "123456",
};
describe("Auth test suite", () => {
    test("Auth test registration", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/register")
            .send(testUser);
        expect(response.statusCode).toBe(201);
    }));
    test("Auth test registration no password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/register")
            .send({
            email: "sdfsadaf",
        });
        expect(response.statusCode).not.toBe(200);
    }));
    test("Auth test registration email already exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/register")
            .send(testUser);
        expect(response.statusCode).not.toBe(200);
    }));
    test("Auth test login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/login")
            .send(testUser);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
        expect(response.body).toHaveProperty("refreshToken");
        const accessToken = response.body.accessToken;
        const refreshToken = response.body.refreshToken;
        testUser.accessToken = accessToken;
        testUser.refreshToken = refreshToken;
        testUser._id = response.body._id;
    }));
    test("Auth test login with incorrect password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/login")
            .send({
            email: testUser.email,
            password: "wrongpassword",
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
    }));
    test("Auth test login make sure tokens are different", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/login")
            .send(testUser);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
        expect(response.body).toHaveProperty("refreshToken");
        const accessToken = response.body.accessToken;
        const refreshToken = response.body.refreshToken;
        expect(accessToken).not.toBe(testUser.accessToken);
        expect(refreshToken).not.toBe(testUser.refreshToken);
        testUser.accessToken = accessToken;
        testUser.refreshToken = refreshToken;
        testUser._id = response.body._id;
    }));
    test("Test token access", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").send({
            title: "Test title",
            content: "Test content",
            owner: "Lorin",
        });
        expect(response.statusCode).not.toBe(201);
        const response2 = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set({
            authorization: "JWT " + testUser.accessToken,
        })
            .send({
            title: "Test title",
            content: "Test content",
            owner: "Lorin",
        });
        expect(response2.statusCode).toBe(201);
    }));
    test("Test token access fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response2 = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set({
            authorization: "JWT " + testUser.accessToken + "f",
        })
            .send({
            title: "Test title",
            content: "Test content",
            owner: "Lorin",
        });
        expect(response2.statusCode).not.toBe(201);
    }));
    test("Test refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/refresh")
            .send({
            refreshToken: testUser.refreshToken,
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
        expect(response.body).toHaveProperty("refreshToken");
        testUser.accessToken = response.body.accessToken;
        testUser.refreshToken = response.body.refreshToken;
    }));
    test("Test refresh token fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/refresh")
            .send({
            refreshToken: testUser.refreshToken,
        });
        expect(response.statusCode).toBe(200);
        const newRefreshToken = response.body.refreshToken;
        const response2 = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/refresh")
            .send({
            refreshToken: testUser.refreshToken,
        });
        expect(response2.statusCode).not.toBe(200);
        const response3 = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/refresh")
            .send({
            refreshToken: newRefreshToken,
        });
        expect(response3.statusCode).not.toBe(200);
    }));
    test("Test refresh token with invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/refresh")
            .send({
            refreshToken: "invalidrefreshtoken",
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Test Logout", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/login")
            .send(testUser);
        expect(response.statusCode).toBe(200);
        const accessToken = response.body.accessToken;
        const refreshToken = response.body.refreshToken;
        testUser.accessToken = accessToken;
        testUser.refreshToken = refreshToken;
        const response2 = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/logout")
            .send({
            refreshToken: testUser.refreshToken,
        });
        expect(response2.statusCode).toBe(200);
        const response3 = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/refresh")
            .send({
            refreshToken: testUser.refreshToken,
        });
        expect(response3.statusCode).not.toBe(200);
    }));
    jest.setTimeout(20000);
    test("Token expiration", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/login")
            .send(testUser);
        expect(response.statusCode).toBe(200);
        testUser.accessToken = response.body.accessToken;
        testUser.refreshToken = response.body.refreshToken;
        yield new Promise((resolve) => setTimeout(resolve, 12000));
        const response2 = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set({
            authorization: "JWT " + testUser.accessToken,
        })
            .send({
            title: "Test title",
            content: "Test content",
            owner: "Lorin",
        });
        expect(response2.statusCode).not.toBe(201);
        const response3 = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/refresh")
            .send({
            refreshToken: testUser.refreshToken,
        });
        expect(response3.statusCode).toBe(200);
        testUser.accessToken = response3.body.accessToken;
        testUser.refreshToken = response3.body.refreshToken;
        const response4 = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set({
            authorization: "JWT " + testUser.accessToken,
        })
            .send({
            title: "Test title",
            content: "Test content",
            owner: "Lorin",
        });
        expect(response4.statusCode).toBe(201);
    }));
    test("Get user by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield user_model_1.default.create({
            email: "unique1@test.com",
            password: "123456",
        });
        const response = yield (0, supertest_1.default)(app).get(`${baseUrl}/${newUser._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("email", "unique1@test.com");
    }));
    test("Get non-existent user by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistentId = new mongoose_1.default.Types.ObjectId();
        const response = yield (0, supertest_1.default)(app).get(`${baseUrl}/${nonExistentId}`);
        expect(response.statusCode).toBe(404);
    }));
    test("Update user", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield user_model_1.default.create({
            email: "unique2@test.com",
            password: "123456",
        });
        const response = yield (0, supertest_1.default)(app)
            .put(`${baseUrl}/${newUser._id}`)
            .send({ email: "updated@test.com" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("email", "updated@test.com");
    }));
    test("Delete user", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield user_model_1.default.create({
            email: "unique3@test.com",
            password: "123456",
        });
        const response = yield (0, supertest_1.default)(app).delete(`${baseUrl}/${newUser._id}`);
        expect(response.statusCode).toBe(200);
    }));
    test("delete user fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete(`${baseUrl}/123`);
        expect(response.statusCode).not.toBe(200);
    }));
    test("Update user with invalid data", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield user_model_1.default.create({
            email: "unique4@test.com",
            password: "123456",
        });
        const response = yield (0, supertest_1.default)(app)
            .put(`${baseUrl}/${newUser._id}`)
            .send({ email: "invalid-email" });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
    }));
    test("Login when TOKEN_SECRET is undefined", () => __awaiter(void 0, void 0, void 0, function* () {
        const originalSecret = process.env.TOKEN_SECRET;
        delete process.env.TOKEN_SECRET;
        const response = yield (0, supertest_1.default)(app)
            .post(baseUrl + "/login")
            .send(testUser);
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty("error");
        process.env.TOKEN_SECRET = originalSecret;
    }));
});
//# sourceMappingURL=user.test.js.map