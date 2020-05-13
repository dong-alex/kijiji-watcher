from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import load_only
from sqlalchemy import exists, exc
from flask_migrate import Migrate
from datetime import datetime
from app.config import Config
from datetime import datetime
from app.models import (
    db,
    ma,
    SearchURL,
    url_schema,
    urls_schema,
    Listing,
    listing_schema,
    listings_schema,
)
from bs4 import BeautifulSoup
import time
import html5lib
import re
import json
import requests


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    cors = CORS(app)
    db.init_app(app)

    # with app.app_context():
    #     print("DB actions")
    # db.create_all()
    # db.drop_all()

    migrate = Migrate(app, db)
    ma.init_app(app)

    def queryAllURLs():
        urls = SearchURL.query.all()
        result = urls_schema.dump(urls)
        return result

    @app.route("/")
    def default():
        return jsonify(queryAllURLs())

    @app.route("/urls/", methods=["GET", "POST"])
    def urls():
        if request.method == "GET":
            return jsonify(queryAllURLs())

        if request.method == "POST":
            payload = request.get_json(force=True)
            url = payload.get("header", None)
            used = payload.get("used", "0")
            dealer = payload.get("dealer", "0")
            tag = payload.get("tag", None)
            # validate the URL being used -  refactor better
            newURL = SearchURL(
                url=url,
                used=used,
                dealer=dealer,
                active=True,
                tag=tag,
                dateAdded=datetime.now(),
            )

            try:
                db.session.add(newURL)  # add the newAd onto the table - tempoary
                db.session.commit()  # finalize changes onto the table
                return url_schema.jsonify(newURL)
            except Exception as E:
                print(E)
                return "Error! Unable to add the new URL into the watchlist", 500

    @app.route("/lists/", methods=["PUT"])
    def deleteWatchlist():
        try:
            # use a flag to determine if clearing the whole list
            payload = request.get_json(force=True)
            userID = payload.get("id", None)
            fullDelete = payload.get("clear", "0")

            if fullDelete == "1":
                db.session.query(SearchURL).delete()
                db.session.commit()
            else:
                adToDelete = SearchURL.query.filter_by(id=userID).one()
                db.session.delete(adToDelete)
                db.session.commit()
        except Exception as E:
            db.session.rollback()
            print(E.args)
            return "Error! Rollback!", 500
        return "Succesfully cleared the watchlist"

    @app.route("/listings/", methods=["GET"])
    def getListings():
        listings = Listing.query.all()
        result = listings_schema.dump(listings)
        return jsonify(result)

    @app.route("/listings/<id>", methods=["GET"])
    def getListing(id):
        listing = Listing.query.filter_by(id=id).one()
        result = listing_schema.dump(listing)
        return jsonify(result)

    @app.route("/crawl/", methods=["GET"])
    def webCrawl():

        # for every url - scrape the html and return it to the caller
        # look go .top-feature .regular-ad
        urls = queryAllURLs()
        for watchlistURL in urls:
            # use to save reference to where the ad was obtained
            urlID = watchlistURL.get("id", None)
            url = watchlistURL.get("url", None)

            print("Searching through the url", url)
            try:
                source = requests.get(url).text
                soup = BeautifulSoup(source, "lxml")
                # all regular ads
                print("Searching for regular ads")
                ads = soup.find_all("div", class_="regular-ad")
                print("Searching for premium ads")
                premiumAds = soup.find_all("div", class_="top-feature")
                # all premium ads
                # print(regularAds, premiumAds)
                ads.extend(premiumAds)
                for ad in ads:
                    price = (
                        ad.select("div.price")[0]
                        .get_text("|", strip=True)
                        .replace("\n", "")
                    )
                    print("Obtained price")
                    adLink = "http://kijiji.ca" + ad.attrs["data-vip-url"]
                    # obtain full description
                    # indepthSource = requests.get(adLink).text
                    # indepthSoup = BeautifulSoup(indepthSource, "lxml")

                    # # can be unreliable - will need to refresh on this
                    # # front view will not contain all the description - require going to link
                    # temp = (
                    #     indepthSoup.find(attrs={"itemprop": "description"}).get_text(
                    #         "\n", strip=True
                    #     )
                    #     # .replace("\n", "")
                    # )
                    # description = "Description was incorrect - Please try another crawl"
                    # if temp:
                    #     description = re.sub(" +", " ", temp,)
                    #     print("Obtained description")

                    # obtain partial description
                    temp = ad.find("div", class_="description")
                    description = "Description was incorrect - Please try another crawl"
                    if temp:
                        description = re.sub(
                            " +", " ", temp.get_text("\n", strip=True).replace("\n", "")
                        )
                        print("Obtained description")
                    print(description)
                    adID = ad.attrs["data-listing-id"]
                    print("Obtained link to ad and Kijiji id")
                    title = re.sub(
                        " +",
                        " ",
                        ad.find("a").get_text("|", strip=True).replace("\n", ""),
                    )
                    print("Obtained title")

                    # handle null pictures
                    picture = ad.find("picture")
                    imageURL = None
                    if picture:
                        imageURL = picture.find("img").attrs["data-src"]
                        print("Obtained image URL")
                    else:
                        print("No image found for", adID)

                    # if mileage and transmission ever not found - then do not include
                    # used to filter - only if cars
                    dealerCheck = ad.find("div", class_="dealer-logo")
                    usedCheck = ad.find("span", class_="new-car-badge")
                    print("Obtained checks for dealer and/or used")
                    dealer = True if dealerCheck else False
                    used = False if usedCheck else True

                    locationDatePosted = re.sub(
                        " +",
                        " ",
                        ad.find("div", class_="location")
                        .get_text("|", strip=True)
                        .replace("\n", ""),
                    ).split("|")
                    # print(locationDatePosted)
                    # New Car | Location | TimeofPost
                    # Location | TimeofPost

                    if len(locationDatePosted) == 3:
                        location = locationDatePosted[1]
                        posted = locationDatePosted[2]
                    else:
                        location = locationDatePosted[0]
                        posted = locationDatePosted[1]

                    timePosted = ad.find("span", class_="date-posted").get_text(
                        "|", strip=True
                    )
                    print("Obtained location and time of post")
                    details = (
                        ad.find("div", class_="details")
                        .get_text("|", strip=True)
                        .replace("\n", "")
                        .replace(" ", "")
                    )

                    # populate into the database - detect any changes - or always populate new?
                    # create new instances if the id is not available
                    try:
                        listingExists = db.session.query(
                            exists().where(Listing.id == adID)
                        ).scalar()
                        if listingExists:
                            listing = Listing.query.filter_by(id=adID).one()
                            print("Existing listing available", adID)

                            listing.link = adLink
                            listing.title = title
                            listing.location = location
                            listing.image_url = imageURL
                            listing.posted = timePosted
                            listing.description = description
                            listing.url_id = urlID
                            listing.price = price
                            listing.used = used
                            listing.dealer = dealer
                            listing.details = details

                        # update the listing found - update everything
                        else:
                            print("Creating new listing", adID)
                            newListing = Listing(
                                id=adID,
                                link=adLink,
                                title=title,
                                location=location,
                                image_url=imageURL,
                                posted=timePosted,
                                description=description,
                                price=price,
                                url_id=urlID,
                                used=used,
                                dealer=dealer,
                                details=details,
                            )
                            db.session.add(newListing)

                        # finalize the change
                        db.session.commit()
                    except exc.DBAPIError:
                        print("Error on crawl DBAPI Error")
                    time.sleep(0.5)
                # pull information
            except Exception as E:
                print("Error when obtaining html text from", url)
                print(E)
                return E
            time.sleep(3)

        # query for all the listings for the watchlist urls and return
        listings = Listing.query.all()
        result = listings_schema.dump(listings)
        return jsonify(result)

    return app
