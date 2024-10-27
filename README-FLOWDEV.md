<style>
  body {
    font-family: 'Nexa', 'Arial', sans-serif;    
  }

   code, pre {
      font-size: 11px;
   }
</style>

# Development Flow

This section describes the development flow of the project, outlining the various components involved in the architecture and their interactions.

## <span style="color:#FF0000;">PAY ATTENTION: BEFORE BEGIN</span> 
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
Create the project fropm template
</div>


## 0. Initial Alternative
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">

</div>

## 1. Domain
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
</div>

## 2. Hexagon
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">

### <span style="color:#00FF00">Domain</span> 

- [class] &rarr; Define Business Domain Classes

### <span style="color:#0099FF;">Application</span> 

1. **Usecases**
   - [interface] &rarr; [PrefixName]UseCases [Services Implements UseCase(s)] - [DI - &darr;Adapter]

2. **Ports** 
   - [interface] &rarr; [PrefixNameIn/Out]Port (Adapter implements Port) - [DI - &darr;Controller]

3. **Services**
   - [class] &rarr; [PrefixName]Service
   - Implements &uarr;UseCase
   - DI/IoC &darr;PortsOut
   - DI/IoC &darr;Domain

### <span style="color:#FFA500">Adapters</span> 

1. **Ports** 
   - [interface] &rarr; [PrefixNameIn/Out]Port (Adapter implements Port) - [DI - &darr;Controller]



</div>

## Framework
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
</div>

## Api
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
Mandatory Headers
- Authorization => oAuth
- Origin        => Cors
- x-lang        => i18n
</div>

## Common
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
</div>

## Config
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
</div>

## Exceptions
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
</div>

<br/>
<br/>

# NestJS - [Put logo]

## Main
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
Example

```typescript
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { DomainFilter } from './exceptions/handler.exception';
import { NonEmptyStringPipe } from './framework/controller/qrcode.controller';

// FIXME: variables loaded to late
// Specify the path to your custom .env file
// const customEnvPath = join(__dirname, '../../../infrastructure/local.env');

// Load environment variables from the custom path
// dotenvConfig({ path: customEnvPath });

async function bootstrap() {
  // console.log(customEnvPath);
  // console.log(process.env.NODE_ENV)

  // Create the REST API application
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
    new DomainFilter()
  );  

  // Apply global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Strips out properties that are not part of the DTO
      // forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are provided
      transform: true,            // Automatically transform payloads to DTO instances
    }),
    new I18nValidationPipe(),
    new NonEmptyStringPipe(),
  );

  // Enable versioning for the REST API
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Start the REST API server
  const port = process.env.PORT || 3900;

  app.listen(port)
    .then(() => {
      console.log(`Application is running on: http://localhost:${port}`);

      // setInterval(() => {
      //   console.log(process.env.NODE_ENV);  
      //   console.log(customEnvPath);
      // } , 3000)

      
    })
    .catch((error) => {
      console.error(`Failed to start the application on port ${port}`, error);
    });
}

bootstrap();
```
</div>

## Modules
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
AppModule<br/>
- ConfigModule => Load Variables<br/>
- I18nModule => Internationalization Messages<br/>
- PrometheusModule => Metrics<br/>
- GraphQLModule => Query Language<br/>
- LoggerModule => Atis Logger<br/>
- AuthClientModule => Atis oAuth Module<br/>

```typescript
import { join } from 'path';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { APP_GUARD } from '@nestjs/core';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

import { LoggerModule, AppLogger } from '@atisiothings/laniakea-lib-audit';
import { AuthClientModule } from '@atisiothings/laniakea-lib-http/dist/modules/auth.module';
import { CorsMiddleware } from '@atisiothings/laniakea-lib-http/dist/middleware/cors.middleware'; 
import { HealthController } from '@atisiothings/laniakea-lib-http/dist/framework/controller/health.controller'; 

import { AuthGuard } from '@/security/auth.guard';
import { TrackingModule } from './modules/tracking.module';
import { PdfController } from './framework/controller/pdf.controller';
import { PdfService } from './application/services/pdf.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }), 
    PrometheusModule.register({ path: '/metrics', defaultMetrics: { enabled: false } }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: './src/framework/graphql/schemas/schema.gql',
    }),
    LoggerModule.forRoot({ level: 'debug' }),
    AuthClientModule.forRoot(
      `${process.env.AUTH_SERVER_HOST}:${process.env.AUTH_SERVER_PORT}`
    ),
    TrackingModule,
  ],
  providers: [
    AppLogger,
    {provide: APP_GUARD, useClass: AuthGuard},
    PdfService,
  ],
  exports: [AppLogger],
  controllers: [
    HealthController,
    PdfController,
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes('*/logistics');
  }
}
```

</div>

## Security
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
</div>