#!/usr/bin/env python
# Name: Max Simons
# Student number: 12398285
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}
year_count = {str(key): 0 for key in range(START_YEAR, END_YEAR)}

def visualize(file):

    with open (file) as movies:
        # make header because of use sep=, in moviescraper.py
        movie_reader = csv.DictReader(movies, fieldnames = ['Title', 'Rating',
                                                    'Year', 'Actors', 'Runtime'])
        # start counting in row 2
        for i in range(2):
            next(movie_reader)

        # total of years and rating
        for row in movie_reader:
            year = row['Year']
            if not data_dict[year]:
                data_dict[year] = float(row['Rating'])
                year_count[year] += 1
            else:
                data_dict[year] += float(row['Rating'])
                year_count[year] += 1

        av_rating = []
        year_movie = []
        # add average per year to data dictionary
        for year in range(START_YEAR, END_YEAR):
            # make string from integer
            year = str(year)
            # calculate average rating
            data_dict[year] = data_dict[year] / year_count[year]
            data_dict[year] = round(data_dict[year], 1)
            av_rating.append(data_dict[year])
            year_movie.append(int(year))

        # plot figure
        ymin = min(av_rating) - 0.1
        ymax = max(av_rating) + 0.1
        plt.plot(year_movie, av_rating)
        plt.axis([START_YEAR, END_YEAR -1, ymin, ymax])
        plt.title('Average IMDB top 50 movies rating in 10 years')
        plt.xlabel('Years')
        plt.ylabel('Average rating')

    return plt.show()

if __name__ == "__main__":
    visualize(INPUT_CSV)
