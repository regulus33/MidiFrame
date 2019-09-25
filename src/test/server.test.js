// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';

const app = require('../../server.js')
// Configure chai
chai.use(chaiHttp);
chai.should();

it("video-selector returns an array of video assets", (done) => {

    chai.request(app)
        .get('/video-selector')
        .end((err, res) => {
            expect(res.status).toBe(200)
            expect(res.body.length).toBeGreaterThan(0)
            done();
        });

});
