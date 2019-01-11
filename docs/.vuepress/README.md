# 0xcet Documentation

We are using VuePress for building our documentation pages. Start by installing the dependencies.

```bash
$ npm i -g vuepress
```

Then run the VuePress server in development mode.

```bash
$ npm dev docs
```

Files are built locally from .md files located in `/docs` folder and generated into a `/docs/.vuepress/dist` folder. To deploy the documentation, simply go to `/docs/.vuepress/` and run `deploy.sh` script.

```bash
$ cd ./docs/.vuepress/
$ ./deploy.sh
```
