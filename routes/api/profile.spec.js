const mongoose = require("mongoose");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
const server = require("../../server");
const sinon = require("sinon");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

chai.use(chaiHttp);

const profileFields = {
  handle: "test-user",
  company: "Test Company",
  website: "www.example.com",
  location: "Anytown, US",
  bio: "Test bio",
  status: "Developer",
  githubusername: "testuser",
  youtube: "www.youtube.com/testuser",
  twitter: "www.twitter.com/testuser",
  facebook: "www.facebook.com/testuser",
  linkedin: "www.linkedin.com/testuser",
  instagram: "www.instagram.com/testuser",
  skills: "skill1,skill2,skill3"
};

describe("ProfileController", () => {
  let user;

  beforeEach(done => {
    user = new User({
      name: "Test User",
      email: "testuser@example.com",
      password: "123456"
    });

    bcrypt.genSalt(10).then(salt => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) throw err;
        user.password = hash;
        user
          .save()
          .then(user => {
            done();
          })
          .catch(err => done(err));
      });
    });
  });

  afterEach(done => {
    Profile.remove()
      .then(() => User.remove())
      .then(() => done());
  });

  describe("GET /api/profile", () => {
    let token;

    beforeEach(done => {
      chai
        .request(server)
        .post("/api/users/login")
        .send({
          email: "testuser@example.com",
          password: "123456"
        })
        .end((err, res) => {
          if (err) return done(err);
          if (res.body.success) {
            token = res.body.token;
            done();
          } else {
            return done(res.body);
          }
        });
    });

    it("should return status code 404 if no profile", done => {
      chai
        .request(server)
        .get("/api/profile")
        .set("Authorization", token)
        .end((err, res) => {
          if (err) return done(err);

          res.should.have.status(404);
          done();
        });
    });

    it("should return the user profile", done => {
      chai
        .request(server)
        .post("/api/profile")
        .set("Authorization", token)
        .send(profileFields)
        .then(res => {
          res.should.have.status(200);
        })
        .then(() => {
          chai
            .request(server)
            .get("/api/profile")
            .set("Authorization", token)
            .end((err, res) => {
              if (err) return done(err);

              res.should.have.status(200);
              res.body.should.have.property("handle");
              res.body.should.have.property("company");
              res.body.should.have.property("website");
              res.body.should.have.property("location");
              res.body.should.have.property("bio");
              res.body.should.have.property("status");
              res.body.should.have.property("githubusername");
              res.body.should.have.property("social");
              res.body.should.have.property("skills");

              done();
            });
        });
    });
  });
});
