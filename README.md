CHECK ALL PROCEEDS/RESOURCES THAT MUST BE INCLIDED FOR MICROSERVICES

# laniakea-platform
Laniakea platform is a conceptual project that likely revolves around providing a PaaS solution. Modular platform using various technologies like NestJS, TypeScript, Grunt, and potentially SCSS for front-end styling.

PCB: https://www.pcb-hero.com/?utm_source=kitty&utm_medium=Linkedin&utm_campaign=post20241011152216&utm_content=native_video

docker-compose build --no-cache <service-a> <service-b>
docker-compose up -d --build servicea serviceb
docker-compose up -d --build --no-cache servicea serviceb

docker compose restart servicea



docker-compose up -d --build laniakea-mcs-auth


find . -name '._*' -delete





<!---
DOC
npx compodoc -p tsconfig.json -s -w 

LOG
https://levelup.gitconnected.com/error-handling-and-logging-in-nestjs-best-practices-ecc871ade7d7

GUARDS
// https://github.com/ThomasOliver545/Blog-with-NestJS-and-Angular/blob/master/api/src/blog/service/blog.service.ts
// 1. https://docs.nestjs.com/guards
// 2. https://docs.nestjs.com/security/authentication
// 3. https://docs.nestjs.com/security/authorization


GIT

// display and sort Git branches by their last commit date
git for-each-ref --sort=-committerdate refs/heads/ --format="%(committerdate:short) %(refname:short)"














ASCII ART
https://patorjk.com/software/taag/#p=display&f=Graffiti&t=Type%20Something%20



Docker
docker login registry.hub.docker.com 


docker compose -f docker-compose.yml up -d
docker compose -f docker-compose.yml up -d <service1> <service2> <service...>


docker compose down -v


Cloud Stacks

GCP

Datastore
    https://hub.docker.com/r/mtlynch/firestore-emulator/
    https://joemugen.medium.com/how-to-develop-and-test-with-google-cloud-datastore-running-locally-7ebbc659b595
    https://stackoverflow.com/questions/54661757/google-datastore-unable-to-connect-inside-docker
    https://medium.com/@crip.popescu/running-gcp-pubsub-emulator-on-a-local-docker-environment-735c7f1e1f41
    https://cloud.google.com/datastore/docs/tools/datastore-emulator
    GUI:
        - datastore: https://github.com/GabiAxel/google-cloud-gui




Archtecture
https://learn.microsoft.com/en-us/azure/architecture/patterns/sharding

Silo - divide to conquer a PaaS platform




Database
    https://medium.com/@kumarabhishek0388/architecting-for-scale-part-1-load-balancing-sharding-and-replication-strategies-e6934e9e38f8

MongoDB
https://www.geeksforgeeks.org/how-to-seed-a-mongodb-database-using-docker-compose/



// OpenApi
// https://rehmat-sayany.medium.com/integrating-swagger-with-nestjs-a-step-by-step-guide-abd532743c43





BADGES
Como usar ícones e badges:
Markdown: Badges são frequentemente adicionados a arquivos README.md usando Markdown. Aqui está um exemplo de como adicionar um badge para a versão do NPM:

markdown
Copy code
![NPM Version](https://img.shields.io/npm/v/@nestjs/core.svg)
HTML: Você também pode usar HTML para adicionar badges:

html
Copy code
<a href="https://www.npmjs.com/package/@nestjs/core" target="_blank">
   <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version">
</a>
Sites para criar e personalizar badges:
Shields.io: Este é o site mais popular para criar badges customizados. Você pode escolher entre uma variedade de ícones, cores, e estilos. Você pode até mesmo criar badges personalizados que mostrem informações específicas sobre seu projeto.

BadgeMaker: Outra ferramenta útil para criar badges com suporte a várias integrações, como NPM, CI/CD, GitHub, etc.

SimpleIcons: Fornece ícones SVG para várias marcas populares, que você pode usar como parte de seus badges.

Exemplo de como criar um badge customizado no Shields.io:
Acesse o Shields.io. 
Escolha o estilo e o tipo de badge que deseja criar.
Customize o texto, cor, ícone, e outros parâmetros.
O site irá gerar a URL do badge, que você pode adicionar ao seu README.md usando Markdown ou HTML.


https://shields.io/
https://badgen.net/
https://simpleicons.org/

--->                                                                               
