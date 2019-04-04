FROM eclipsecbi/fedora-gtk3-mutter:29-gtk3.24

# Back to root for install
USER 0
RUN dnf -y update && \
	dnf -y install java-openjdk maven
RUN dnf -y install 'dnf-command(copr)' && \
    dnf -y copr enable @dotnet-sig/dotnet && \
    dnf -y install dotnet-sdk-2.1
# Requirement for netcoredbg, most likely already installed
# but keeping this explicit step doesn't harm and is good
# for documentation
RUN dnf -y update && \
	dnf -y install libstdc++

#Back to named user
USER 10001