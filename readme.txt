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


// this is how we test posting recipe and authetication 
//bearer is token 
//createdby is the object id or user id /person who posted a recipe

curl -X POST http://localhost:4000/api/recipe \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MmNhODE4NDMzMDkwOTcxNTU1NTk3MyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMTA0NTAwMiwiZXhwIjoxNzMxMDQ4NjAyfQ.ewt2-OfYzmScs6pVQTrGxAZE3tk87ba0R2-dSrZYj1g" \
    -d '{
        "name": "Spaghetti Carbonara",
        "ingredients": "Spaghetti, Eggs, Bacon, Parmesan, Black Pepper",
        "instructions": "Cook spaghetti. Fry bacon. Mix eggs and cheese. Combine all.",
        "category": "Dinner",
        "preparationTime": 15,
        "cookingTime": 20,
        "servings": 4,
        "createdBy": "672ca8184330909715555973"
    }'
