# abort on errors
set -e

# build
vuepress build docs

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
echo 'docs.0xcert.org' > CNAME

git init
git add -A
git commit -m 'Deploy documentation'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:0xcert/framework.git master:gh-pages

cd -
