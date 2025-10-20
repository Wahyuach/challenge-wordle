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

        stage('Pull Docker Image') {
            steps {
                script {
                    try {
                        bat """
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
                    bat """
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
                    bat """
                    docker ps -a -q --filter "name=${CONTAINER_NAME}" | Select-String -Pattern '.*' ; if (\$?) { docker rm -f ${CONTAINER_NAME} }
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
                bat """
                docker ps -a -q --filter 'name=${CONTAINER_NAME}' | Select-String -Pattern '.*' ; if (\$?) { docker stop ${CONTAINER_NAME} ; docker rm ${CONTAINER_NAME} }
                docker rmi ${IMAGE_NAME} ; if (\$?) { echo 'No image to remove' }
                """
            }
        }
    }
}
