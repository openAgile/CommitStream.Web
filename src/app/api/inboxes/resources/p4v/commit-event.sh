#!/bin/bash

#The next 3 line should be added in post-commit file under hooks folder
#REPOS="$1"
#REV="$2"
#"$REPOS"/hooks/commit-event.sh "$REPOS" "$REV"

p4AdminUser="ADMINISTRATOR CREDENTIALS HERE"
p4AdminPass="ADMINISTRATOR CREDENTIALS HERE"

REVISION="$1"
user="$2"
client="$3"
server="$4"

REPOSITORY="PLACE REPO URL HERE"
HTML_URL=""
ENDPOINT="PLACE INBOX URL HERE"

COMMITEVENTHEADER="CS-P4V-Event:Commit Event"
APPJSONHEADER="Content-Type:application/json"

#THIS SHOULD BE THE PATH FOR P4 EXECUTABLE
p4="/bin/p4"

result=`$p4 -c $client -p $server -u $p4AdminUser -P $p4AdminPass describe -s -f $REVISION`
mapfile -t splitResult <<< "$result"

indexOfAffectedFiles=0
index=0
    while [ "$index" -lt "${#splitResult[@]}" ]; do
        if [ "${splitResult[$index]}" = "Affected files ..." ]; then
            indexOfAffectedFiles=$index
            return
        fi
        let "index++"
    done

otherIndex=$((indexOfAffectedFiles+1))
    while [ "$otherIndex" -lt "${#splitResult[@]}" ]; do
        if [[ "${splitResult[$otherIndex]}" = *[!\ ]* ]]; then
            CHANGESFORJSON+=\""${splitResult[$otherIndex]}\","
        fi
        let "otherIndex++"
    done
CHANGESFORJSON="${CHANGESFORJSON::-1}"

LOG=("${splitResult[@]:2:((indexOfAffectedFiles-3))}")

LOG="${LOG[@]}"
LOG=${LOG//[[:space:]]/' '}

authorDate="${splitResult[0]}"
authorDate=( $authorDate )

WHO="${authorDate[3]}"
WHEN=$(date --date="${authorDate[5]} ${authorDate[6]}" -u +"%Y-%m-%dT%H:%M:%SZ")

PAYLOAD='{"pretext":"Commit completed: rev. '"$REVISION"'","committer":{"name":"'"$WHO"'","date":"'"$WHEN"'"},"author":"'"$WHO"'","revision":"'"$REVISION"'","message":"'"$LOG"'","changes":['"$CHANGESFORJSON"'], "repository":"'"$REPOSITORY"'", "html_url":"'"$HTML_URL$REVISION"'"}'

curl -X POST -H "$COMMITEVENTHEADER" -H "$APPJSONHEADER" --data "$PAYLOAD" "$ENDPOINT"