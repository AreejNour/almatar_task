require("dotenv").config();
export default {
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  corsUrl: process.env.corsUrl,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    name: process.env.DB_NAME,
  },
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
  },
};
