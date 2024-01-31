mongoimport --uri mongodb+srv://admin:FishPark5@cluster0.yc8oupt.mongodb.net  --db=gameHub --collection=games --drop --jsonArray --file=db/collections/games.json

mongoimport --uri mongodb+srv://admin:FishPark5@cluster0.yc8oupt.mongodb.net  --db=gameHub --collection=users --drop --jsonArray --file=db/collections/users.json

mongoimport --uri mongodb+srv://admin:FishPark5@cluster0.yc8oupt.mongodb.net  --db=gameHub --collection=scores --drop --jsonArray --file=db/collections/scores.json

mongoimport --uri mongodb+srv://admin:FishPark5@cluster0.yc8oupt.mongodb.net  --db=gameHub --collection=themes --drop --jsonArray --file=db/collections/themes.json
