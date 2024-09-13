FROM eclipsecbi/fedora-gtk3-mutter:40-gtk3.24

# Back to root for install
USER 0
RUN dnf -y update && \
	dnf -y install java-21-openjdk-devel
RUN dnf -y install dotnet-sdk-8.0
# Requirement for netcoredbg, most likely already installed
# but keeping this explicit step doesn't harm and is good
# for documentation
RUN dnf -y update && \
	dnf -y install libstdc++
	
RUN curl -L https://dlcdn.apache.org/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.tar.gz | tar -xzv 
ENV PATH=/apache-maven-3.9.9/bin:/usr/lib/jvm/java-21/bin:$PATH
ENV JAVA_HOME=/usr/lib/jvm/java-21

#Back to named user
USER 10001