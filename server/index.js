import "./env.js";
import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3001);
const app = createApp();

const server = app.listen(port, () => {
  console.log(`Portfolio API listening on http://localhost:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    console.log(`\n${signal} received — shutting down.`);
    server.close(() => process.exit(0));
  });
}
