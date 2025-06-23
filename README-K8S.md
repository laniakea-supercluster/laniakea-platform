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

COMMANDS

#Contexts

kubectl config get-contexts
kubectl config rename-context <old-name> <new-name>




Pods

📌 1. Verificar eventos de OOMKilled para vários pods
kubectl describe pod -l "application=service-product" -n apps | grep -i oom

📌 4. Verificar logs de pods que podem ter sido OOMKilled
kubectl logs -l "application=service-product" -n apps --all-containers=true --previous | grep -i oom




📌 7. Se o pod foi Evicted (Expulso do nó)
kubectl get events --sort-by=.metadata.creationTimestamp -n apps | grep -i evict


kubectl -n apps get secret service-configuration -o jsonpath="{.data['SEC_MIGRATED_DATASOURCE_JDBC_URL']}" | base64 --decode
![image](https://github.com/user-attachments/assets/6621c693-231f-4ef3-98b2-6646abb77bf3)



#logs
kubectl logs -f -l "application=service-product,pod-template-hash=76cc4ddd8f" --all-containers=true -n apps --max-log-requests=12
kubectl logs -f -l "application=service-product,pod-template-hash=76cc4ddd8f" --all-containers=true -n apps --max-log-requests=12 | grep '{' | jq 'select(.severity == "ERROR")'
kubectl logs -l "application=service-configuration" -n apps --follow | jq --unbuffered --color-output | grep --color=always -E 'ERROR|WARN|INFO|$'



#CHECK
Google

https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl

gcloud components update




Contexts
kubectl config get-contexts
kubectl config rename-context CONTEXT_NAME NEW_NAME

kubectl config rename-context gke_mms-bsp-branded-service-p-1337_europe-west4_prod gke_prod
kubectl config rename-context gke_mms-bsp-branded-service-d-1337_europe-west4-a_dev gke_dev

kubectl config current-context

kubectl config use-context 



PODs

Logs
https://kubernetes.io/docs/reference/kubectl/generated/kubectl_logs/
https://www.gooksu.com/kubectl-jq/

kubectl logs --since=1h -n bsp 
kubectl logs -f -l "app.kubernetes.io/name=online-order-bsp-app" --all-containers=true -n bsp



Secrets
kubectl get secrets -A
kubectl get secret -n bsp sp-credentials -o yaml


useful flux commands:
# Flux
kubectl get helmrelease -n bsp
kubectl delete helmrelease -n bsp support
flux reconcile kustomization --with-source apps


*** kubefwd
https://github.com/txn2/kubefwd


CHECK DEPLOY
watch -n 5 "kubectl get po -n bsp --sort-by=.metadata.creationTimestamp | tail -n +2 | sort -r"
watch -n 5 "kubectl get po -n bsp --sort-by=.metadata.creationTimestamp"
watch -n 300 "kubectl get po -n bsp --sort-by=.metadata.creationTimestamp"![image](https://github.com/user-attachments/assets/ad8fedd2-8460-454f-84c1-56828725e102)




Arion-Bridge

POD_NAME=$(kubectl get pods -l "app.kubernetes.io/name=arion-bridge-bsp-app" -n bsp -o jsonpath='{.items[0].metadata.name}')


Connect  IT
kubectl exec -it $POD_NAME -n bsp -- /bin/bash

Deploy
k scale deployment/online-order-bsp-app --replicas=1


Pods
kubectl get pods -l "app.kubernetes.io/name=arion-bridge-bsp-app" -n bsp
kubectl get pods -l "app.kubernetes.io/name=arion-bridge-bsp-app" -n bsp -o jsonpath='{.items[0].metadata.name}'

kubectl describepods -l "app.kubernetes.io/name=arion-bridge-bsp-app" -n bsp


logs
kubectl logs -f -l "app.kubernetes.io/name=arion-bridge-bsp-app" --all-containers=true -n bsp


port-forward [brew install socat***]
kubectl port-forward pod/$POD_NAME 38081:8081 -n bsp


port-forward-grpc
kubectl port-forward pod/arion-bridge-bsp-app-7c7cc77cc7-gqmvh 38080:8080 -n bsp &
socat TCP-LISTEN:38080,reuseaddr,fork TCP:localhost:38080

flux
flux get all -n bsp
kubectl -n flux-system logs deployment/helm-controller
flux reconcile kustomization -n flux-system apps\n\n

grpcurl [Debian Linux]
VERSION=$(curl -s https://api.github.com/repos/fullstorydev/grpcurl/releases/latest | grep tag_name | cut -d '"' -f 4)
curl -L https://github.com/fullstorydev/grpcurl/releases/download/${VERSION}/grpcurl_${VERSION#v}_linux_x86_64.tar.gz | tar -xz
sudo mv grpcurl /usr/local/bin/

grpcurl -plaintext -import-path /tests -proto work_order_service.proto -d @ localhost:8081 WorkOrderService/ManageWorkOrder < test-create-order-idempotence.json

telnet
apt update
apt install nano
apt install telnet
![image](https://github.com/user-attachments/assets/799f81f6-aab4-4eca-843d-8fa63f2ec106)



###GPC <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
projects
gcloud projects list


config
gcloud config list
gcloud config set project
gcloud config get-value project

account

gcloud config list account
gcloud auth list
gcloud auth login
gcloud config set account ferreiraad@mediamarkt.es
gcloud config unset account
gcloud auth application default-login

serviceAccounts
gcloud pubsub subscriptions list \
  --impersonate-service-account=service-configuration@mms-spm-spm-services-i-a8vk.iam.gserviceaccount.com \
  --format="table(name,topic,projectId)"

>> across projects
gcloud pubsub subscriptions list --impersonate-service-account=<SERVICE_ACCOUNT_EMAIL> --format="table(name,topic,projectId)"
gcloud pubsub subscriptions list --impersonate-service-account=service-configuration@mms-spm-spm-services-i-a8vk.iam.gserviceaccount.com --format="table(name,topic,projectId)"

for project in $(gcloud projects list --format="value(projectId)"); do echo "Checking project: $project" gcloud pubsub subscriptions list \ 
  --impersonate-service-account=service-configuration@mms-spm-spm-services-i-a8vk.iam.gserviceaccount.com \ 
  --project="$project" \ 
  --format="table(name,topic,projectId)" 
Done


Container Registry
gcloud container images list --repository gcr.io/$(gcloud config get-value project)/<REPO-NAME>

Artifacty Registry
gcloud artifacts repositories list
gcloud artifacts docker images list europe-west4-docker.pkg.dev/mms-spm-spm-services-i-a8vk/spm-services/service-product --sort-by="~UPDATE_TIME"![image](https://github.com/user-attachments/assets/3a07ff86-cc36-4951-badb-6b6c5fc79a5e)


gcloud projects list
gcloud config set project mms-spm-spm-services-p-c2hk     spm-services-prod             986857658775
gcloud config set project <PROJECT_ID>
gcloud config get-value project




CloudSQL
database: spm-db-int
user: postgres
Pass: m2WyJhAKvlFIVhXISxCQRJR3






list instances: gcloud sql instances list --filter="databaseVersion:POSTGRES*"
gcloud sql connect spm-instance-int --user=postgres


INT
database: spm-db-int
user: postgres
Pass: m2WyJhAKvlFIVhXISxCQRJR3cd
cloud-sql-proxy --address 0.0.0.0 --port 5432 mms-spm-spm-services-i-a8vk:europe-west4:spm-instance-int


QA

database: spm-db-qa
user: postgres

Pass: oSttSHLBUbLLCQIbLWeTMb8S
cloud-sql-proxy --address 0.0.0.0 --port 5432 mms-spm-spm-services-q-i9pm:europe-west4:spm-instance-qa

Kubernetes
INT: gcloud container clusters get-credentials spm-cluster --region europe-west4 --project mms-spm-spm-services-i-a8vk
	QA: gcloud container clusters get-credentials spm-cluster --region europe-west4-b --project mms-spm-spm-services-q-i9pm

Context
RENAME:  k config rename-contextgke_mms-spm-spm-services-q-i9pm_europe-west4-b_spm-cluster spm-cluster-qa


PROD
gcloud config set project mms-spm-spm-services-i-a8vk
gcloud container clusters get-credentials spm-cluster --region europe-west4 --project mms-spm-spm-services-p-c2hk
kubectl -n apps get secret service-product -o jsonpath="{.data['SEC_MIGRATED_DATASOURCE_JDBC_URL']}" | base64 --decode

cloud-sql-proxy --address 0.0.0.0 --port 5432 mms-spm-spm-services-p-c2hk:europe-west4:spm-instance-prod
OFaAvgKbgXdqkA9gdvCjrnBT









Emulator
https://cloud.google.com/pubsub/docs/emulator
https://github.com/ferreiraad/pubsubctl
pubsubctl list -p local --host localhost:8681
pubsubctl -p local --host localhost:8681 create -t v1.full-export -s subscription-v1.full-export
pubsubctl -p local --host localhost:8681 create -t v1.categorized-products-full-export topic -s subscription-v1.categorized-products-full-export
pubsubctl -p local --host localhost:8681 create -t v1.category-changes topic -s subscription-v1.category-changes
pubsubctl -p local --host localhost:8681 create -t v1.categorized-products-changes topic -s subscription-v1.categorized-products-changes


pubsubctl -p local --host localhost:8681 delete -t v1.full-export -s subscription-v1.full-export
pubsubctl -p local --host localhost:8681 delete -t v1.categorized-products-full-export topic -s subscription-v1.categorized-products-full-export
pubsubctl -p local --host localhost:8681 delete -t v1.category-changes topic -s subscription-v1.category-changes
pubsubctl -p local --host localhost:8681 delete -t v1.categorized-products-changes topic -s subscription-v1.categorized-products-changes



pubsubctl -p local --host localhost:8681 publish -t v1.full-export -m "$(cat /Users/ferreiraad/Desktop/subscription-v1.full-export/2025-03-04_17-07-41-187878000.v1.subscription-v1.full-export.json | jq -c .)"
pubsubctl -p local --host localhost:8681 receive -s subscription-v1.full-export 

pubsubctl -p local --host localhost:8681 publish -t  v1.categorized-products-full-export topic -m "$(cat /Users/ferreiraad/Desktop/subscription-v1.categorized-products-full-export/2025-03-14_17-17-42-519162000.subscription-v1.subscription-v1.category-changes.json | jq -c .)"
pubsubctl -p local --host localhost:8681 receive -s subscription-v1.categorized-products-full-export

pubsubctl -p local --host localhost:8681 publish -t  v1.category-changes topic -m "$(cat /Users/ferreiraad/Desktop/subscription-v1.category-changes/2025-03-14_17-17-42-519162000.subscription-v1.category-changes.json | jq -c .)"
pubsubctl -p local --host localhost:8681 receive -s subscription-v1.category-changes
![image](https://github.com/user-attachments/assets/1ac7211e-3d72-48e5-893e-6528c24b078a)


INT
gcloud pubsub topics publish projects/wzgg6ddthibk/topics/warrantyScheduler --message="{\"initial\": true}" \
  --impersonate-service-account=service-configuration@mms-spm-spm-services-i-a8vk.iam.gserviceaccount.com

QA
gcloud pubsub topics publish projects/pkipsyeitnqk/topics/warrantyScheduler --message="{\"initial\": true}" \
  --impersonate-service-account=service-configuration@mms-spm-spm-services-i-a8vk.iam.gserviceaccount.com![image](https://github.com/user-attachments/assets/d63a9635-6cde-445d-98d0-07ae6e15ca21)



*** kubefwd
https://github.com/txn2/kubefwd


-->
