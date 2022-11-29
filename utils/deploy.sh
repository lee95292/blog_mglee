#!/bin/bash
BLOG_PATH="/Users/myeonggyu/github/blog_mglee/"
BLOG_NAME="BLOG.MGLEE.DEV"
echo "=====  ${BLOG_NAME}:    deploy process start  ======"
echo "=====  ${BLOG_NAME}:    build start..         ======"
cd ${BLOG_PATH}
npm run build

echo "=====  ${BLOG_NAME}:    deploy start..        ======"
# 1. 빌드한 블로그 클론 리포지토리에 복사
rm -rf "${BLOG_PATH}publish"
mkdir "${BLOG_PATH}publish"
git clone https://github.com/lee95292/lee95292.github.io ${BLOG_PATH}publish
cp -r ${BLOG_PATH}public/ ${BLOG_PATH}publish

# 2. 커밋/푸쉬 (배포)
echo "=====  ${BLOG_NAME}:    Commit-push        ======"
cd ${BLOG_PATH}publish
export LANG='en_US.UTF-8'
git commit -am "$(date)"
git push origin master

rm -rf ${BLOG_PATH}publish
