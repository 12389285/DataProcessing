# Name: Max Simons
# ID: 12389285
# JSON & CSV converter

import csv
import json
import pandas as pd

# fill in input file name .csv
INPUT_FILE = "world_co2_emissions.csv"

# fill in output file name .json
OUTPUT_FILE = "world_co2_emissions.json"

def convert(INPUT_FILE):

    # read csv file with panda
    df = pd.read_csv(INPUT_FILE)
    # make json file based on records
    df.reset_index().to_json(OUTPUT_FILE, orient='records')


if __name__ == "__main__":
    convert(INPUT_FILE)
