# Brigade Dashboard

![build](https://badgr.brigade2.io/v1/github/checks/brigadecore/brigade-dashboard/badge.svg?appID=99005&branch=main)
[![slack](https://img.shields.io/badge/slack-brigade-brightgreen.svg?logo=slack)](https://slack.brigade.sh)

<img width="100" align="left" src="logo.png">

This is a _highly volatile prototype_ for a web-based, v2-compatible, Brigade
dashboard.


Your mileage may vary.

<br clear="left"/>

## Installation

> ⚠️&nbsp;&nbsp;Be sure you are using
> [Helm 3.7.0](https://github.com/helm/helm/releases/tag/v3.7.0) or greater and
> enable experimental OCI support:
>
> ```shell
> $ export HELM_EXPERIMENTAL_OCI=1
> ```

1. As the dashboard requires some specific configuration, we'll first create a
   values file containing those settings. Use the following command to extract
   the full set of configuration options into a file you can modify:

   ```shell
   $ helm inspect values oci://ghcr.io/brigadecore/brigade-dashboard \
       --version v0.1.0 > ~/brigade-dashboard-values.yaml
   ```

1. Edit `~/brigade-dashboard-values.yaml`, making the following changes:

   * `brigade.apiAddress`: Set this to the address of the Brigade API server,
     beginning with `https://`.

   * `host`: Set this to the fully qualified domain name that will resolve to
     the dashboard. If you do not intend to create a DNS entry for the
     dashboard, you may ignore this field and leave its default value.

   * `service.type`: If you plan to enable ingress (advanced) or you're
     installing on a local, development-grade Kubernetes cluster that cannot
     provision a public IP for the dashboard, you can leave this as its default
     -- `ClusterIP`. If you are deploying the dashboard to a remote Kubernetes
     cluster with intentions for the dashboard to be publicly accessible, you
     should change this value to `LoadBalancer`.

   > ⚠️&nbsp;&nbsp;By default, TLS will be enabled and a self-signed certificate
   > will be generated.
   >
   > For a production-grade deployment you should explore the options available
   > for providing or provisioning a certificate signed by a trusted authority.
   > These options can be located under the `tls` and `ingress.tls` sections of
   > the values file.

1. Save your changes to `~/brigade-dashboard-values.yaml`.

1. Use the following command to install the dashboard:

   ```shell
   $ helm install brigade-dashboard \
       oci://ghcr.io/brigadecore/brigade-dashboard \
       --version v0.1.0 \
       --create-namespace \
       --namespace brigade-dashboard \
       --values ~/brigade-dashboard-values.yaml \
       --wait
   ```

## Accessing the Dashboard

If you have deployed the dashboard to a remote Kubernetes cluster, have _not_
enabled ingress, and have set the value of `service.type` to `LoadBalancer`,
you may find the public IP of the dashboard with the following command:

```shell
$ kubectl get svc brigade-dashboard \
    --namespace brigade-dashboard \
    --output jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

If you overrode default configuration to enable support for an ingress
controller, you probably know what you're doing well enough to track down the
correct IP for that ingress controller without our help. 😉

If you have deployed the dashboard to a local, development-grade cluster, use
the following command to map a port on the local network interface to the
dashboard:

```shell
$ kubectl port-forward svc/brigade-dashboard \
    --namespace brigade-dashboard \
    8443:443
```

## Contributing

The Brigade project accepts contributions via GitHub pull requests. The
[Contributing](CONTRIBUTING.md) document outlines the process to help get your
contribution accepted.

## Support & Feedback

We have a slack channel! [Kubernetes/#brigade](https://slack.brigade.sh) Feel
free to join for any support questions or feedback, we are happy to help. To
report an issue or to request a feature open an issue
[here](https://github.com/brigadecore/brigade-dashboard/issues)

## Code of Conduct

Participation in the Brigade project is governed by the
[CNCF Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md).
