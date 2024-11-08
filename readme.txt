   mongodb connection stting
   username=tshidaisa pin=WrvBjKCXzN41wbX2




  // role :user

   curl -X POST http://localhost:4000/api/login \
     -H "Content-Type: application/json" \
     -d '{
           "email": "michael@example.com",   
           "password": "mike123"
         }'


//admin 

curl -X POST http://localhost:4000/api/login \
     -H "Content-Type: application/json" \
     -d '{
           "email": "happy@example.com",    
           "password": "happy123"
         }'
