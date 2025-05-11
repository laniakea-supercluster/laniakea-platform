Podman
podman --version
podman machine list
podman machine info
podman machine inspect





podman machine stop <machine-name>
podman machine set <machine-name> --mount type=9p,source=/Volumes/ssd,target=/Volumes/ssd
podman machine start <machine-name>
podman machine set --rootful podman-machine-default
podman machine set --rootful podman-machine-k8s

podman machine stop podman-machine-default
podman machine set --rootful podman-machine-default
podman machine start podman-machine-default
podman machine set --volume /Volumes:/Volumes podman-machine-default


podman machine set --volume /Volumes:/Volumes <machine-name>
podman machine set --volume /Volumes:/Volumes podman-machine-default