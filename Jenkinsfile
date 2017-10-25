pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'mvn clean verify'
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