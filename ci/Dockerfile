FROM eclipsecbi/fedora-gtk3-mutter:44-gtk3.24

# Back to root for install
USER 0
RUN dnf -y update 
RUN dnf -y install dotnet-sdk-10.0 java-25-openjdk-devel libstdc++ which
	
RUN curl -L https://dlcdn.apache.org/maven/maven-3/3.9.16/binaries/apache-maven-3.9.16-bin.tar.gz | tar -xzv 
ENV PATH=/apache-maven-3.9.16/bin:/usr/lib/jvm/java-25/bin:$PATH
ENV JAVA_HOME=/usr/lib/jvm/java-25

#Back to named user
USER 10001