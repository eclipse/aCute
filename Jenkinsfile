pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        withEnv(["PATH+NODE=/shared/common/node-v7.10.0-linux-x64/bin"]) {
          withMaven(maven: 'apache-maven-latest', jdk: 'jdk1.8.0-latest') {
            sh 'mvn clean verify -DskipTests'
          }
        }
      }
    }
    stage('Deploy') {
      steps {
        sh 'echo deploy'
      }
    }
    stage('JUnit') {
      steps {
        junit '*/target/surefire-reports/TEST-*.xml'
      }
    }
  }
}
