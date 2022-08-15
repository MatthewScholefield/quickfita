from setuptools import setup

setup(
    name='quickfita',
    version='0.1.0',
    description='Simple frontend for 2embed.to',
    url='https://github.com/GIT_USER/quickfita',
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
    install_requires=[],
    entry_points={
        'console_scripts': [
            'quickfita=quickfita.__main__:main'
        ],
    }
)
