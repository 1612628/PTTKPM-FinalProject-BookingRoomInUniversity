# PTTKPM-FinalProject-BookingRoomInUniversity

## Cách chạy code
1. Clone project
```
    git clone https://github.com/1612628/PTTKPM-FinalProject-BookingRoomInUniversity.git
```    
2. Mở folder project bằng Terminal
```
    cd PTTKPM-FinalProject-BookingRoomInUniversity
```    
3. Cài đặt dependencies
```
    npm install
```    
4. Build Front End Admin
```
    npm run build-admin
```    
5. Chạy database băng Docker
```
    docker run --rm -p 5432:5432 -e POSTGRES_DB=bookingroomdb postgres:alpine
```    
6. Đồng bộ database
```
    npm run dev
    curl localhost:8080/sync
    npx sequelize db:seed:all
```   
7. Ứng dụng sẵn sàng ở port 8080
