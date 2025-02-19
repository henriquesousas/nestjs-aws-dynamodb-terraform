FROM node:22-alpine3.19

WORKDIR /usr/src/app

# COPY package.json ./
# COPY package-lock.json ./
RUN npm install -g @nestjs/cli
# RUN npm install 

COPY . .
# RUN npm run build 
CMD [ "tail", "-f", "/dev/null" ]