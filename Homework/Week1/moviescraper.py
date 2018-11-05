#!/usr/bin/env python
# Name: Max Simons
# Student number: 12389285
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """
    title = []
    rating = []
    year = []
    actors = []
    runtime = []
    # grabs each movie
    movies = dom.findAll("div", {"class":"lister-item-content"})

    movie = movies[0].findAll("p", {"class":""})[1]

    # loop threw all moviess
    for i in range(len(movies)):
        title.append(movies[i].h3.a.string)
        rating.append(movies[i].div.div.strong.string)
        year.append(movies[i].find("span", {"class":"lister-item-year"}).string.strip("I ()"))
        runtime.append(movies[i].find("span", {"class":"runtime"}).string.strip("min "))

        actor_persons = []
        actor_lines = movies[i].findAll("p", {"class":""})[1]
        for actor in actor_lines:
            # get stars from lines
            if "Stars:" in actor:
                while True:
                    actor = actor.next_sibling
                    if actor == None:
                        break
                    actor_persons.append(actor.text)
                    actor = actor.next_sibling

        if actor_persons:
            actors.append(actor_persons)
        else:
            actors.append(str("-"))

    movie_dict = {}
    movie_dict['title'] = title
    movie_dict['rating'] = rating
    movie_dict['year'] = year
    movie_dict['actors'] = actors
    movie_dict['runtime'] = runtime

    return movie_dict


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['sep=,'])
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])
    for line in range(len(movies['title'])-1):
        if ", " in movies['title'][line]:
            movies['title'][line] = "".join(str(x) for x in movies['title'][line])
        actorsstring = ""
        for i in movies['actors'][line]:
            actorsstring += i
            actorsstring += ", "
        actorsstring = actorsstring[:-2]

        writer.writerow([movies['title'][line], movies['rating'][line],
                         movies['year'][line], actorsstring,
                         movies['runtime'][line]])


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
