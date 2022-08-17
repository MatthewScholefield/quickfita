local dc = import 'docker-compose.libsonnet';

dc.QuickFitaDeployment(
  env='dev',
  tmdbApiKey='abc123'
)
