
set -e
cd ../..
vuepress build docs
cd docs/.vuepress/dist
echo 'conventions.0xcert.org' > CNAME
git init
git add -A
git commit -m "Deploy conventions"
git push -f git@github.com:0xcert/conventions master
cd -