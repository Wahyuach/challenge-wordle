# Gunakan image Nginx sebagai base image
FROM nginx:alpine

# Menyalin file statis (HTML, CSS, JS) ke dalam direktori yang digunakan oleh Nginx
COPY ./html /usr/share/nginx/html

# Menyediakan port 80 untuk mengakses aplikasi
EXPOSE 80

# Menjalankan Nginx di foreground
CMD ["nginx", "-g", "daemon off;"]
