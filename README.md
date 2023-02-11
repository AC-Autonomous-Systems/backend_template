1. Install dependencies

   - npm install

Notes:

1. Changing field value in mongosh:
   - example: db.products.updateMany({}, {$rename: {"tax": "taxPercentage"}}, false, true)
