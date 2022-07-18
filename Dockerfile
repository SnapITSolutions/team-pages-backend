FROM node:16-alpine AS base

WORKDIR /opt/app
COPY package.json /opt/app

RUN npm install

FROM base AS build

# This is here to cause an error if the user forgot to make an .env
COPY . /opt/app

RUN sh ./scripts/build.sh

FROM base as production

ENV DATABASE_URL="postgres://postgres:supersecurepassword@postgres/postgres?schema=snapitteam"
ENV PORT="3001"
ENV SERVER_MODE="dev"
ENV TOKEN="DEV_TOKEN"

COPY --from=build /opt/app/package.json /opt/app/package.json
COPY --from=build /opt/app/node_modules /opt/app/node_modules
COPY --from=build /opt/app/build /opt/app/build
COPY --from=build /opt/app/scripts /opt/app/scripts
COPY --from=build /opt/app/prisma /opt/app/prisma

CMD sh ./scripts/start.sh
