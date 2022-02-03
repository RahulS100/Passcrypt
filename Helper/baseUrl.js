const baseUrl =  process.env.NODE_ENV !== "production" ? "http://localhost:3000" : "Remote Url of your running app";

module.exports = baseUrl;