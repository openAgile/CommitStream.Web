curl -X POST --user admin:changeit http://localhost:2113/projection/\$by_event_type/command/enable -H "Content-Length: 0"
curl -X POST --user admin:changeit http://localhost:2113/projection/\$by_category/command/enable -H "Content-Length: 0"
curl -X POST --user admin:changeit http://localhost:2113/projection/\$stream_by_category/command/enable -H "Content-Length: 0"
curl -X POST --user admin:changeit http://localhost:2113/projection/\$streams/command/enable -H "Content-Length: 0"