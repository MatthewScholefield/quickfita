from argparse import ArgumentParser
import uvicorn
from uvicorn_loguru_integration import run_uvicorn_loguru


from .config import config


def main():
    parser = ArgumentParser(
        description='A simple app to browse movies and TV shows, linking them to other apps'
    )
    sp = parser.add_subparsers(dest='action')
    sp.required = True
    sp.add_parser('run')
    args = parser.parse_args()
    if args.action == 'run':
        run_uvicorn_loguru(
            uvicorn.Config(
                'quickfita.app:app',
                host='0.0.0.0',
                port=config.backend_port,
                log_level=['info', 'debug'][config.debug],
                proxy_headers=True,
                forwarded_allow_ips='*',
            ),
            force_exit=config.debug,
        )


if __name__ == '__main__':
    main()
