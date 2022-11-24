FROM eclipsecbi/fedora-gtk3-mutter:36-gtk3.24

# Back to root for install
USER 0
RUN dnf -y update && \
	dnf -y install java-openjdk maven
RUN dnf -y install dotnet-sdk-6.0
# Requirement for netcoredbg, most likely already installed
# but keeping this explicit step doesn't harm and is good
# for documentation
RUN dnf -y update && \
	dnf -y install libstdc++

#Back to named user
USER 10001