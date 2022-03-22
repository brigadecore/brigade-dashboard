FROM --platform=$BUILDPLATFORM node:16.13.2-alpine3.15 as builder

WORKDIR /app

COPY package.json yarn.lock ./

# Doing this in a separate layer will prevent unnecessary dependency resolution
# on each build
RUN yarn install

COPY . .

# Build the react app in production mode. Artifacts will be stored in build/
RUN yarn build

FROM nginxinc/nginx-unprivileged:1.20.2-alpine as final

USER root

# Remove default nginx website
RUN rm /etc/nginx/conf.d/default.conf && rm -rf /usr/share/nginx/html/*

COPY brigade-dashboard.nginx.conf /etc/nginx/conf.d/brigade-dashboard.conf

# Make a directory where we can later put Brigade API server reverse proxy
# configuration
RUN mkdir -p /etc/nginx/brigade-dashboard.conf.d

# Copy build artifacts from build stage
COPY --from=builder --chown=nginx:nginx /app/build /usr/share/nginx/brigade-dashboard

USER nginx

CMD ["nginx", "-g", "daemon off;"]
