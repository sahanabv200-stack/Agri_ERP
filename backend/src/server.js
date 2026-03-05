const env = require("./config/env");
const app = require("./app");

app.listen(env.PORT, () => {
  console.log(`Vertex Agri Backend running on http://localhost:${env.PORT}`);
});
