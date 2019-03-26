pipeline {
  agent {
  	label 'migration'
  }
	options {
		timeout(time: 30, unit: 'MINUTES')
		buildDiscarder(logRotator(numToKeepStr:'10'))
	}
	environment {
	    DOTNET_ROOT="$WORKSPACE/dotnet"
	}
	stages {
		stage('Install .NET Core') {
			steps {
				sh 'wget https://download.visualstudio.microsoft.com/download/pr/7d8f3f4c-9a90-42c5-956f-45f673384d3f/14d686d853a964025f5c54db237ff6ef/dotnet-sdk-2.2.105-linux-x64.tar.gz'
				sh 'mkdir -p $DOTNET_ROOT'
				sh 'tar zxf "dotnet-sdk-2.2.105-linux-x64.tar.gz" -C $DOTNET_ROOT'
			}
		}
		stage('Build') {
			steps {
				wrap([$class: 'Xvnc', useXauthority: true]) {
					sh 'metacity &'
					withEnv(["PATH+DOTNET=$DOTNET_ROOT", "DOTNET_SKIP_FIRST_TIME_EXPERIENCE=true"]) {
						withMaven(maven: 'apache-maven-latest', jdk: 'oracle-jdk8-latest', mavenLocalRepo: '.repository') {
							sh 'mvn clean verify -Dmaven.test.error.ignore=true -Dmaven.test.failure.ignore=true -Dcbi.jarsigner.skip=false'
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
			when {
				branch 'master'
				// TODO deploy all branch from Eclipse.org Git repo
			}
			steps {
				sshagent ( ['project-storage.eclipse.org-bot-ssh']) {
					sh 'ssh genie.acute@build.eclipse.org rm -rf /home/data/httpd/download.eclipse.org/acute/snapshots'
					sh 'ssh genie.acute@build.eclipse.org mkdir -p /home/data/httpd/download.eclipse.org/acute/snapshots'
					sh 'scp -r repository/target/repository/* genie.acute@build.eclipse.org:/home/data/httpd/download.eclipse.org/acute/snapshots'
				}
			}
		}
	}
}
