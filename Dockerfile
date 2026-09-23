# Build stage — Vite + pnpm
FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@10.34.3 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Vite menanam VITE_* saat build — isi via --build-arg (lihat README deploy).
ARG VITE_GOOGLE_CLIENT_ID=""
ARG VITE_ADMIN_EMAILS=""
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID \
    VITE_ADMIN_EMAILS=$VITE_ADMIN_EMAILS

RUN pnpm build

# Serve stage — static + SPA fallback
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
