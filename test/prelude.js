import chai from "chai";
import spies from "chai-spies";

chai.use(spies);

global.chai = chai;
global.expect = chai.expect;
