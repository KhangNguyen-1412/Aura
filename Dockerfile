FROM node:20-alpine

# Cài đặt Python & edge-tts để hỗ trợ giọng đọc Nam Tổng Tài
RUN apk add --no-cache python3 py3-pip && \
    pip3 install --no-cache-dir --break-system-packages edge-tts || true

WORKDIR /app

# Sao chép package manifests
COPY package*.json ./

# Cài đặt thư viện Node.js production
RUN npm install --omit=dev

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Tạo thư mục media sẵn sàng cho lưu trữ
RUN mkdir -p media

# Thiết lập cổng và môi trường
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]
