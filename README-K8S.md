# <span style="color:#0099FF; font-weight: bolder;">Kubernetes</span>

## <span style="color:#0099FF; font-weight: bolder;">Cluster</span>

```bash
kubectl cluster-info
# Kubernetes control plane is running at https://127.0.0.1:49744
# CoreDNS is running at https://127.0.0.1:49744/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
💡 Why that weird port?
Kind runs Kubernetes inside Docker containers, so it maps the API server port from inside the container to a random local port (e.g., 49744) on your machine
```

✅ Your Kind cluster is running successfully.
Hyere's what that message is telling you:

| Part                     | Explanation                                                                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Kubernetes control plane | This is the API server — the brain of your cluster.                                                                                           |
| https://127.0.0.1:49744  | The Kubernetes API is exposed locally on your Mac at this port (Kind uses a random high port).                                                |
| kubectl works            | Your `~/.kube/config` has been updated to point to that API endpoint, so commands like `kubectl get pods` will now talk to your Kind cluster. |

## <span style="color:#0099FF; font-weight: bolder;">Nodes</span>

```bash
kubectl get nodes
kubectl get pods -A
```

| Option | Meaning            | Description                                                               |
| ------ | ------------------ | ------------------------------------------------------------------------- |
| `-A`   | `--all-namespaces` | Lists pods (or other resources) **across all namespaces** in the cluster. |

### <span style="color:#0099FF; font-weight: bolder;">Context</span>

```bash
kubectl config get-contexts
kubectl config get-clusters
kubectl config get-users

kubectl config unset users.<user-name>
kubectl config unset clusters.<cluster-name>
kubectl config delete-context <context-name>
```

yaml file or => kubectl kubectl create namespace &lt;insert-namespace-name-here&gt;

sys => system
cmy => community
etp => enterprise

Backend
kubetcl create namespace laniakea-sys-backend
kubetcl create namespace laniakea-cmy-backend

Frotend
kubetcl create namespace laniakea-sys-frontend

Infra
kubetcl create namespace laniakea-sys-infra

YAML Files

### <span style="color:#0099FF; font-weight: bolder;">Foward</span>

```bash
# get pods: kubectl get pods -l app=repo-verdaccio
# NAME                                     READY   STATUS    RESTARTS   AGE
# deploy-verdaccio-repo-79947f5f8f-6k4s6   1/1     Running   0          3m
# kubectl port-forward deploy-verdaccio-repo-79947f5f8f-6k4s6 4873:4873
kubectl port-forward <pod-name> 4873:4873
```

### <span style="color:#0099FF; font-weight: bolder;">StatefulSet</span>

```bash
kubectl get sts verdaccio -n laniakea-local
kubectl rollout status statefulset/verdaccio -n laniakea-local
kubectl describe sts verdaccio -n laniakea-local
kubectl rollout status sts/verdaccio -n laniakea-local

```

### <span style="color:#0099FF; font-weight: bolder;">Pods</span>

#### Restart

```bash
kubectl rollout restart deployment verdaccio -n laniakea-local

#check conditions
watch -n 5 "kubectl describe po -l app=repo-verdaccio -n laniakea-local"
```

### <span style="color:#0099FF; font-weight: bolder;">Services</span>

```bash
kubectl get endpoints <nome-do-serviço> -n <namespace>
```

# <span style="color:#0099DD; font-weight: bolder;">Kind</span>

### <span style="color:#0099FF; font-weight: bolder;">Installation</span>

```bash
brew install kind
kind --version
```

### <span style="color:#0099FF; font-weight: bolder;">Cluster & Ingress Controller</span>

```bash
# /Volumes/ssd/workspace/projects/atis/laniakea-supercluster/laniakea-platform/infrastructure/k8s/kind
kind create cluster --config kind-config.yaml
docker exec -it laniakea-cluster-control-plane mkdir -p /var/lib/verdaccio
kubectl apply -f https://kind.sigs.k8s.io/examples/ingress/deploy-ingress-nginx.yaml
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

# to delete cluster: kind delete cluster --name laniakea-cluster
# to delete ingress nginx: kubectl delete -f https://kind.sigs.k8s.io/examples/ingress/deploy-ingress-nginx.yaml
# check logs:
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller

#endpoins:
kubectl get endpoints verdaccio -n laniakea-local -o yaml
```

### <span style="color:#0099FF; font-weight: bolder;">To be able to use PV and PVC</span>
```bash
docker exec -it laniakea-cluster-control-plane bash
mkdir -p /var/lib/verdaccio
chmod -R 777 /var/lib/verdaccio
```



# <span style="color:#0099AA; font-weight: bolder;">Kustomize</span>

### <span style="color:#0099AA; font-weight: bolder;">Validate YAML schema with kubeval (static)</span>

#### Installation if needed

```bash
brew install kustomize
kustomize version
```

#### Vadlidation and buld

```bash
brew install kubeconform  # macOS (Homebrew)
# or download binary for Linux/Windows from GitHub Releases
# Example for "." current path:
kustomize build . | kubeconform -strict -summary # validate
kustomize build . # display final yaml
kustomize build . > results.yaml # export final yaml to results file
```

### <span style="color:#0099AA; font-weight: bolder;">Client-side dry-run</span>

```bash
# kubectl apply --dry-run=client -k <path>
# Example for "." current path:
kubectl apply --dry-run=client -k .
# Offline or want local-only validation
```

### <span style="color:#0099AA; font-weight: bolder;">Server-side Dry-run apply</span>

```bash
# kubectl apply --dry-run=server -k <path>
# Example for "." current path:
kubectl apply --dry-run=server -k .
# Requires a working connection to the cluster. Uses server-side validation.
```

### <span style="color:#0099AA; font-weight: bolder;">Apply</span>

```bash
kubectl apply -k .
```

<!--
control-plane
core-dns



Some kubernetes resources abbreviations:
* all
* certificatesigningrequests (aka 'csr')
* componentstatuses (aka 'cs')
* configmaps (aka 'cm')
* daemonsets (aka 'ds')
* deployments (aka 'deploy')
* endpoints (aka 'ep')
* events (aka 'ev')
* horizontalpodautoscalers (aka 'hpa')
* ingresses (aka 'ing')
* limitranges (aka 'limits')
* namespaces (aka 'ns')
* networkpolicies
* nodes (aka 'no')
* persistentvolumeclaims (aka 'pvc')
* persistentvolumes (aka 'pv')
* pods (aka 'po')
* poddisruptionbudgets (aka 'pdb')
* podsecuritypolicies (aka 'psp')
* replicasets (aka 'rs')
* replicationcontrollers (aka 'rc')
* resourcequotas (aka 'quota')
* serviceaccounts (aka 'sa')
* services (aka 'svc')


*** kubefwd
https://github.com/txn2/kubefwd


-->
