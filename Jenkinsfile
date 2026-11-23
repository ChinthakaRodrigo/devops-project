pipeline {

    agent {
        label 'rootless-docker'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh '''
                        chmod +x mvnw
                        ./mvnw -B clean package -DskipTests
                    '''
                }
            }
        }

        stage('Docker Build and Deploy') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'mysql-root-password',
                        variable: 'MYSQL_ROOT_PASSWORD'
                    )
                ]) {
                    sh '''
                        set +x

                        echo "Checking Docker..."

                        docker context show

                        echo "Validating Docker Compose..."

                        docker compose config --quiet

                        echo "Building and deploying application..."

                        docker compose -p devops-project up -d --build

                        echo "Checking containers..."

                        docker compose -p devops-project ps
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'CI/CD Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the console output.'
        }
    }
}

