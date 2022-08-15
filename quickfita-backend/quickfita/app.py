from typing import List, Optional
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

from .config import config


class ExactModel(BaseModel):
    class Config:
        extra = 'forbid'


app = FastAPI(openapi_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


class ShowResult(ExactModel):
    id: str
    title: str
    overview: str
    poster_path: Optional[str] = None
    vote_average: float
    media_type: str


class SearchAllResponse(ExactModel):
    results: List[ShowResult]


@app.get('/search-all', response_model=SearchAllResponse)
def search_movies(query: str):
    results = requests.get(
        f'https://api.themoviedb.org/3/search/multi',
        params=dict(api_key=config.tmdb_api_key, query=query),
    ).json()['results']
    return SearchAllResponse(
        results=[
            ShowResult(
                id=res['id'],
                title=res.get('title') or res.get('name'),
                overview=res['overview'],
                poster_path=res['poster_path'],
                vote_average=res['vote_average'],
                media_type=res['media_type'],
            )
            for res in results
            if res['media_type'] in ['movie', 'tv']
        ]
    )
