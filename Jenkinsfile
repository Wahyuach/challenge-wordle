pipeline {
    agent any
    stages {
        stage('Build and Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat """
                        docker login -u %DOCKER_USER% -p %DOCKER_PASS%
                        docker build -t %DOCKER_USER%/myapp:latest .
                        docker push %DOCKER_USER%/myapp:latest
                    """
                }
            }
        }
    }
}
