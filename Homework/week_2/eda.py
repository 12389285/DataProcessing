

import csv
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

INPUT_FILE = "input.csv"

def main(INPUT_FILE):
    with open(INPUT_FILE) as file:
        input_reader = csv.DictReader(file)

        # make seperate lists for data
        countries = []
        regions = []
        population_density = []
        infant_mortality = []
        gdp_dollars = []
        gdp_freq = []

        # make dictionary for data storage
        data_dict = {str(key): [] for key in range(len(countries))}

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
            if gdp == 'unknown' or gdp == '' or gdp == '400000':
                gdp = None

            # make floats
            if gdp != None:
                gdp = float(gdp)
                # make list without None values for histogram
                gdp_freq.append(int(gdp))
            if infant != None:
                infant = float(infant)
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
        data_dict['Pop_Density'] = population_density
        data_dict['Infant_mortality'] = infant_mortality
        data_dict['GDP_dollars'] = gdp_dollars

        # make dataframe with all data
        df = pd.DataFrame(data_dict)

        # get the mean, median, mode and standard deviation from GDP data
        mean = round(df.GDP_dollars.mean(), 2)
        median = int(df.GDP_dollars.median())
        mode = int(df.GDP_dollars.mode())
        deviation  = round(df.GDP_dollars.std(), 2)

        # plot GDP data using histogram with the frequency of GDP_dollars
        # see analyze.txt for explanation
        plt.hist(gdp_freq, bins=25, histtype='bar', rwidth=0.8, color='g')
        plt.xlabel('GDP in dollars')
        plt.ylabel('Frequency')
        plt.title('Frequency of GDP')

        plt.show()
        # print(df)


if __name__ == "__main__":
    main(INPUT_FILE)
