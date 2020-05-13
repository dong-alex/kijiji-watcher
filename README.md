### Introduction
Self-deployable application that will help you monitor car listings on Kijiji.

If you are looking for multiple used or new models and would like to ease the work needed to search up multiple listings, this application will help you keep a single view of all of the ads you want to watch.

Enter the exact Kijiji urls (per page) and it will scrape the site at that url for the available listings and information. A link will be provided to you to navigate to the actual listing.

Currently only working locally. It can be adjusted to be hosted on the cloud but the resources required is unknown.

The general idea with this application is to utilize BeautifulSoup and its web scraping capabilities to obtain the listings from a set of URLs that we have saved as a watchlist. Each URL has a tag associated to it so that we can easily differentiate between them. Through a click of the button, the server will obtain all of the ads from every URL and display it onto one screen. Its information such as pricing, description, and general vehicle description will be displayed. A quick filter is available at the moment to find ads specific to a url that we have tagged with.

### Technologies
* Flask - Backend
* sqlite - DB (SQLAlchemy ORM)
* React - Frontend
* Material-UI - CSS

### Setup Backend
1. Setup your virtual environment for Python 3
2. Navigate towards `/server` and install the required dependencies using `pip3 install -requirements`
3. Create your own local DB (sqlite3) using `flask db init` `flask db migrate` `flask db upgrade`. This should setup all the required tables for the application to work.
4. Run your server in one terminal using `flask run`

The Python backend will be running on port 3000 and you will be able to communicate with it via `http://localhost:5000`

### Setup Frontend
1. Navigate towards `/dashboard`
2. Ensure the proper dependencies are updated using `yarn`
3. Run the server `yarn start`

The React frontend will be running on port 5000 and you will be able to see the application `http://localhost:3000`

### How to use
1. The general homepage will show the watchlisted URLs as well as a small form to add new URLs and tags. The tag is required in the submission. An error in the backend in will occur if duplicate URLs are used.
2. Once a URL is registered into the database, navigate to `MY ADS` to see a refresh button. The database and the frontend do not communicate per database update. Refreshing the page will display any past changes if none were shown.
3. The server will attempt to scrape the webpages from the URLs specified for the car listings. It will take around 30s - 1min.
4. The listings should then be displayed in front of you, with the ability to filter for the listings associated to the URL.

### Incompletes
1. General backend cleanup
2. Proper sorting (Kijiji and DB constrained)
3. General Ads (not just vehicles)
4. Obtaining better information (such as year from the description/title)
5. Error Checking - Assumes only proper input
6. Cleaner web scraping
7. Consistent updating
