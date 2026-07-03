# 1. Use the official lightweight Bun image
FROM oven/bun:alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package.json bun.lockb* ./
RUN bun install

# 4. Copy the rest of your app's source code
COPY . .

# 5. Expose the port your app listens on
EXPOSE 3001

# 6. Run the application
CMD ["bun", "run", "./index.ts"]
