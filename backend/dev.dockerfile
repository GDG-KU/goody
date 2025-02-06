FROM node:20-alpine as builder
ENV TZ=Asia/Seoul
RUN apk add --no-cache openssl  # openssl1.1 -> openssl

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn global add dotenv-cli
RUN yarn prisma generate
RUN yarn build

FROM node:20-alpine as runner
ENV TZ=Asia/Seoul
ENV PORT=8080
ENV NODE_ENV=dev

WORKDIR /usr/src/app

# OpenSSL 설치
RUN apk add --no-cache openssl 

# GCP 서비스 계정 키 파일 복사
COPY goody-447505-1e4bb7f285fd.json ./goody-447505-1e4bb7f285fd.json

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/.dev.env ./.dev.env

EXPOSE 8080

CMD ["node", "dist/main.js"]