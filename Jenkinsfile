pipeline {
    agent any

    environment {
        IMAGE_NAME = 'myapp'
        CONTAINER_NAME = 'myapp_container'
        PORT = '8081'
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
                withCredentials([usernamePassword(credentialsId: 'docker-login', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    script {
                        // Login ke Docker Hub dengan kredensial yang aman
                        powershell """
                        docker login --username ${DOCKER_USERNAME} --password-stdin
                        echo "Docker login completed."
                        """
                    }
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
                        echo 'Image tidak ditemukan di Docker Hub, lanjutkan dengan build.'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Jika image tidak ada, maka bangun image dari Dockerfile
                    powershell """
                    docker images ${IMAGE_NAME} | findstr ${IMAGE_NAME} > nul
                    if errorlevel 1 (
                        echo 'Image tidak ditemukan, membangun image...'
                        docker build -t ${IMAGE_NAME} .
                    ) else (
                        echo 'Image sudah ada, melewati build.'
                    )
                    """
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    // Jalankan container dari image yang sudah ada
                    powershell """
                    docker ps -a -q --filter "name=${CONTAINER_NAME}" | findstr ${CONTAINER_NAME} > nul ; if (\$?) { docker rm -f ${CONTAINER_NAME} }
                    docker run -d --name ${CONTAINER_NAME} -p ${PORT}:${PORT} ${IMAGE_NAME}
                    """
                }
            }
        }

        stage('Get Docker Container Link') {
            steps {
                script {
                    echo "Akses aplikasi di: http://localhost:${PORT}"
                }
            }
        }
    }

    post {
        always {
            script {
                powershell """
                docker ps -a -q --filter 'name=${CONTAINER_NAME}' | findstr ${CONTAINER_NAME} > nul ; if (\$?) { docker stop ${CONTAINER_NAME} ; docker rm ${CONTAINER_NAME} }
                docker rmi ${IMAGE_NAME} ; if (\$?) { echo 'No image to remove' }
                """
            }
        }
    }
}
