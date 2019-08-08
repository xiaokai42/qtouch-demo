const localForage = require("localforage");
const lf = {
  install(Vue: any, options: any) {
    Vue.prototype.$lf = new Vue({
      name: "lf",
      methods: {
        getItem(key: any) {
          return new Promise((resolve, reject) => {
            localForage
              .getItem(key)
              .then((value: any) => {
                resolve(value);
              })
              .catch((err: any) => {
                reject(err);
              });
          });
        },
        setItem(key: any, value: any) {
          return new Promise((resolve, reject) => {
            localForage
              .setItem(key, value)
              .then((value: any) => {
                resolve(value);
              })
              .catch((err: any) => {
                reject(err);
              });
          });
        },
        removeItem(key: any) {
          return new Promise((resolve, reject) => {
            localForage
              .removeItem(key)
              .then(() => {
                resolve();
              })
              .catch((err: any) => {
                reject(err);
              });
          });
        },
        clear() {
          return new Promise((resolve, reject) => {
            localForage
              .clear()
              .then(() => {
                resolve();
              })
              .catch((err: any) => {
                reject(err);
              });
          });
        },
        length() {
          return new Promise((resolve, reject) => {
            localForage
              .length()
              .then((numberOfKeys: any) => {
                resolve(numberOfKeys);
              })
              .catch((err: any) => {
                reject(err);
              });
          });
        },
        key(keyIndex: any) {
          return new Promise((resolve, reject) => {
            localForage
              .key(keyIndex)
              .then((keyName: any) => {
                resolve(keyName);
              })
              .catch((err: any) => {
                reject(err);
              });
          });
        },
        keys() {
          return new Promise((resolve, reject) => {
            localForage
              .keys()
              .then((keys: any) => {
                resolve(keys);
              })
              .catch((err: any) => {
                reject(err);
              });
          });
        },
        iterate() {
          return new Promise((resolve, reject) => {
            localForage
              .iterate((value: any, key: any, iterationNumber: any) => {
                resolve([value, key, iterationNumber]);
              })
              .then((result: any) => {
                resolve(result);
              })
              .catch((err: any) => {
                // This code runs if there were any errors
                reject(err);
              });
          });
        },
        setDriver(driverName: any) {
          return new Promise((resolve, reject) => {
            resolve(localForage.setDriver(driverName));
          });
        },
        config(options: any) {
          return new Promise((resolve, reject) => {
            resolve(localForage.config(options));
          });
        },
        createInstance(options: any) {
          return new Promise((resolve, reject) => {
            resolve(localForage.createInstance(options));
          });
        }
      }
    });
  }
};
export default lf;
