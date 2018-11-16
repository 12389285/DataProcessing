# Name: Max Simons
# ID: 12389285
# JSON & CSV converter

import csv
import json

# name_file = "races"
# INPUT_FILE = "races.csv"

csvfile = open('races.csv', 'r')
jsonfile = open('file.json', 'w')

fieldnames = ("raceId","year","round","circuitId","name","date","time")
reader = csv.DictReader(csvfile)

for row in reader:
    json.dump(row, jsonfile)
    jsonfile.write('\n')
