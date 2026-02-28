const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const app = require("../app");
const User = require("../models/User");
const Blog = require("../models/Blog");

process.env.JWT_SECRET = "test-secret";

let mongoServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
});

const makeToken = (user) =>
  jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

test("GET /api/blogs/category/:category matches category route", async () => {
  const author = await User.create({
    username: "author1",
    email: "author1@example.com",
    password: "password",
    role: "author"
  });
  await Blog.create({
    title: "Tech Post",
    content: "Content",
    image: "http://example.com/img.png",
    category: "Tech",
    author: author._id
  });

  const res = await request(app).get("/api/blogs/category/Tech");
  assert.equal(res.status, 200);
  assert.equal(Array.isArray(res.body), true);
  assert.equal(res.body.length, 1);
  assert.equal(res.body[0].category, "Tech");
});

test("POST /api/blogs/create rejects non-author users", async () => {
  const user = await User.create({
    username: "user1",
    email: "user1@example.com",
    password: "password",
    role: "user"
  });
  const token = makeToken(user);

  const res = await request(app)
    .post("/api/blogs/create")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Post",
      content: "Content",
      image: "http://example.com/img.png",
      category: "Tech"
    });

  assert.equal(res.status, 403);
});

test("PUT /api/blogs/:id cannot change author via mass assignment", async () => {
  const author1 = await User.create({
    username: "author1",
    email: "author1b@example.com",
    password: "password",
    role: "author"
  });
  const author2 = await User.create({
    username: "author2",
    email: "author2@example.com",
    password: "password",
    role: "author"
  });
  const blog = await Blog.create({
    title: "Original",
    content: "Content",
    image: "http://example.com/img.png",
    category: "Tech",
    author: author1._id
  });

  const token = makeToken(author1);
  const res = await request(app)
    .put(`/api/blogs/${blog._id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Updated",
      author: author2._id.toString()
    });

  assert.equal(res.status, 200);
  const updated = await Blog.findById(blog._id);
  assert.equal(updated.title, "Updated");
  assert.equal(updated.author.toString(), author1._id.toString());
});
