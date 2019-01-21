const mongoose = require('mongoose');
const User = require('../../models/User');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const server = require('../../server');

chai.use(chaiHttp);

describe('Create Account, Login and Check Token', () => {
  // Empty the DB before each test
  beforeEach(done => {
    User.remove({}, err => {
      done();
    });
  });

  afterEach(done => {
    User.remove({}, err => {
      done();
    });
  });

  describe('POST /api/users/register', () => {
    it('should register, login, and check token', done => {
      chai
        .request(server)
        .post('/api/users/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: '123456',
          password2: '123456'
        })
        .end((err, res) => {
          if (err) console.log(err);

          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('name');
          res.body.should.have.property('email');
          res.body.should.have.property('avatar');
          res.body.should.have.property('date');

          chai
            .request(server)
            .post('/api/users/login')
            .send({ email: 'test@example.com', password: '123456' })
            .end((err, res) => {
              if (err) console.log(err);
              expect(res.body.success).to.be.true;
              res.body.should.have.property('token');
              const token = res.body.token;

              chai
                .request(server)
                .get('/api/users/current')
                .set('Authorization', token)
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.an('object');
                  res.body.should.have.property('id');
                  res.body.should.have.property('name');
                  res.body.should.have.property('email');

                  done();
                });
            });
        });
    });
  });
});
