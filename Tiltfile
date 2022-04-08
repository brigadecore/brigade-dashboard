load('ext://min_k8s_version', 'min_k8s_version')
min_k8s_version('1.18.0')

trigger_mode(TRIGGER_MODE_MANUAL)

load('ext://namespace', 'namespace_create')
namespace_create('brigade-dashboard')
k8s_resource(
  new_name = 'namespace',
  objects = ['brigade-dashboard:namespace'],
  labels = ['brigade-dashboard']
)

docker_build(
  'brigadecore/brigade-dashboard', '.',
  only = [
    'public/',
    'src/',
    '.eslintrc.json',
    'brigade-dashboard.nginx.conf',
    'config-overrides.js',
    'package.json',
    'tsconfig.json',
    'yarn.lock'
  ],
  ignore = ['**/*_test.go']
)
k8s_resource(
  workload = 'brigade-dashboard',
  new_name = 'dashboard',
  port_forwards = '31700:8080',
  labels = ['brigade-dashboard']
)
k8s_resource(
  workload = 'dashboard',
  objects = [
    'brigade-dashboard:configmap',
    'brigade-dashboard:service'
  ]
)

k8s_yaml(
  helm(
    './charts/brigade-dashboard',
    name = 'brigade-dashboard',
    namespace = 'brigade-dashboard',
    set = [
      'brigade.apiAddress=' + os.environ['REACT_APP_BRIGADE_API_ADDRESS'],
      'tls.enabled=false'
    ]
  )
)
