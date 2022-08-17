FROM python:3.9.6-slim AS base

ENV PIP_NO_CACHE_DIR=1

WORKDIR /quickfita-backend/

CMD ["quickfita", "run"]

FROM base AS dev

ENV DEBUG True
COPY /setup.py /quickfita-backend/setup.py
RUN pip install -e '/quickfita-backend[test,develop]'

COPY / /quickfita-backend
RUN pip install -e '/quickfita-backend[test,develop]'

# ========

FROM base as prod

COPY /. /quickfita-backend/

RUN pip install /quickfita-backend
