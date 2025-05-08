# chrome extention that copy tab url to airtable

# Log
## v001
- create chrome extention that copy tab url to airtable 
- create manifest.json
- create popup.html
- create popup.js



# Github CHEATSHEET
## load last updates and replace existing local files
git fetch origin; git reset --hard origin/master; git clean -fd

## выбери хэш среди получиных последних 10
git log --oneline -n 10

## используй хэш для получения именно этого сахронения локально
git fetch origin; git checkout master; git reset --hard 1eaef8b;; git clean -fdx

## Quick github update
git add .
git commit -m "working version v0.1.0"
git push
