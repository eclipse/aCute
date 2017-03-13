VERSION_COMMIT=$(git log -1 --format="%h %s %b" | grep -a "release bump");
if [ -n "$VERSION_COMMIT" ]; then TAG_COMMIT="patch"; fi;
VERSION_COMMIT=$(git log -1 --format="%h %s %b" | grep -a "release patch");
if [ -n "$VERSION_COMMIT" ]; then TAG_COMMIT="patch"; fi;
VERSION_COMMIT=$(git log -1 --format="%h %s %b" | grep -a "release minor");
if [ -n "$VERSION_COMMIT" ]; then TAG_COMMIT="minor"; fi;
VERSION_COMMIT=$(git log -1 --format="%h %s %b" | grep -a "release major");
if [ -n "$VERSION_COMMIT" ]; then TAG_COMMIT="major"; fi;

echo TRAVIS_SECURE_ENV_VARS = $TRAVIS_SECURE_ENV_VARS
echo TRAVIS_BRANCH = $TRAVIS_BRANCH
echo TAG_COMMIT = $TAG_COMMIT
chmod 600 ~/.ssh/id_rsa
echo "//registry.npmjs.org/:_authToken=$NPM_API_KEY" > ~/.npmrc

if [ "$TRAVIS_SECURE_ENV_VARS" = "true" ] && [ -n "$TAG_COMMIT" ]; then
	echo publishing version $TAG_COMMIT

    git config --global user.name "OmniSharp Bot"
    git config --global user.email "omnisharp-bot@users.noreply.github.com"

	git remote add github git@github.com:OmniSharp/omnisharp-node-client.git
    git fetch github
	git reset --hard

	TAG=$(npm version $TAG_COMMIT -m "[travis] Tagging release %s")
	BRANCH_NAME="release/$TAG"
	git checkout -b $BRANCH_NAME
	git rebase $TAG $BRANCH_NAME
	git push github $BRANCH_NAME
	git push github --tags
	npm publish
	curl -X POST -H 'Authorization: token '$GITHUB_API_TOKEN'' -d '{ "title": "Automated release '$TAG'", "body": "*Automated PR*  -  Upgrade omnisharp-roslyn to '$TAG'. [release patch]", "head": "'$BRANCH_NAME'", "base": "master" }' https://api.github.com/repos/OmniSharp/omnisharp-node-client/pulls
fi;

if [ "$TRAVIS_SECURE_ENV_VARS" = "true" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ] && [ "$TRAVIS_BRANCH" = "master" ] && [ -z "$TAG_COMMIT" ]; then
	npm --no-git-tag-version version minor
	echo publishing npm tag "@next"
	npm publish --tag next
fi;
