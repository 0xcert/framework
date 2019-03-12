
set -e
npm run build
cd dist
echo 'docs.0xcert.org' > CNAME
git init
git add -A
git commit -m "Deploy documentation"
git push -f git@github.com:0xcert/docs master
cd -
echo ''
echo '-------------------------------------------------------'
echo '  Deployment complete. Visit: https://docs.0xcert.org  '
echo '-------------------------------------------------------'