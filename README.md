
## YouTube Data Fetcher Service

### Sections :
* [Project Goal](#project-goal-)
* [Tech Stacks](#tech-stacks-%EF%B8%8F)
* [How to run](#how-to-run-)
* [Accomplishments](#accomplishments)

### Project Goal:

A Service to make an API to fetch latest videos sorted in reverse chronological order of their publishing date-time from YouTube for a given tag/search query in a paginated response.

### Tech Stack:

* This project is made in `Node.js`, `Express.js` and `MongoDB`.
* MongoDB is used due to two main reasons - it scales well with Node.js and provides a better write performance as compared to a SQL database.

### How to run:

##### Requirements:
- Docker
- Node
- Git

##### Instructions:
* Clone the repository `git clone https://github.com/Smit2010/YouTubeDataFetcherService.git`
* Populate API_KEYS, DB_NAME, MONGO_URI with the corresponding values and can also change the settings of other env variables in `docker-compose.yml` file
* Go to the directory and run `docker compose up` or `docker-compose up`.
* To start the application locally, go to the directory and follow: 
	* `npm i`
	* `node app.js`
* Application will be available at `http://localhost:8000`

### Accomplishments:
- Cron Job to periodically fetch data from YouTube
- APIs for
    * Generalized Search API to get the paginated response of the data sorted in descending order of published time
    * A Search API to search data using their title and description with custom filters and sorting.
- A Dashboard to view the data and perform search with filters and sorting. Refer [YouTubeDataDashboard](https://github.com/Smit2010/YouTubeDataUI).
- Tried to optimize the searching by creating a custom search index on the collection which trims the stop words from the search query and executes a search using `lucene` search engine on `title` and `description` fields of the data stored.
- Project Dockerization
