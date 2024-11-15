# FROM node:18 AS build
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install
# COPY . .
# ARG REACT_APP_API_BASE_URL
# ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
# RUN npm run build

# FROM node:18-slim AS production
# WORKDIR /app
# COPY --from=build /app/build /app/build
# RUN npm install -g serve
# EXPOSE 3000
# CMD ["serve", "-s", "build"]



# Build stage
FROM node:18 AS build
WORKDIR /app

# Paket dosyalarını kopyalayıp bağımlılıkları kuruyoruz
COPY package.json package-lock.json ./
RUN npm install

# Uygulama dosyalarını kopyalayıp build ediyoruz
COPY . .
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
RUN npm run build

# Production stage
FROM node:18-slim AS production
WORKDIR /app

# Sadece gerekli olan build dosyalarını kopyalıyoruz
COPY --from=build /app/build /app/build

# Serve kurulumunu yapıyoruz (statik dosya sunucusu)
RUN npm install -g serve

# Port açıyoruz
EXPOSE 3000

# Uygulamayı başlatıyoruz
CMD ["serve", "-s", "build"]
