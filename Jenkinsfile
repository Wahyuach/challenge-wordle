pipeline {
    agent any

    environment {
        IMAGE_NAME = 'myapp'
        CONTAINER_NAME = 'myapp_container'
        PORT = '8081'
    }

    stages {
        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    script {
                        powershell """
                        echo ${DOCKER_PASSWORD} | docker login --username ${DOCKER_USERNAME} --password-stdin
                        echo "Docker login completed."
                        """
                    }
                }
            }
        }

        stage('Pull Docker Image') {
            steps {
                script {
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
