FROM node:20-alpine

#작업디렉토리로 이동한다
WORKDIR src/app

COPY .env.local ./

#의존성 설치를 위한 파일들을 복사한다
COPY package.json yarn.lock ./

#패키지 설치
RUN yarn install

#소스코드 복사
COPY ./ ./

#빌드
RUN yarn run build

#컨테이너 노출 필드
EXPOSE 3000

#컨테이너 실행시 명령
CMD ["yarn", "start"]

