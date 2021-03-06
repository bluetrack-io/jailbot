# jailbot
The City of Denton Police Department publishes a list of current inmates at the city jail on a [public website](https://athena.dentonpolice.com/jailview/JailView.aspx).

There is no historical record of this information, yet many citizens use it to get information and over time
there are questions about various stats that result from the data published there.

This project seeks to facilitate the scraping, archiving and querying of this data for information over time.

## Structure
This app is split into two major components, _client_ and _server_.

Client is a React-powered single-page application. Server is a Node/Express runtime.

### Server
Server has 3 main functions
1. Maintain the database
    - Runs migration scripts to build/modify tables (uses knex.js)
2. Create and save "batches" at regular intervals
    - a "batch" is a single scrape of the upstream website
    - it runs in the same runtime as the API server
3. Accept and respond to API requests

## Building
This project is intended to be run as a Docker container.
To build it you can run:
```sh
docker build .
```

If you want to build and run the image (i.e. During development):
```sh
docker run --rm $(docker build -q .)
```

The container will use a volume at `/data` (by default) for persistence.
The volume owner should be UID 1000.

## Configuration
You can configure some runtime settings with environment variables
- `DATA_DIR` - Where files will be saved
- `HTTP_ENABLED` - Set to `false` to disable the web server
- `HTTP_PORT` - The port the webserver listens on (default: `3000`)
- `BATCH_INTERVAL_SECONDS` - How often to run the batch job in seconds (default: `300`)
  - Only respected if webserver is enabled
  - Set to `0` to disable
