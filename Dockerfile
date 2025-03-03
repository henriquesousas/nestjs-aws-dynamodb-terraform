FROM public.ecr.aws/docker/library/node:20-alpine AS development
ENV NODE_ENV development

WORKDIR /app

COPY package.json .
RUN npm install
RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

COPY . .

EXPOSE 8000

CMD [ "npm", "start" ]