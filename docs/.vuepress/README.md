
# 0xcet Documentation

We are using VuePress tool for building our documentation page. To install it, run:

```bash
$ npm i -g vuepress
```

Files are built locally from .md files located in `/docs` folder and generated into a `/docs/.vuepress/dist` folder. 

To deploy the documentation, simply go to `/docs/.vuepress/` and run `deploy.sh` script.

```bash
$ cd /docs/.vuepress/
$ ./deploy.sh
```