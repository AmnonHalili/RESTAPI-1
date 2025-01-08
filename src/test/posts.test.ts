import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import userModel from "../models/user_model";
import { Express } from "express";

let app: Express;

type User = {
    email: string;
    password: string;
    accessToken?: string;
    refreshToken?: string;
    _id?: string;
}

const testUser: User = {
    email: "user1@test.com",
    password: "123456",
};

let accessToken: string;
let userId: string;
let postId: string;

const testPost = {
    title: "Test title",
    content: "Test content",
    owner: null as string | null,
};

beforeAll(async () => {
  app = await initApp();
  await postModel.deleteMany();
  await userModel.deleteMany();
  
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
  
  accessToken = loginResponse.body.accessToken;
  userId = loginResponse.body._id;
  
  testPost.owner = userId;
});

afterAll(async () => {
    await mongoose.connection.close();
});

const invalidPost = {
    content: "test content",
};

describe("Posts test suite", () => {
    test("post test get All posts", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    test("Test Adding new post", async () => {
        const response = await request(app)
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
    });

    test("Test Adding invalid post", async () => {
        const response = await request(app)
            .post("/posts")
            .set({
                authorization: "Bearer " + accessToken,
            })
            .send(invalidPost);
        expect(response.statusCode).not.toBe(201);
    });

    test("test get all posts after adding", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    test("test get post by owner", async () => {
        const response = await request(app).get("/posts?owner=" + userId);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].owner.toString()).toBe(userId);
    });

    test("test get post by id", async () => {
        const response = await request(app).get("/posts/" + postId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(postId);
    });

    test("test get post by id fail", async () => {
        const invalidId = new mongoose.Types.ObjectId().toString();
        const response = await request(app).get("/posts/" + invalidId);
        expect(response.statusCode).toBe(404);
    });

    test("test update post by id", async () => {
        const updatedPost = {
            title: "Updated title",
            content: "Updated content",
        };
        const response = await request(app)
            .put("/posts/" + postId)
            .set({
                authorization: "Bearer " + accessToken,
            })
            .send(updatedPost);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(updatedPost.title);
        expect(response.body.content).toBe(updatedPost.content);
    });

    test("test update post by id fail", async () => {
        const invalidId = new mongoose.Types.ObjectId().toString();
        const updatedPost = {
            title: "Updated title",
            content: "Updated content",
        };
        const response = await request(app)
            .put("/posts/" + invalidId)
            .set({
                authorization: "Bearer " + accessToken,
            })
            .send(updatedPost);
        expect(response.statusCode).toBe(404);
    });

    test("test delete post by id", async () => {
        const response = await request(app)
            .delete("/posts/" + postId)
            .set({
                authorization: "Bearer " + accessToken,
            });
        expect(response.statusCode).toBe(200);
    });

    test("test delete post by id fail", async () => {
        const invalidId = new mongoose.Types.ObjectId().toString();
        const response = await request(app)
            .delete("/posts/" + invalidId)
            .set({
                authorization: "Bearer " + accessToken,
            });
        expect(response.statusCode).toBe(404);
    });
});