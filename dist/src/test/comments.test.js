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
const Comments_model_1 = __importDefault(require("../models/Comments_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const posts_model_1 = __importDefault(require("../models/posts_model"));
let app;
const testUser = {
    email: "user1@test.com",
    password: "123456",
};
const testComment = {
    comment: "test content",
    postId: "", // Will be set dynamically after creating a post
    owner: null,
};
let accessToken;
let userId;
let commentId;
let postId; // Added for postId to create comment under a valid post
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    console.log('beforeAll');
    yield Comments_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany();
    yield posts_model_1.default.deleteMany();
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
    // Check if the token is returned under 'token' or 'accessToken'
    accessToken = loginResponse.body.token || loginResponse.body.accessToken;
    expect(accessToken).toBeDefined(); // Ensure that token exists
    userId = loginResponse.body._id;
    // Create a post to link to the comment
    const postResponse = yield (0, supertest_1.default)(app)
        .post("/posts")
        .set({
        authorization: "Bearer " + accessToken,
    })
        .send({ title: "Test Post", content: "Content for post" });
    expect(postResponse.statusCode).toBe(201);
    postId = postResponse.body._id;
    // Set owner for test comment
    testComment.owner = userId;
    testComment.postId = postId; // Set valid postId for comment
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('afterAll');
    yield mongoose_1.default.connection.close();
}));
const invalidComment = {
    comment: "test content",
    postId: "", // Invalid postId (empty)
};
describe("Comments test suite", () => {
    test("Comment test get All Comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    }));
    test("test adding a new Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/comments")
            .set({
            authorization: "Bearer " + accessToken,
        })
            .send(testComment);
        expect(response.statusCode).toBe(201);
        expect(response.body.comment).toBe(testComment.comment);
        expect(response.body.postId).toBe(testComment.postId);
        expect(response.body.owner).toBe(testComment.owner);
        commentId = response.body._id;
    }));
    test("test adding invalid Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/comments")
            .set({
            authorization: "Bearer " + accessToken,
        })
            .send(invalidComment);
        expect(response.statusCode).not.toBe(201);
    }));
    test("test get all Comments after adding", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    }));
    test("test get Comment by owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments?owner=" + testComment.owner);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].owner).toBe(testComment.owner);
    }));
    test("test get Comment by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/" + commentId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(commentId);
    }));
    test("test get Comment by id fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/67460dffc9211d4f36225657");
        expect(response.statusCode).toBe(404);
    }));
    test("test update Comment by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedComment = {
            comment: "updated content",
        };
        const response = yield (0, supertest_1.default)(app)
            .put("/comments/" + commentId)
            .set({
            authorization: "Bearer " + accessToken,
        })
            .send(updatedComment);
        expect(response.statusCode).toBe(200);
        expect(response.body.comment).toBe(updatedComment.comment);
    }));
    test("test update Comment by id fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidId = new mongoose_1.default.Types.ObjectId().toString();
        const updatedComment = {
            comment: "updated content",
        };
        const response = yield (0, supertest_1.default)(app)
            .put("/comments/" + invalidId)
            .set({
            authorization: "Bearer " + accessToken,
        })
            .send(updatedComment);
        expect(response.statusCode).toBe(404);
    }));
    test("test delete Comment by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete("/comments/" + commentId)
            .set({
            authorization: "Bearer " + accessToken,
        });
        expect(response.statusCode).toBe(200);
    }));
    test("test delete Comment by id fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidId = new mongoose_1.default.Types.ObjectId().toString();
        const response = yield (0, supertest_1.default)(app)
            .delete("/comments/" + invalidId)
            .set({
            authorization: "Bearer " + accessToken,
        });
        expect(response.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=comments.test.js.map