import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import pinoHttp = require("pino-http");
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: any) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: any) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Global error handler
app.use(
  (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const msg = err instanceof Error ? err.message : String(err);

    if (
      msg.includes("429") ||
      msg.includes("Too Many Requests") ||
      msg.includes("Quota exceeded")
    ) {
      res.status(429).json({
        error: "AI rate limit reached",
        message:
          "The Gemini API free-tier quota was exceeded. Please wait a moment and try again.",
      });
      return;
    }

    logger.error({ err }, "Unhandled error");
    res.status(500).json({ error: "Internal server error" });
  },
);

export default app;
