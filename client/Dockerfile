# Dockerfile

FROM node:18

# Create and set working directory
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Run Vite in dev mode
CMD ["npm", "run", "dev", "--", "--host"]
