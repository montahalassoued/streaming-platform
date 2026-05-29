import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:8083",
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Streaming Platform API")
    .setDescription("API documentation for the streaming platform")
    .setVersion("1.0")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "bearer-auth")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document, { swaggerOptions: { persistAuthorization: true } });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

void bootstrap();
