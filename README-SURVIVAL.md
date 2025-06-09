## Verdaccio

- url: http://localhost/verdaccio [TEM QUE CRIAR USUÁRIO!!!]
- kubernetes:
  - kubectl exec -it verdaccio-0 -n laniakea-local -- sh
  - kubectl exec -it verdaccio-0 -n laniakea-local -- sh -c 'rm -rf /verdaccio/storage/@ix/laniakea-lib-audit'

arn grunt publish-local --workspace=libs --projects=laniakea-lib-http --build-type=nestexit
