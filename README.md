CHECK ALL PROCEEDS/RESOURCES THAT MUST BE INCLUDED FOR MICROSERVICES

# laniakea-platform

Laniakea platform is a conceptual project that likely revolves around providing a PaaS solution. Modular platform using various technologies like NestJS, TypeScript, Grunt, and potentially SCSS for front-end styling.

### <span style="color:#0099FF; font-weight: bolder;">Kubernetes</span>

## Namespaces

### <span style="color:#0099FF; font-weight: bolder">Docker</span>

docker-compose build --no-cache <service-a> <service-b>
docker-compose up -d --build servicea serviceb
docker-compose up -d --build --no-cache servicea serviceb

docker compose restart servicea

docker-compose up -d --build laniakea-mcs-auth

REMOVE \_files...

find . -name '.\_\*' -delete

<!---
SETUP ENVIRONMENT
chmod +x setup-podman.sh
./setup-podman.sh

chmod +x setup-lania.sh
./setup-lania.sh
source ~/.zshrc


[ -L ~/external-ssd ] && rm ~/external-ssd && echo "Symlink ~/external-ssd removed"

-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

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

delete tags: git tag -l | xargs -n 1 git push origin --delete













ASCII ART
https://patorjk.com/software/taag/#p=display&f=Graffiti&t=Type%20Something%20



Docker
docker network inspect bridge
docker login registry.hub.docker.com


docker compose -f docker-compose.yml up -d
docker compose -f docker-compose.yml up -d <service1> <service2> <service...>


docker compose down -v

docker image prune
docker image prune --all


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

<!--
LIBS
npx eslint .
npx grunt clean
DEBUG=eslint:* npx grunt eslint

npx grunt check --type=breaking
npx grunt check --type=feat
npx grunt check --type=fix

npx compodoc -p tsconfig.json -s
npm install eslint@latest --save-dev --legacy-peer-deps //bypass the peer dependency resolutio
npm install eslint@latest eslint-plugin-import@latest eslint-config-airbnb-base@latest --save-dev --legacy-peer-deps


npm cache clean --force
npm access list packages
npm access list collaborators [<package> [<user>]]

npm publish --access public
npm publish --access public --verbose
npm unpublish @atisiothings/lib-core-domain@0.0.6
npm unpublish @atisiothings/lib-core-domain@0.0.6 --force


// https://pt.stackoverflow.com/questions/22431/express%C3%A3o-regular-para-rg



git config pull.rebase false
git merge origin/develop --allow-unrelated-histories
git credential-osxkeychain erase
host=github.com
-->

<!--
LIBS CONT...

npx eslint .
npx grunt clean
DEBUG=eslint:* npx grunt eslint

npx grunt check --type=breaking
npx grunt check --type=feat
npx grunt check --type=fix

npx compodoc -p tsconfig.json -s
npm install eslint@latest --save-dev --legacy-peer-deps //bypass the peer dependency resolutio
npm install eslint@latest eslint-plugin-import@latest eslint-config-airbnb-base@latest --save-dev --legacy-peer-deps


npm cache clean --force
npm access list packages
npm access list collaborators [<package> [<user>]]

npm publish --access public
npm publish --access public --verbose
npm unpublish @atisiothings/lib-core-domain@0.0.6
npm unpublish @atisiothings/lib-core-domain@0.0.6 --force


// https://pt.stackoverflow.com/questions/22431/express%C3%A3o-regular-para-rg

# GIT
git remote add origin // git init
git remote set-url origin
git merge origin/develop --allow-unrelated-histories
git credential-osxkeychain erase
host=github.com

error: RPC failed; HTTP 400 curl 22 The requested URL returned error: 400
git config --global http.postBuffer 157286400


# DEV - GRUNT
npx grunt clean --projects=laniakea-lib-database,laniakea-lib-central

npx grunt --projects=laniakea-lib-central --build-type=ts
npx grunt deploy --projects=laniakea-lib-central --build-type=ts

npx grunt --projects=laniakea-lib-database --build-type=nest
npx grunt package --projects=laniakea-lib-database --build-type=nest
npx grunt --projects=laniakea-lib-database,laniakea-lib-http --build-type=nest

#CHECK Deps
npm install -g npm-check
npm-check

#DATA GENERATOR
https://generadordata.com/



IoT
PCB: https://www.pcb-hero.com/?utm_source=kitty&utm_medium=Linkedin&utm_campaign=post20241011152216&utm_content=native_video






>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
I MPORTANT
# Yarn migration

>> Para nvm, node, npm, yarn (.zshrc)
# Config Node Version Manager
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Carrega o nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # Autocompletar opcional
nvm use 22.14.0 > /dev/null
corepack enable
corepack prepare yarn@stable --activate


### Local Development
rm -rf node_modules .yarn/cache yarn.lock
yarn grunt --workspace=libs --projects=laniakea-lib-core --build-type=ts (default)
 yarn grunt local --workspace=libs --projects=laniakea-lib-metrics --build-type=nest

>> to publish must be logged

VERDACCIO
npm login --registry http://localhost
npm adduser --registry http://localhost/

yarn install http://localhost:4873 // Verdaccio repo

