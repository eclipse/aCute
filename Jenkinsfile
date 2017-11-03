pipeline {
	agent any
	stages {
		stage('Build') {
			steps {
				cleanWs()
				wrap([$class: 'Xvnc', useXauthority: true]) {
					withEnv(["PATH+NODE=/shared/common/node-v7.10.0-linux-x64/bin", "PATH+DOTNET=/shared/common/dotnet-sdk-2.0.0-linux-x64"]) {
						withMaven(maven: 'apache-maven-latest', jdk: 'jdk1.8.0-latest') {
							sh 'mvn clean verify -Dmaven.test.error.ignore=true -Dmaven.test.failure.ignore=true'
						}
					}
				}
			}
			post {
				success {
					junit '*/target/surefire-reports/TEST-*.xml' 
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
	}
}
