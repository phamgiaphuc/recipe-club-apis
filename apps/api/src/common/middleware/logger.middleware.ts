import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  constructor(private readonly configService: ConfigService) {}

  use(req: Request, _: Response, next: NextFunction) {
    let bodyMsg: string = "";
    const { method, originalUrl, body } = req;
    if (
      Object.keys(body).length > 0 &&
      this.configService.get<string>("NODE_ENV") === "developement"
    ) {
      bodyMsg = `-> BODY: ${JSON.stringify(body)}}`;
    }
    this.logger.log(`${method} ${originalUrl} ${bodyMsg || ""}`);
    next();
  }
}
