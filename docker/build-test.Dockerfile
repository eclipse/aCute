FROM fedora:28

RUN dnf install -v -y \
	bash git wget \
	# Required for build
	java-openjdk-devel \
	# Required for tests
	## UI Support
	tigervnc-server \
	metacity \
	### cascade to the whole GTK stack
	gtk3

# Use Maven from archive because Fedora's fork is sometimes strange
RUN \
	wget http://wwwftp.ciril.fr/pub/apache/maven/maven-3/3.5.4/binaries/apache-maven-3.5.4-bin.tar.gz && \
	mkdir /opt/maven && \
	tar xzf apache-maven-3.5.4-bin.tar.gz -C /opt/maven
ENV PATH="/opt/maven/apache-maven-3.5.4/bin/:${PATH}"

RUN dnf install -y 'dnf-command(copr)' && dnf -y copr enable @dotnet-sig/dotnet
RUN dnf install -y dotnet-sdk-2.1
