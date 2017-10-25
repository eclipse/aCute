pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        withMaven(maven: 'apache-maven-latest', jdk: 'jdk1.8.0-latest') {
          sh 'mvn clean verify'
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
  environment {
    PATH = '/shared/common/node-v7.10.0-linux-x64/bin:/shared/common/dotnet-sdk-2.0.0-linux-x64:$PATH'
  }
}