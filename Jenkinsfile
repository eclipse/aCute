pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        wrap([$class: 'Xvnc', useXauthority: true]) {
          sh 'metacity &'
          withEnv(["PATH+NODE=/shared/common/node-v7.10.0-linux-x64/bin", "PATH+DOTNET=/shared/common/dotnet-sdk-2.0.0-linux-x64"]) {
            withMaven(maven: 'apache-maven-latest', jdk: 'jdk1.8.0-latest') {
              sh 'mvn clean verify -Dmaven.test.error.ignore=true -Dmaven.test.failure.ignore=true'
            }
          }
        }
      }
    }
    stage('Deploy') {
      steps {
        sh 'rm -rf /home/data/httpd/download.eclipse.org/acute/snapshots'
        sh 'mkdir -p /home/data/httpd/download.eclipse.org/acute/snapshots'
        sh 'cp -r repository/target/repository/* /home/data/httpd/download.eclipse.org/acute/snapshots'
        sh 'zip -R /home/data/httpd/download.eclipse.org/acute/snapshots/repository.zip repository/target/repository/*'
      }
    }
    stage('JUnit') {
      steps {
        junit '*/target/surefire-reports/TEST-*.xml'
      }
    }
  }
}
