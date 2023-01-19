import cors from "@fastify/cors";
import Fastify from "fastify";
import { AppRoutes } from "./routes";

const app = Fastify();

app.register(cors);
app.register(AppRoutes);

app.listen({
  port: 3333,

}, (err, address) => {
  if (err) {
    console.error(err);
  }
  console.log(`🚀 Server listening at ${address}`);
});