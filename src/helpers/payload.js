const successMessage = { success: true };
const errorMessage = { success: false };
const status = {
    success: 200,
    error: 500,
    notfound: 404,
    unauthorized: 401,
    conflict: 409,
    created: 201,
    bad: 400,
    nocontent: 204
};

module.exports = {
    successMessage,
    errorMessage,
    status
};