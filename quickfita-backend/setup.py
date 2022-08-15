from setuptools import setup

setup(
    name='quickfita',
    version='0.1.0',
    description='A simple app to browse movies and TV shows, linking them to other apps',
    url='https://github.com/MatthewScholefield/quickfita',
    author='Matthew D. Scholefield',
    author_email='matthew331199@gmail.com',
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Developers',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
    ],
    keywords='quickfita',
    packages=['quickfita'],
    install_requires=[
        'fastapi',
        'requests',
        'uvicorn-loguru-integration',
        'loguru',
        'uvicorn',
        'pydantic[dotenv]',
    ],
    entry_points={
        'console_scripts': ['quickfita=quickfita.__main__:main'],
    },
)
