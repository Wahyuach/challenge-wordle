pipeline {
    agent any

    environment {
        IMAGE_NAME = "myapp"
        CONTAINER_NAME = "myapp_container"
        PORT = "8081"
        DOCKER_CREDENTIALS = 'docker-creds'  // Gantilah dengan ID kredensial Docker yang sesuai
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
                    // Login ke Docker Hub dengan kredensial
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh "echo $DOCKER_PASSWORD | docker login --username $DOCKER_USERNAME --password-stdin"
                    }
                }
            }
        }

        stage('Pull Docker Image') {
            steps {
                script {
                    // Pull image jika belum ada di local
                    try {
                        sh "docker pull ${IMAGE_NAME}"
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
                    sh """
                    if ! docker images ${IMAGE_NAME} | grep -q ${IMAGE_NAME}; then
                        echo 'Image tidak ditemukan, membangun image...'
                        docker build -t ${IMAGE_NAME} .
                    else
                        echo 'Image sudah ada, melewati build.'
                    fi
                    """
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    // Jalankan container dari image yang sudah ada
                    sh """
                    docker ps -a -q --filter "name=${CONTAINER_NAME}" | grep -q . && docker rm -f ${CONTAINER_NAME}
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
                // Bersihkan Docker container dan image setelah pipeline selesai
                sh """
                docker ps -a -q --filter 'name=${CONTAINER_NAME}' | grep -q . && docker stop ${CONTAINER_NAME} && docker rm ${CONTAINER_NAME}
                docker rmi ${IMAGE_NAME} || echo 'No image to remove'
                """
            }
        }
    }
}
