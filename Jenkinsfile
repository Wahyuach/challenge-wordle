pipeline {
    agent any
    stages {
        stage('Build and Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-creds', usernameVariable: 'lostthemoment', passwordVariable: 'dckr_pat_812FSOwOSVT4H0Niy7Fh5OAubOM')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker build -t $DOCKER_USER/myapp:latest .
                        docker push $DOCKER_USER/myapp:latest
                    '''
                }
            }
        }
    }
}
