

import csv
import numpy as np
import pandas as pd

INPUT_FILE = "input.csv"

def file(INPUT_FILE):
    #
    with open(INPUT_FILE) as file:
        input_reader = csv.DictReader(file)

        # make seperate lists for data
        countries = []
        regions = []
        population_density = []
        infant_mortality = []
        gdp_dollars = []

        # make dictionary for data storage
        data_dict = {str(key): [] for key in range(len(countries))}

        for row in input_reader:
            # get data from csv file per row
            country = row['Country'].strip()
            region = row['Region'].strip()
            pop_den = row['Pop. Density (per sq. mi.)']
            infant = row['Infant mortality (per 1000 births)']
            gdp = row['GDP ($ per capita) dollars'].strip(' dollars')
            if infant == '':
                infant = 'unknown'
            if gdp == '' or 'unknown':
                gdp = 0

            gdp = float(gdp)

            # add data to all lists
            countries.append(country)
            regions.append(region)
            population_density.append(pop_den)
            infant_mortality.append(infant)
            gdp_dollars.append(gdp)

        df = pd.DataFrame(data_dict)
        print(df.mean(gdp_dollars))


        # add data to data_dict
        data_dict['Country'] = countries
        data_dict['Region'] = regions
        data_dict['Pop. Density'] = population_density
        data_dict['Infant mortality'] = infant_mortality
        data_dict['GDP (dollars)'] = gdp_dollars

        # print(pd.DataFrame(data_dict))
        # print(gdp_dollars)


if __name__ == "__main__":
    file(INPUT_FILE)
