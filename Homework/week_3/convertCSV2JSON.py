# Name: Max Simons
# ID: 12389285
# JSON & CSV converter

import csv
import json
import pandas as pd

# fill in input file name .csv
INPUT_FILE = "2018.csv"

# fill in output file name .json
OUTPUT_FILE = "2018.json"

# fill in the fieldnames
fieldnames = ("GRAND PRIX" , "DATE", "CAR", "RACE POSITION", "PTS")

def convert(INPUT_FILE):

    # read csv file with panda
    df = pd.read_csv(INPUT_FILE)

    # make json file based on records
    df.reset_index().to_json(OUTPUT_FILE, orient='records')


if __name__ == "__main__":
    convert(INPUT_FILE)
