#!/bin/bash
# gdk-pixbuf 2.44+ decodes images through glycin, which runs every loader in a
# bwrap sandbox. That sandbox cannot be set up inside a container - bwrap fails
# with "Can't mount devpts on /newroot/dev/pts: Permission denied" and GTK3
# aborts on the first icon load. Run glycin loaders directly instead, and leave
# every other bwrap invocation untouched.
args=("$@")
for ((i = 0; i < ${#args[@]}; i++)); do
    case "${args[i]}" in
    /usr/libexec/glycin-loaders/*) exec "${args[@]:i}" ;;
    esac
done
exec /usr/bin/bwrap.real "$@"
