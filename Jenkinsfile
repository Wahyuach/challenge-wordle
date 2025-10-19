pipeline {
    agent any

    environment {
        IMAGE_NAME = "myapp"
        CONTAINER_NAME = "myapp_container"
        PORT = "8081"
        DOCKER_USERNAME = "lostthemoment"  // Ganti dengan Docker Hub username
        DOCKER_PASSWORD = "dckr_pat_IH_Xx8IAjE4jJWuHUUWuizXncyM"  // Ganti dengan Docker Hub password atau token
    }

    stages {
        stage('Checkout SCM') {
            steps {
                // Checkout kode dari repository GitHub
                git branch: 'main', url: 'https://github.com/Wahyuach/challenge-wordle.git'
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    // Login ke Docker Hub dengan username dan password manual
                    powershell """
                    docker login --username ${DOCKER_USERNAME} --password-stdin <<< "${DOCKER_PASSWORD}"
                    """
                }
            }
        }

        stage('Pull Docker Image') {
            steps {
                script {
                    // Pull image jika belum ada di local
                    try {
                        powershell """
                        docker pull ${IMAGE_NAME}
                        """
                    } catch (Exception e) {
                        echo "Image tidak ditemukan di Docker Hub, lanjutkan dengan build."
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Jika image tidak ada, maka bangun image dari Dockerfile
                    powershell """
                    if (!(docker images ${IMAGE_NAME} | Select-String -Pattern ${IMAGE_NAME})) {
                        echo 'Image tidak ditemukan, membangun image...'
                        docker build -t ${IMAGE_NAME} .
                    } else {
                        echo 'Image sudah ada, melewati build.'
                    }
                    """
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    // Jalankan container dari image yang sudah ada
                    powershell """
                    docker ps -a -q --filter "name=${CONTAINER_NAME}" | Select-String -Pattern '.*' ; if (\$?) { docker rm -f ${CONTAINER_NAME} }
                    docker run -d --name ${CONTAINER_NAME} -p ${PORT}:${PORT} ${IMAGE_NAME}
                    """
                }
            }
        }

        stage('Get Docker Container Link') {
            steps {
                script {
                    // Menampilkan link akses container
                    echo "Akses aplikasi di: http://localhost:${PORT}"
                }
            }
        }
    }

    post {
        always {
            script {
                powershell """
                docker ps -a -q --filter 'name=${CONTAINER_NAME}' | Select-String -Pattern '.*' ; if (\$?) { docker stop ${CONTAINER_NAME} ; docker rm ${CONTAINER_NAME} }
                docker rmi ${IMAGE_NAME} ; if (\$?) { echo 'No image to remove' }
                """
            }
        }
    }
}
