from tmdbv3api import TMDb, Movie
from .config import config

tmdb = TMDb()
tmdb.api_key = config.tmdb_api_key
tmdb_movie = Movie()
