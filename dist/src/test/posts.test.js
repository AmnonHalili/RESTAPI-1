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
const testUser = {
    email: "user1@test.com",
    password: "123456",
};
let accessToken;
let userId;
let postId;
const testPost = {
    title: "Test title",
    content: "Test content",
    owner: null,
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield posts_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany();
    // Register user
    const registerResponse = yield (0, supertest_1.default)(app)
        .post("/users/register")
        .send(testUser);
    expect(registerResponse.statusCode).toBe(201);
    // Login user
    const loginResponse = yield (0, supertest_1.default)(app)
        .post("/users/login")
        .send(testUser);
    expect(loginResponse.statusCode).toBe(200);
    accessToken = loginResponse.body.accessToken;
    userId = loginResponse.body._id;
    testPost.owner = userId;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const invalidPost = {
    content: "test content",
};
describe("Posts test suite", () => {
    test("post test get All posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    }));
    test("Test Adding new post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set({
            authorization: "Bearer " + accessToken,
        })
            .send(testPost);
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(testPost.title);
        expect(response.body.content).toBe(testPost.content);
        expect(response.body.owner.toString()).toBe(userId);
        postId = response.body._id;
    }));
    test("Test Adding invalid post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/posts")
            .set({
            authorization: "Bearer " + accessToken,
        })
            .send(invalidPost);
        expect(response.statusCode).not.toBe(201);
    }));
    test("test get all posts after adding", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    }));
    test("test get post by owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts?owner=" + userId);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].owner.toString()).toBe(userId);
    }));
    test("test get post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/" + postId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(postId);
    }));
    test("test get post by id fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidId = new mongoose_1.default.Types.ObjectId().toString();
        const response = yield (0, supertest_1.default)(app).get("/posts/" + invalidId);
        expect(response.statusCode).toBe(404);
    }));
    test("test update post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedPost = {
            title: "Updated title",
            content: "Updated content",
        };
        const response = yield (0, supertest_1.default)(app)
            .put("/posts/" + postId)
            .set({
            authorization: "Bearer " + accessToken,
        })
            .send(updatedPost);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(updatedPost.title);
        expect(response.body.content).toBe(updatedPost.content);
    }));
    test("test update post by id fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidId = new mongoose_1.default.Types.ObjectId().toString();
        const updatedPost = {
            title: "Updated title",
            content: "Updated content",
        };
        const response = yield (0, supertest_1.default)(app)
            .put("/posts/" + invalidId)
            .set({
            authorization: "Bearer " + accessToken,
        })
            .send(updatedPost);
        expect(response.statusCode).toBe(404);
    }));
    test("test delete post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete("/posts/" + postId)
            .set({
            authorization: "Bearer " + accessToken,
        });
        expect(response.statusCode).toBe(200);
    }));
    test("test delete post by id fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidId = new mongoose_1.default.Types.ObjectId().toString();
        const response = yield (0, supertest_1.default)(app)
            .delete("/posts/" + invalidId)
            .set({
            authorization: "Bearer " + accessToken,
        });
        expect(response.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=posts.test.js.map