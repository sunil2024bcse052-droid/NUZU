import { app } from "./app";
import { env } from "./config/env";

app.listen(env.port, () => {
  console.log(`Nuzu backend running on http://localhost:${env.port}`);
});