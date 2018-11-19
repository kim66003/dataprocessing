# Name: Kimberley Boersma
# Student number: 11003464
# Program to convert textfile to jsonfile

import csv
import json

TEXT_FILE = 'KNMI_20170101.txt'
OUTPUT_JSON = 'KNMI_20170101.json'

# read textfile and put relevant lines in list
def read(filename):
    with open(filename) as f:
        reader = csv.reader(f)
        rows = []
        for i in range(14):
            next(f)
        for line in f:
            if not '#' in line:
                line = line.rstrip()
                line = line.replace(' ', '')
                rows.append(line.rstrip())
    return rows

# convert list to dict
def to_dict(list):
    uber_dict = {}
    for element in list:
        x = element.split(",")
        temp_dict = {}
        temp_dict["Etmaalgemiddelde windsnelheid"] = x[2]
        temp_dict["Etmaalgemiddelde temperatuur"] = x[3]
        temp_dict["Zonneschijnduur"] = x[4]
        temp_dict["Duur van de neerslag"] = x[5]
        temp_dict["Etmaalgemiddelde bewolking"] = x[6]
        uber_dict[x[1]] = temp_dict
    return uber_dict

# convert dictionary to jsonfile
def convert2json(dictionary):
    with open(OUTPUT_JSON, 'w') as outfile:
        json.dump(dictionary, outfile)

if __name__ == '__main__':
    # make list of KNMI data
    rows = read(TEXT_FILE)
    # make dictionary of KNMI data
    dict = to_dict(rows)
    # convert dictionary and write to jsonfile
    convert2json(dict)
