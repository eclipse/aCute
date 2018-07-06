pipeline {
	agent any
	options {
		buildDiscarder(logRotator(numToKeepStr:'10'))
	}
	stages {
		stage('Prepare') {
			steps {
				git url: 'https://github.com/eclipse/aCute.git'
				cleanWs()
				checkout scm
			}
		}
		stage('Build') {
			steps {
				wrap([$class: 'Xvnc', useXauthority: true]) {
					withEnv(["PATH+DOTNET=/shared/common/dotnet-sdk-2.0.0-linux-x64"]) {
						withMaven(maven: 'apache-maven-latest', jdk: 'jdk1.8.0-latest', mavenLocalRepo: '.repository') {
							sh 'mvn clean verify -Dmaven.test.error.ignore=true -Dmaven.test.failure.ignore=true -PpackAndSign'
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
		stage('SonarQube analysis') {
			when {
				not {
					branch 'master'
				}
			}
			steps {
				withSonarQubeEnv('Eclipse Sonar') {
					withMaven(maven: 'apache-maven-latest', jdk: 'jdk1.8.0-latest', mavenLocalRepo: '.repository') {
						withCredentials([usernamePassword(credentialsId: '4837e65b-59d9-43d8-8aa4-c5e6f62acc3b', usernameVariable: 'USERNAME', passwordVariable: 'TOKEN')]) {
							sh 'mvn org.sonarsource.scanner.maven:sonar-maven-plugin:3.3.0.603:sonar -Dsonar.analysis.mode=preview -Dsonar.github.pullRequest=' + env.CHANGE_ID + ' -Dsonar.github.repository=eclipse/aCute -Dsonar.github.oauth=' + env.TOKEN + ' -Dsonar.host.url=$SONAR_HOST_URL -Dsonar.jdbc.url=$SONAR_JDBC_URL -Dsonar.jdbc.username=$SONAR_JDBC_USERNAME -Dsonar.jdbc.password=$SONAR_JDBC_PASSWORD'
						}
					}
				}
			}
		}
		stage('SonarQube') {
			steps {
				withSonarQubeEnv('Eclipse Sonar') {
					withMaven(maven: 'apache-maven-latest', jdk: 'jdk1.8.0-latest', mavenLocalRepo: '.repository') {
						sh 'mvn org.sonarsource.scanner.maven:sonar-maven-plugin:3.3.0.603:sonar -Dsonar.host.url=$SONAR_HOST_URL -Dsonar.jdbc.url=$SONAR_JDBC_URL -Dsonar.jdbc.username=$SONAR_JDBC_USERNAME -Dsonar.jdbc.password=$SONAR_JDBC_PASSWORD'
					}
				}
			}
		}
		stage('Deploy') {
			when {
				branch 'master'
				// TODO deploy all branch from Eclipse.org Git repo
			}
			steps {
				// TODO compute the target URL (snapshots) according to branch name (0.5-snapshots...)
				sh 'rm -rf /home/data/httpd/download.eclipse.org/acute/snapshots'
				sh 'mkdir -p /home/data/httpd/download.eclipse.org/acute/snapshots'
				sh 'cp -r repository/target/repository/* /home/data/httpd/download.eclipse.org/acute/snapshots'
				sh 'zip -R /home/data/httpd/download.eclipse.org/acute/snapshots/repository.zip repository/target/repository/*'
			}
		}
	}
}
