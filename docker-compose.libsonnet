local dc = import 'libs/docker-compose-jsonnet/dc.libsonnet';


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
    } + dc.apps.caddyProxyConfig(frontendUrl, 3022)),
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
    } + dc.apps.caddyProxyConfig(backendUrl, 8077)),
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
    defaultNetwork='quickfita-%s_default' % [env], // May change based on platform. Identify with `docker network ls`
  ): (
    dc.composeFileDeployments([i for i in [
      makeBackendDeployment(backendUrl, tmdbApiKey),
      if env == 'dev' then makeFrontendDeployment(frontendUrl, backendUrl),
      if openPorts != null then dc.apps.caddyDeployment(openPorts, networks=[defaultNetwork]),
    ] if i != null])
  ),
}
