pipeline {

    agent {
        label 'rootless-docker'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Build') {
            steps {
                dir('backend') {
                    sh 'chmod +x mvnw'
                    sh './mvnw clean test'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('client/my-react-app') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker compose build'
            }
        }
    }

    post {
        success {
            echo 'Community Issue Tracker CI completed!'
        }

        failure {
            echo 'Community Issue Tracker CI failed!'
        }
    }
}

