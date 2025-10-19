# Menggunakan image Nginx berbasis Alpine Linux untuk ukuran yang lebih kecil
FROM nginx:alpine

# Menyalin semua file dari direktori lokal ke dalam container pada path yang digunakan oleh Nginx untuk file HTML
COPY . /usr/share/nginx/html

# Expose port 80 untuk akses HTTP
EXPOSE 8081

# Menjalankan Nginx di foreground
CMD ["nginx", "-g", "daemon off;"]
