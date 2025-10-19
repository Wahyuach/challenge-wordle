pipeline {
    agent any

    environment {
        // Mendefinisikan variabel untuk image Docker dan container
        IMAGE_NAME = "myapp"
        CONTAINER_NAME = "myapp_container"
        PORT = "8080"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                // Checkout kode dari repository GitHub
                git branch: 'main', url: 'https://github.com/Wahyuach/challenge-wordle.git'
            }
        }

        stage('Pull Docker Image') {
            steps {
                // Menarik image Docker dari Docker Hub (Opsional jika Anda ingin menggunakan image yang ada)
                script {
                    try {
                        powershell """
                        docker pull ${IMAGE_NAME}
                        """
                    } catch (Exception e) {
                        echo "Image tidak ditemukan, lanjutkan dengan build"
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                // Membangun Docker image dari Dockerfile yang ada
                script {
                    powershell """
                    docker build -t ${IMAGE_NAME} .
                    """
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                // Menjalankan Docker container
                script {
                    // Cek jika container dengan nama yang sama sudah ada dan hapus jika ada
                    powershell """
                    docker ps -a -q --filter "name=${CONTAINER_NAME}" | Select-String -Pattern '.*' ; if (\$?) { docker rm -f ${CONTAINER_NAME} }
                    docker run -d --name ${CONTAINER_NAME} -p ${PORT}:${PORT} ${IMAGE_NAME}
                    """
                }
            }
        }

        stage('Get Docker Container Link') {
            steps {
                // Menampilkan link akses container
                script {
                    echo "Akses aplikasi di: http://localhost:${PORT}"
                }
            }
        }
    }

    post {
        always {
            // Bersihkan docker image dan container setelah pipeline selesai
            script {
                powershell """
                docker ps -a -q --filter 'name=${CONTAINER_NAME}' | Select-String -Pattern '.*' ; if (\$?) { docker stop ${CONTAINER_NAME} ; docker rm ${CONTAINER_NAME} }
                docker rmi ${IMAGE_NAME} ; if (\$?) { echo 'No image to remove' }
                """
            }
        }
    }
}
