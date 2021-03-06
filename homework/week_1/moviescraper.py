#!/usr/bin/env python
# Name: Kimberley Boersma
# Student number: 11003464
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

def find_div(html_dom):
    movie_div = html_dom.find_all('div', class_ = 'lister-item-content')
    return movie_div

def find_title(movie):
    title = movie.h3.a.text
    return title

def find_rating(movie):
    rating = float(movie.strong.text)
    return rating

def find_year(movie):
    year = movie.h3.find('span', class_ = 'lister-item-year text-muted unbold')
    year = year.text.strip('()')
    if not year.isdigit():
        year = year.split('(')
        year = int(year[1])
    return year

def find_actors(movie):
    actors = movie.select('a[href*="adv_li_st_"]')
    actors_movie = []
    for actor in actors:
        actors_movie.append(actor.text)
        actors = (', '.join(actors_movie))
    return actors

def find_runtime(movie):
    runtime = movie.find('span', class_ = 'runtime')
    runtime = runtime.text.strip(' min')
    return runtime

def append_movie(title, rating, year, actors, runtime):
    movie_list = []
    movie_list.append(title)
    movie_list.append(rating)
    movie_list.append(year)
    movie_list.append(actors)
    movie_list.append(runtime)
    return movie_list

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

    movie_csv = []
    for movie in find_div(dom):
        title = find_title(movie)
        rating = find_rating(movie)
        year = find_year(movie)
        actors = find_actors(movie)
        runtime = find_runtime(movie)
        movie_list = append_movie(title, rating, year, actors, runtime)
        movie_csv.append(movie_list)
    return movie_csv   # REPLACE THIS LINE AS WELL IF APPROPRIsATE

def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])
    for movie in movies:
        writer.writerow(movie)

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE MOVIES TO DISK

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
