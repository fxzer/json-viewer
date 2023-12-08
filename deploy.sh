# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
pnpm build

# 进入生成的文件夹
cd dist/
# 如果是发布到自定义域名

git init
git add -A
git commit -m '🚀Deploy Page'

# 打包后的文件推送到gitee的gh-pages分支

 git push -f git@gitee.com:fxzer/json-viewer.git main:gh-pages
 
 cd ..
