# Name: Max Simons
# ID: 12389285
# Subject: DataProcessing
# Project: Exploratory Data Analysis
# Date: 14/11/2018

import csv
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy import stats
from numpy import percentile
import json

INPUT_FILE = "input.csv"
HEADERS = ['Country', 'Region', 'Pop. Density (per sq. mi.)',
            'Infant mortality (per 1000 births)', 'GDP ($ per capita) dollars']

def parse(input):
    """
    parsing data from a csv file called input.csv. Checking data for missing
    values and/or invalid values. Returning a DataFrame, data dictionary, lists
    with values for making a histogram and a boxplot. Invalid values has removed.
    """
    with open(input) as file:
        input_reader = csv.DictReader(file)

        # make seperate lists for data to put in data dictionary
        countries = []
        regions = []
        population_density = []
        infant_mortality = []
        gdp_dollars = []
        # make list for central tendency and five number summary
        gdp_freq = []
        infant_five = []

        # make dictionary for data storage
        data_dict = {}

        # read in csv file per row
        for row in input_reader:
            # get data from csv file per row
            country = row['Country'].strip()
            region = row['Region'].strip()
            pop_den = row['Pop. Density (per sq. mi.)'].strip().replace(',', '.')
            infant = row['Infant mortality (per 1000 births)'].strip().replace(',', '.')
            gdp = row['GDP ($ per capita) dollars'].strip(' dollars')

            # missing or invalid values
            if pop_den == 'unknown' or pop_den == '':
                pop_den = None
            if infant == 'unknown' or infant == '':
                infant = None
            # gdp of Surinama is invalid
            if gdp == 'unknown' or gdp == '' or gdp == '400000':
                gdp = None

            # make floats
            if gdp != None:
                gdp = int(gdp)
                # make list without None values for histogram
                gdp_freq.append(gdp)
            if infant != None:
                infant = float(infant)
                infant_five.append(infant)
            if pop_den != None:
                pop_den = float(pop_den)

            # add data to all lists
            countries.append(country)
            regions.append(region)
            population_density.append(pop_den)
            infant_mortality.append(infant)
            gdp_dollars.append(gdp)


        # add data to data_dict
        data_dict['Country'] = countries
        data_dict['Region'] = regions
        data_dict['Pop. Density (per sq. mi.)'] = population_density
        data_dict['Infant mortality (per 1000 births)'] = infant_mortality
        data_dict['GDP ($ per capita) dollars'] = gdp_dollars

        # make dataframe with all data
        df = pd.DataFrame(data_dict)
        print(data_dict)

        return df, gdp_freq, infant_five, data_dict

def histogram(gdp_freq):
    """
    Returns a histogram of the frequency of GDP in dollars, using data from
    list. Compute the mean, median, mode and standard deviation.
    """
    # compute the mean, median, mode and standard deviation from GDP data
    mean = round(np.mean(gdp_freq), 2)
    median = int(np.median(gdp_freq))
    mode = int(stats.mode(gdp_freq)[0][0])
    deviation  = round(np.std(gdp_freq), 2)

    # plot GDP data using histogram with the frequency of gdp in dollars
    plt.hist(gdp_freq, bins=30, histtype='bar', rwidth=0.8, color='g')
    plt.xlabel('GDP ($ per capita) dollars')
    plt.ylabel('Frequency')
    plt.title('Frequency of GDP ($ per capita) dollars')
    histogram = plt.show()

    return histogram

def boxplot(infant_five):
    """
    Returns a boxplot using five number summary methode of showing the minimum,
    q1, median, q3, maximum and outliers.
    """
    # calculate quartiles
    quartiles = percentile(infant_five, [25, 50, 75])

    # calculate the five number summary
    min_infant = min(infant_five)
    q1 = quartiles[0]
    median_infant = quartiles[1]
    q3 = quartiles[2]
    max_infant = max(infant_five)
    print(min_infant, q1, median_infant, q3, max_infant)

    # plot boxplot of infant mortality data
    red_diamond = dict(markerfacecolor='r', marker='D')
    plt.boxplot(infant_five, flierprops=red_diamond, patch_artist='b')
    plt.title('Infant mortality (per 1000 births)')
    boxplot = plt.show()

    return boxplot

def save_json(df, data_dict):
    """
    Output a JSON file containing data per country
    """
    # dictionary to wright to json file
    json_dic = {}

    # get an index per country to fill in dictionary
    for countryindex, country in enumerate(data_dict['Country']):
        json_dic[country] = {}
        for key in HEADERS:
            # skip country and start with Region
            if key is not 'Country':
                json_dic[country][key] = data_dict[key][countryindex]

    # write json dictionary to outfile
    with open('countries.json', 'w') as outfile:
            json.dump(json_dic, outfile)

    return True

def main(input):
    """
    Main function to control all other function
    """
    # parse the data from INPUT_FILE
    df, gdp_freq, infant_five, data_dict = parse(input)

    # central tendency
    hist = histogram(gdp_freq)

    # five number summary
    five = boxplot(infant_five)

    # convert to json file
    file = save_json(df, data_dict)

if __name__ == "__main__":
    main(INPUT_FILE)
