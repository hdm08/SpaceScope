# FROM --platform=linux/amd64 node:18

# WORKDIR /app

# # Copy package files
# COPY package.json package-lock.json ./

# # Remove any existing node_modules and package-lock.json, then install
# RUN rm -rf node_modules package-lock.json && \
#     npm install

# # Copy source code
# COPY . .

# # Expose port
# EXPOSE 5173

# # Start development server
# CMD ["npm", "run", "dev", "--", "--host"]


FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN rm -rf node_modules package-lock.json && npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npx", "serve", "-s", "build", "-l", "5173"]