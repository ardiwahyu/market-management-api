const pool = require("./pool");

const isolateClientPool = () => {
    console.log("connect");
    return pool.connect();
}

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    })
}

module.exports = { isolateClientPool, query };