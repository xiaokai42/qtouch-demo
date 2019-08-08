const lf = require("localforage");

const instance = lf.createInstance({
  name: "qtouch"
});

export default instance;
