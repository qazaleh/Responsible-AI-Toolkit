FROM node:20-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json package-lock.json turbo.json /app/
COPY apps/web/package.json /app/apps/web/
COPY packages/ui/package.json /app/packages/ui/

RUN npm install --legacy-peer-deps

COPY . /app

EXPOSE 30010

ENTRYPOINT ["npm", "start"]
