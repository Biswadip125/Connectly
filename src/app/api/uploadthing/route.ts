import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Correct export for App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
