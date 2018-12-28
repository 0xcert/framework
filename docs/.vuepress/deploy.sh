
set -e
cd ../..
vuepress build docs
cd docs/.vuepress/dist
echo 'docs.0xcert.org' > CNAME
git init
git add -A
git commit -m "Deploy documentation"
git push -f git@github.com:0xcert/docs master
cd -