Steps to deploy:

* Build:

```
export BUILDAH_FORMAT=docker
podman build -t USER_NAME/eclipse-acute-build-test-env:test .
```

* Login

```
podman login docker.io
```

* Deploy

```
podman push IMAGE_ID docker.io/USER_NAME/eclipse-acute-build-test-env:test
```

**Note:**

USER_NAME in various configs is 'akurtakov' now. If new image is published by another user this has to be changes in various Jenkins files and configs.