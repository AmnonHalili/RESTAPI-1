import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentModel from "../models/Comments_model";
import userModel from "../models/user_model";
import postModel from "../models/posts_model";
import { Express } from "express";

let app: Express;

type User = {
    email: string;
    password: string;
    accessToken?: string;
    refreshToken?: string;
    _id?: string;
};

const testUser: User = {
    email: "user1@test.com",
    password: "123456",
};

const testComment = {
    comment: "test content",
    postId: "", // Will be set dynamically after creating a post
    owner: null as string | null,
};

let accessToken: string;
let userId: string;
let commentId: string;
let postId: string; // Added for postId to create comment under a valid post

beforeAll(async () => {
    app = await initApp();
    console.log('beforeAll');
    await commentModel.deleteMany();
    await userModel.deleteMany();
    await postModel.deleteMany();
    
    // Register user
    const registerResponse = await request(app)
        .post("/users/register")
        .send(testUser);
    expect(registerResponse.statusCode).toBe(201);

    // Login user
    const loginResponse = await request(app)
        .post("/users/login")
        .send(testUser);
    expect(loginResponse.statusCode).toBe(200);
    
    // Check if the token is returned under 'token' or 'accessToken'
    accessToken = loginResponse.body.token || loginResponse.body.accessToken;
    expect(accessToken).toBeDefined(); // Ensure that token exists
    
    userId = loginResponse.body._id;
    
    // Create a post to link to the comment
    const postResponse = await request(app)
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
});

afterAll(async () => {
    console.log('afterAll');
    await mongoose.connection.close();
});

const invalidComment = {
    comment: "test content",
    postId: "", // Invalid postId (empty)
};

describe("Comments test suite", () => {
    test("Comment test get All Comments", async () => {
        const response = await request(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    test("test adding a new Comment", async () => {
        const response = await request(app)
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
    });

    test("test adding invalid Comment", async () => {
        const response = await request(app)
            .post("/comments")
            .set({
                authorization: "Bearer " + accessToken,
            })
            .send(invalidComment);

        expect(response.statusCode).not.toBe(201);
    });

    test("test get all Comments after adding", async () => {
        const response = await request(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    test("test get Comment by owner", async () => {
        const response = await request(app).get("/comments?owner=" + testComment.owner);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].owner).toBe(testComment.owner);
    });

    test("test get Comment by id", async () => {
        const response = await request(app).get("/comments/" + commentId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(commentId);
    });

    test("test get Comment by id fail", async () => {
        const response = await request(app).get("/comments/67460dffc9211d4f36225657");
        expect(response.statusCode).toBe(404);
    });

    test("test update Comment by id", async () => {
        const updatedComment = {
            comment: "updated content",
        };
        const response = await request(app)
            .put("/comments/" + commentId)
            .set({
                authorization: "Bearer " + accessToken,
            })
            .send(updatedComment);
        expect(response.statusCode).toBe(200);
        expect(response.body.comment).toBe(updatedComment.comment);
    });

    test("test update Comment by id fail", async () => {
        const invalidId = new mongoose.Types.ObjectId().toString();
        const updatedComment = {
            comment: "updated content",
        };
        const response = await request(app)
            .put("/comments/" + invalidId)
            .set({
                authorization: "Bearer " + accessToken,
            })
            .send(updatedComment);
        expect(response.statusCode).toBe(404);
    });

    test("test delete Comment by id", async () => {
        const response = await request(app)
            .delete("/comments/" + commentId)
            .set({
                authorization: "Bearer " + accessToken,
            });
        expect(response.statusCode).toBe(200);
    });

    test("test delete Comment by id fail", async () => {
        const invalidId = new mongoose.Types.ObjectId().toString();
        const response = await request(app)
            .delete("/comments/" + invalidId)
            .set({
                authorization: "Bearer " + accessToken,
            });
        expect(response.statusCode).toBe(404);
    });
});
