local dc = import 'libs/docker-compose-jsonnet/dc.libsonnet';

// url can be http://localhost:1234 but 1234 needs to be added to openPorts
local portLabelsConfig(url, containerPort) = dc.labelAttributes({
  caddy: url,
  'caddy.reverse_proxy': '{{upstreams %s}}' % [containerPort],
  'caddy.header': '/* { -Server }',
});

local makeCaddyDeployment(openPorts) = (
  dc.Deployment(
    services={
      caddy: dc.Service({
        image: 'lucaslorentz/caddy-docker-proxy:2.7.1-alpine',
        volumes: [
          '/var/run/docker.sock:/var/run/docker.sock',
          'caddy-data-volume:/data',
          'caddy-config-volume:/config',
        ],
        deploy: dc.DeploymentConfig({
          placement: { constraints: ['node.role == manager'] },
          update_config: {
            order: 'stop-first',
            failure_action: 'rollback',
            delay: '3s',
          },
          rollback_config: {
            parallelism: 0,
            order: 'stop-first',
          },
        }),
        restart: 'unless-stopped',
      } + dc.bindOrExpose(openPorts, bindToHost=dc.usingSwarm)),
    },
    volumes=[
      'caddy-data-volume',
      'caddy-config-volume',
    ],
  )
);

local makeFrontendDeployment(frontendUrl, backendUrl) = dc.Deployment(
  services={
    'quickfita-frontend': dc.Service({
      build: {
        context: 'quickfita-frontend/',
        dockerfile: 'Dockerfile',
      },
      environment: dc.Env({
        REACT_APP_BACKEND_URL: backendUrl,
      }),
      expose: ['3022'],
      volumes: [
        './quickfita-frontend/:/quickfita-frontend/',
        '/quickfita-frontend/node_modules/',
        '/dev/null:/quickfita-frontend/.env.local',
      ],
      command: 'yarn start',
    } + portLabelsConfig(frontendUrl, 3022)),
  }
);

local makeBackendDeployment(backendUrl, tmdbApiKey) = dc.Deployment(
  services={
    'quickfita-backend': dc.Service({
      image: dc.localImage('quickfita-backend'),
      build: {
        context: 'quickfita-backend/',
        dockerfile: 'Dockerfile',
      },
      environment: dc.Env({
        TMDB_API_KEY: tmdbApiKey,
      }),
      healthcheck: dc.HealthCheck("python3 -c 'import requests; exit(not \"detail\" in requests.get(\"http://localhost:8077\").json())'"),
    } + portLabelsConfig(backendUrl, 8077)),
  },
);

{
  Envs: {
    dev: 'dev',
    prod: 'prod',
  },
  QuickFitaDeployment(
    env,  // "dev" / "prod" | Environment

    frontendUrl=if env == $.Envs.dev then 'http://localhost:3022' else error 'frontendUrl not specified',
    backendUrl='http://localhost:8077',

    tmdbApiKey,  // "abc123"

    openPorts=[3022, 8077],  // Public ports to open in reverse proxy. Use 80,443 for https. Use null to remove caddy
  ): (
    dc.composeFileDeployments([i for i in [
      makeBackendDeployment(backendUrl, tmdbApiKey),
      if env == 'dev' then makeFrontendDeployment(frontendUrl, backendUrl),
      if openPorts != null then makeCaddyDeployment(openPorts),
    ] if i != null])
  ),
}
