#!/bin/bash

#The next 3 line should be added in post-commit file under hooks folder 
#REPOS="$1"
#REV="$2"
#"$REPOS"/hooks/commit-event.sh "$REPOS" "$REV"


SVNPATH="$1"
REVISION="$2"

REPOSITORY="PLACE REPO URL HERE"
HTML_URL="PLACE BASE URL TO INSPECT YOUR REVISIONS"
ENDPOINT="PLACE INBOX URL HERE"

COMMITEVENTHEADER="CS-SVN-Event:Commit Event"
APPJSONHEADER="Content-Type:application/json"

svnlook="/usr/bin/svnlook"
svn="/usr/bin/svn"

LOG=`$svnlook log -r $REVISION $SVNPATH | sed ':a;N;$!ba;s/\n/\\\\n /g'`
WHO=`svnlook author -r $REVISION $SVNPATH`
WHEN=`svnlook date -r $REVISION $SVNPATH`
CHANGES=`svnlook changed -r $REVISION $SVNPATH`

mapfile -t array <<< "$CHANGES"

CHANGESFORJSON=""
for index in ${!array[@]}; do
    i=$(($index + 1))
    if [ "$i" -eq ${#array[@]} ];then
        CHANGESFORJSON+="${array[index]}"
    else
        CHANGESFORJSON+="${array[index]},"
    fi
done

PAYLOAD='{"pretext":"Commit completed: rev. '"$REVISION"'","committer":{"name":"'"$WHO"'","date":"'"$WHEN"'"},"author":"'"$WHO"'","revision":"'"$REVISION"'","message":"'"$LOG"'","changes":['"$CHANGESFORJSON"'], "repository":"'"$REPOSITORY"'", "html_url":"'"$HTML_URL$REVISION"'"}'

curl -X POST -H "$COMMITEVENTHEADER" -H "$APPJSONHEADER" --data "$PAYLOAD" "$ENDPOINT"
