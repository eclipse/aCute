FROM eclipsecbi/fedora-gtk3-mutter:44-gtk3.24

# Back to root for install
USER 0
RUN dnf -y update 
RUN dnf -y install dotnet-sdk-10.0 java-25-openjdk-devel libstdc++ which
	
# gdk-pixbuf 2.44+ decodes images through glycin, which runs every loader in a
# bwrap sandbox. That sandbox cannot be set up inside a container, so GTK3 aborts
# on the first icon load. Wrap bwrap to run glycin loaders directly.
COPY glycin-bwrap-wrapper.sh /usr/local/bin/glycin-bwrap-wrapper.sh
RUN mv /usr/bin/bwrap /usr/bin/bwrap.real \
    && install -m 0755 /usr/local/bin/glycin-bwrap-wrapper.sh /usr/bin/bwrap

RUN curl -L https://dlcdn.apache.org/maven/maven-3/3.9.16/binaries/apache-maven-3.9.16-bin.tar.gz | tar -xzv
ENV PATH=/apache-maven-3.9.16/bin:/usr/lib/jvm/java-25/bin:$PATH
ENV JAVA_HOME=/usr/lib/jvm/java-25

#Back to named user
USER 10001