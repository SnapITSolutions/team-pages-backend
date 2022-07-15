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

 - Endpoint: `GET /members`
 - Token Required: No

**Response Body Example**

```json
[
  {
    "id": "c85315a6-a1cf-44a2-847a-94ec60f37109",
    "firstName": "Adil",
    "lastName": "Lari",
    "jobLikes": "I love working in an environment where I'm able to learn and grow alongside my coworkers.",
    "interests": "I enjoy hiking, camping, and motorcycling!",
    "pronouns": "he/him",
    "title": "Backend Developer",
    "startYear": 2018,
    "wasApprentice": true,
    "linkedin": null,
    "github": null,
    "youtube": null,
    "personal": null,
    "instagram": null
  }
]
```

## Getting a Member

 - `GET /members/:id`
 - Token Required: No

**Response Body Example**

```json
{
	"id": "c85315a6-a1cf-44a2-847a-94ec60f37109",
	"firstName": "Adil",
	"lastName": "Lari",
	"jobLikes": "I love working in an environment where I'm able to learn and grow alongside my coworkers.",
	"interests": "I enjoy hiking, camping, and motorcycling!",
	"pronouns": "he/him",
	"title": "Backend Developer",
	"startYear": 2018,
	"wasApprentice": true,
	"linkedin": null,
	"github": null,
	"youtube": null,
	"personal": null,
	"instagram": null
}
```

## Updating a Member

 - `PUT /members/:id`
 - Token Required: **Yes**

**Example body**

The body provided should have all of the required attributes of a team member.

```json
{
	"firstName": "Adil",
	"lastName": "Lari",
	"jobLikes": "I love working in an environment where I'm able to learn and grow alongside my coworkers.",
	"interests": "I enjoy hiking, camping, and motorcycling!",
	"pronouns": "he/him",
	"title": "Backend Developer",
	"startYear": 2018,
	"wasApprentice": true,
}
```

**Response Body**

All of the data provided in the request is sent back to the client along with 
an ID.

```json
{
	"id": "c85315a6-a1cf-44a2-847a-94ec60f37109",
	"firstName": "Adil",
	"lastName": "Lari",
	"jobLikes": "I love working in an environment where I'm able to learn and grow alongside my coworkers.",
	"interests": "I enjoy hiking, camping, and motorcycling!",
	"pronouns": "he/him",
	"title": "Backend Developer",
	"startYear": 2018,
	"wasApprentice": true,
	"linkedin": null,
	"github": null,
	"youtube": null,
	"personal": null,
	"instagram": null
}
```

## Adding a Member

 - `POST /members`
 - Token Required: **Yes**

**Example Request body**

If a property is optional then it does not need to be added to the body.

```json
{
	"firstName": "Adil",
	"lastName": "Lari",
	"jobLikes": "I love working in an environment where I'm able to learn and grow alongside my coworkers.",
	"interests": "I enjoy hiking, camping, and motorcycling!",
	"pronouns": "he/him",
	"title": "Backend Developer",
	"startYear": 2018,
	"wasApprentice": true
}
```

**Response Body**

All of the data provided in the request is sent back to the client along with 
an ID.

```json
{
	"id": "c85315a6-a1cf-44a2-847a-94ec60f37109",
	"firstName": "Adil",
	"lastName": "Lari",
	"jobLikes": "I love working in an environment where I'm able to learn and grow alongside my coworkers.",
	"interests": "I enjoy hiking, camping, and motorcycling!",
	"pronouns": "he/him",
	"title": "Backend Developer",
	"startYear": 2018,
	"wasApprentice": true,
	"linkedin": null,
	"github": null,
	"youtube": null,
	"personal": null,
	"instagram": null
}
```

## Deleting a Member

 - `DELETE /members/:id`
 - Token Required: Yes

An empty response is provided with an HTTP status code 200 if it completed 
successfully. 404 is provided if it is incorrect.
