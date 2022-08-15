from pydantic import BaseSettings


class Config(BaseSettings):
    tmdb_api_key: str
    backend_port: int = 8077
    debug = False

    class Config:
        env_file = '.env'


config = Config()
