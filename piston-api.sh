# curl -X POST http://localhost:2000/api/v2/packages \
#   -H "Content-Type: application/json" \
#   -d '{"language": "python", "version": "3.12.0"}'   

# curl -X POST http://localhost:2000/api/v2/packages \
#   -H "Content-Type: application/json" \
#   -d '{"language": "java", "version": "*"}'

curl -X POST http://localhost:2000/api/v2/packages \
  -H "Content-Type: application/json" \
  -d '{"language": "node", "version": "*"}'

curl -X POST http://localhost:2000/api/v2/packages \
  -H "Content-Type: application/json" \
  -d '{"language": "gcc", "version": "*"}'


