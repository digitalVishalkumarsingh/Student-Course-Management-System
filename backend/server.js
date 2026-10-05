require("dotenv").config();

const app = require("./app");
const { testDatabaseConnection } = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  const databaseConnected = await testDatabaseConnection();

  if (!databaseConnected) {
    console.error("Server stopped because database connection failed.");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