yarn install
yarn lint
yarn test

yarn npm login --scope ix
yarn remove @ix/laniakea-lib-core
yarn constraints check


TSCONFIG
npx sort-tsconfig
npx sort-tsconfig microservices/tsconfig.json -w
CI/CD: npx sort-tsconfig microservices/tsconfig.json






# Verdaccio
No terminal do projeto onde está a lib:

npm adduser --registry http://localhost:4873
Insira:
  Username: por ex. devuser
  Password: senha
  Email: qualquer

Depois publique:
  npm publish --registry http://localhost:4873





# Useful commends
tree -L 2 -I 'node_modules|dist|.git' .
tree -L 4 -I 'node_modules|app-platform|frontend|libs|microservices|template' .


yarn add -D @nestjs/cli prettier eslint-plugin-prettier eslint-config-prettier





HOW TO CINTINUE TO WORK
1. lcp_local in terminal
  1.1 docker compose # subir infra
2. Start verdaccion from scrach (Optional)
  2.1 Remove all libs (Base and Backend)
repo-local-clean.sh (optional recreat verdaccio from scrach)
./repo-local-clean.sh \
  @ix/laniakea-lib-audit \
  @ix/laniakea-lib-core \
  @ix/laniakea-lib-encode \
  @ix/laniakea-lib-commons \
  @ix/laniakea-lib-central \
  @ix/laniakea-lib-database \
  @ix/laniakea-lib-enterprise \
  @ix/laniakea-lib-logistics \
  @ix/laniakea-lib-metrics \
  @ix/laniakea-lib-sec-comm && yarn install

  OPTIONAL
  CLEAR MODULES AND YARN - FIRST HAS TO REMOVE FROM package.json
  rm -rf .yarn/cache yarn.lock node_modules


  2.2 Install backend base libs and adjust range
  yarn grunt local publish-local \
    --workspace=libs \
    --projects=laniakea-lib-audit,laniakea-lib-core,laniakea-lib-encode \
    --build-type=nest
  ./yarn-add-range.sh \
    "@ix/laniakea-lib-audit:>=1.0.0-alpha.0 <2.0.0," \
    "@ix/laniakea-lib-core:>=1.0.0-alpha.0 <2.0.0," \
    "@ix/laniakea-lib-encode:>=1.0.0-alpha.0 <2.0.0"

  2.3 Install backend core libs
  yarn grunt local publish-local \
    --workspace=libs \
    --projects=laniakea-lib-commons,\
laniakea-lib-central,\
laniakea-lib-database,\
laniakea-lib-metrics,\
laniakea-lib-sec-comm \
    --build-type=nest

  ./yarn-add-range.sh \
    "@ix/laniakea-lib-commons:>=1.0.0-alpha.0 <2.0.0," \
    "@ix/laniakea-lib-central:>=1.0.0-alpha.0 <2.0.0," \
    "@ix/laniakea-lib-database:>=1.0.0-alpha.0 <2.0.0," \
    "@ix/laniakea-lib-metrics:>=1.0.0-alpha.0 <2.0.0," \
    "@ix/laniakea-lib-sec-comm:>=1.0.0-alpha.0 <2.0.0"

  2.4 Install backend enterprise libs
  yarn grunt local publish-local \
    --workspace=libs \
    --projects=laniakea-lib-enterprise \
    --build-type=nest

  ./yarn-add-range.sh "@ix/laniakea-lib-enterprise:>=1.0.0-alpha.0 <2.0.0"

  2.5 Install backend business libs
  yarn grunt local publish-local \
    --workspace=libs \
    --projects=laniakea-lib-logistics \
    --build-type=nest

  ./yarn-add-range.sh "@ix/laniakea-lib-logistics:>=1.0.0-alpha.0 <2.0.0"

  3.1 Standalone install (optional)
  yarn grunt eslintTask \
    --workspace=libs \
    --projects=laniakea-lib-encode \
    --build-type=nest

  yarn grunt local publish-local \
    --workspace=libs \
    --projects=laniakea-lib-encode \
    --build-type=nest
  ./yarn-add-range.sh "@ix/laniakea-lib-metrics:>=1.0.0-alpha.0 <2.0.0"


TO RUN APP
2. lcp_local && npm run start:debug




  "workspaces": [
    "libs/*",
    "!libs/iot-lib-device",
    "!libs/iot-lib-recycle",
    "!libs/laniakea-lib-audit",
    "!libs/laniakea-lib-commons",
    "!libs/laniakea-lib-central",
    "!libs/laniakea-lib-core",
    "!libs/laniakea-lib-database",
    "!libs/laniakea-lib-encode",
    "!libs/laniakea-lib-enterprise",
    "!libs/laniakea-lib-sec-comm",
    "!libs/laniakea-lib-location",
    "!libs/laniakea-lib-logistics",
    "!libs/laniakea-lib-metrics",
    "!libs/lib-vendor-atis"
  ],

  yarn grunt eslintTask \
    --workspace=libs \
    --projects=laniakea-lib-commons \
    --build-type=nest


 yarn grunt local \
    --workspace=libs \
    --projects=laniakea-lib-core \
    --build-type=nest


-->
