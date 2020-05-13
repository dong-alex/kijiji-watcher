from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import expression
from flask_marshmallow import Marshmallow
from datetime import datetime

db = SQLAlchemy()
ma = Marshmallow()

# requires the page number as well - multiple adds
# old ads tend to be a red flag in terms of quality and price
# reduces the load on scrapping the website
class SearchURL(db.Model):
    __tablename__ = "search_urls"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    url = db.Column(db.String(256), unique=True)
    used = db.Column(db.Boolean, server_default=expression.false(), default=False)
    dealer = db.Column(db.Boolean, server_default=expression.true(), default=False)
    active = db.Column(db.Boolean, server_default=expression.true(), default=True)
    date_added = db.Column(db.DateTime, default=datetime.now())
    tag = db.Column(db.String(64), unique=True)

    # associated ads with the url
    ads = db.relationship(
        "Listing", backref="search_urls", cascade="all, delete", lazy=True
    )

    def __init__(self, url, used, dealer, active, dateAdded, tag):
        self.url = url
        self.used = used
        self.dealer = dealer
        self.active = active
        self.tag = tag
        self.dateAdded = dateAdded


class SearchUrlSchema(ma.Schema):
    class Meta:
        fields = ("id", "url", "used", "dealer", "active", "tag", "dateAdded")


url_schema = SearchUrlSchema()
urls_schema = SearchUrlSchema(many=True)


class Listing(db.Model):
    __tablename__ = "listings"
    id = db.Column(db.Integer, primary_key=True)
    link = db.Column(db.String(512), nullable=False)
    title = db.Column(db.String(256))
    active = db.Column(db.Boolean, server_default=expression.true(), default=True)
    location = db.Column(db.String(256))
    posted = db.Column(db.String(64))
    image_url = db.Column(db.String(1024))
    description = db.Column(db.Text)
    price = db.Column(db.String(128))  # can be price but can also be "Please Contact"
    url_id = db.Column(db.Integer, db.ForeignKey("search_urls.id"), nullable=False)

    # specific to cars
    used = db.Column(db.Boolean, server_default=expression.false(), default=False)
    dealer = db.Column(db.Boolean, server_default=expression.false(), default=False)
    details = db.Column(db.String(64))

    def __init__(
        self,
        id,
        link,
        title,
        location,
        image_url,
        posted,
        description,
        price,
        url_id,
        used,
        dealer,
        details,
    ):
        self.id = id
        self.link = link
        self.title = title
        self.active = True
        self.location = location
        self.image_url = image_url
        self.posted = posted
        self.description = description
        self.price = price
        self.url_id = url_id
        self.used = used
        self.dealer = dealer
        self.details = details


class ListingSchema(ma.Schema):
    class Meta:
        fields = (
            "id",
            "link",
            "title",
            "active",
            "location",
            "image_url",
            "posted",
            "description",
            "price",
            "url_id",
            "used",
            "dealer",
            "details",
        )


listing_schema = ListingSchema()
listings_schema = ListingSchema(many=True)
