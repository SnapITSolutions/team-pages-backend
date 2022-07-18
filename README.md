# Setup

Open your terminal and run the following commands.

```sh
git clone git@github.com:SnapITSolutions/team-pages-backend.git
cd team-pages-backend
cp .env.example .env
```

## Running Docker

If this is a fresh install of the repository then simply run the following.

```sh
docker-compose up
```

## Updating With Docker

If you are updating the repository then run the following.

```sh
git pull origin main
docker-compose down # To shutdown the current instance
docker-compose up --build
```

# Endpoints

## Getting all Members

```
GET /members
```

**Example**

```
> GET /members
> Response:
| [
| 	{
| 		"id": "0194970d-ecc5-4393-b471-7c72af47343b",
| 		"firstName": "Dylan",
| 		"lastName": "Hackworth",
| 		"jobLikes": "It's heart warming to watch students become zero to 100.",
| 		"interests": "Photography Reading Cycling Backpacking",
| 		"pronouns": "he/him",
| 		"title": "Computer Programming Instructor",
| 		"startYear": 2021,
| 		"wasApprentice": false,
| 		"linkedin": "dylhack",
| 		"github": "dylhack",
| 		"youtube": null,
| 		"personal": null,
| 		"instagram": "dylhack_"
| 	}
| ]
```

## Getting a Member

```
GET /members/:id
```

**Example**

```
> GET /members/4725a954-1886-47f5-b868-2b6fae29bb52
> Response:
| {
| 	"id": "0194970d-ecc5-4393-b471-7c72af47343b",
| 	"firstName": "Dylan",
| 	"lastName": "Hackworth",
| 	"jobLikes": "It's heart warming to watch students become zero to 100.",
| 	"interests": "Photography Reading Cycling Backpacking",
| 	"pronouns": "he/him",
| 	"title": "Computer Programming Instructor",
| 	"startYear": 2021,
| 	"wasApprentice": false,
| 	"linkedin": "dylhack",
| 	"github": "dylhack",
| 	"youtube": null,
| 	"personal": null,
| 	"instagram": "dylhack_"
| }
```

## Updating a Member

```
PUT /members/:id
Content-Type: application/json
Authorization: Bearer TOKEN
```

**Example**

The properties provided in the request body will overwrite the values in the
database.

```
> PUT /members/0194970d-ecc5-4393-b471-7c72af47343b
> Content-Type: application/json
> Authorization: Bearer DEV_TOKEN
> Body: 
| {
| 	"firstName": "Dylan",
| 	"lastName": "Hackworth",
| 	"pronouns": "he/him",
| 	"title": "Computer Programming Instructor",
| 	"startYear": 2021,
| 	"wasApprentice": false,
| 	"jobLikes": "It's heart warming to watch students become zero to 100.",
| 	"interests": "Photography Reading Cycling Backpacking",
| 	"linkedin": "dylhack",
| 	"github": "dylhack",
| 	"instagram": "dylhack_"
| }
> Response:
| {
| 	"id": "0194970d-ecc5-4393-b471-7c72af47343b",
| 	"firstName": "Dylan",
| 	"lastName": "Hackworth",
| 	"jobLikes": "It's heart warming to watch students become zero to 100.",
| 	"interests": "Photography Reading Cycling Backpacking",
| 	"pronouns": "he/him",
| 	"title": "Computer Programming Instructor",
| 	"startYear": 2021,
| 	"wasApprentice": false,
| 	"linkedin": "dylhack",
| 	"github": "dylhack",
| 	"youtube": null,
| 	"personal": null,
| 	"instagram": "dylhack_"
| }
```

## Adding a Member

```
POST /members
Content-Type: application/json
Authorization: Bearer TOKEN
```

**Example**

```
> POST /members
> Content-Type: application/json
> Authorization: Bearer DEV_TOKEN
> Body:
| {
| 	"firstName": "Adil",
| 	"lastName": "Lari",
| 	"jobLikes": "I love working in an environment where I'm able to learn and grow alongside my coworkers.",
| 	"interests": "I enjoy hiking, camping, and motorcycling!",
| 	"pronouns": "he/him",
| 	"title": "Backend Developer",
| 	"startYear": 2018,
| 	"wasApprentice": true
| }
> Response:
| {
| 	"id": "c85315a6-a1cf-44a2-847a-94ec60f37109",
| 	"firstName": "Adil",
| 	"lastName": "Lari",
| 	"jobLikes": "I love working in an environment where I'm able to learn and grow alongside my coworkers.",
| 	"interests": "I enjoy hiking, camping, and motorcycling!",
| 	"pronouns": "he/him",
| 	"title": "Backend Developer",
| 	"startYear": 2018,
| 	"wasApprentice": true,
| 	"linkedin": null,
| 	"github": null,
| 	"youtube": null,
| 	"personal": null,
| 	"instagram": null
| }
```

## Deleting a Member

```
DELETE /members/:id
Authorization: Bearer TOKEN
```

An empty response is provided with an HTTP status code 200 if it completed 
successfully. 404 is provided if it is incorrect.

## Get an Avatar

```
GET /avatars/:filename
```

The filename provided must include an extension as well.

**Example**

```
> GET /avatars/id.jpg
> Response: Image Buffer
```

## Set an Avatar

```
PUT /avatars/:id
Content-Type: multipart/form-data
Authorization: Bearer TOKEN
```

**Example**

```
> PUT /avatars/:id
> Authorization: Bearer TOKEN
> Content-Type: multipart/form-data
> Body:
	avatar: (Image Buffer)
> Response: 200 OK
```
