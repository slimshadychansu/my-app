# 빌드 단계를 위한 Node 이미지 사용
FROM node:18 as build

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 배포 단계
FROM nginx:alpine

# Nginx 설정 파일 복사 (필요한 경우)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 결과물을 Nginx 서버 루트로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]