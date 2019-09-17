// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../server.js';
const mockFS = require('mock-fs');
// Configure chai
chai.use(chaiHttp);
chai.should();

// Test to get all students record
it("video-selector returns an array of video assets", (done) => {

    chai.request(app)
        .get('/video-selector')
        .end((err, res) => {
            expect(res.status).toBe(200)
            expect(res.body.length).toBeGreaterThan(0)
            done();
        });

});
