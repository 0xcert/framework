
# 0xcet Documentation

We are using VuePress tool for building our documentation page. To install it, run:

```bash
$ npm i -g vuepress
```

Files are built locally from .md files located in `/docs` folder and placed into `/docs/.vuepress/dist` folder. You build static files with: 

```bash
$ vuepress build docs
```

Compiled `/docs/.vuepress/dist` folder is GIT submodule repository, so to publish the generated files, you have to add and commit files inside this folder and push it to it's repository. Since the entire /dist folder is rebuilded, .git folder gets deleted too. Therefore we need to re-init the git and force push to docs repository:

```
git init
git add -A
git commit -m 'Deploy documentation'
git push -f git@github.com:0xcert/docs master
```

Make sure to `add`and `commit` the updates of the submodule also in the parent repo.
