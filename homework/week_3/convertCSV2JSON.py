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
        raw_data = []
        for i in range(14):
            next(f)
        for line in f:
            line = line.rstrip()
            line = line.replace(' ', '')
            raw_data.append(line)
    return raw_data

# list without '#' in lines
def process_raw(list):
    rows = []
    for line in list:
        if not '#' in line:
            rows.append(line)
    return rows

# list of column names
def column_names(list):
    names = []
    for line in list:
        if '#' in line:
            line = line.split(',')
            names.append(line)
    return names

# convert list to dict
def to_dict(list, column):
    uber_dict = {}
    for element in list:
        x = element.split(',')
        temp_dict = {}
        temp_dict[column[0][2]] = x[2]
        temp_dict[column[0][3]] = x[3]
        temp_dict[column[0][4]] = x[4]
        temp_dict[column[0][5]] = x[5]
        temp_dict[column[0][6]] = x[6]
        uber_dict[x[1]] = temp_dict
    return uber_dict

# convert dictionary to jsonfile
def convert2json(dictionary):
    with open(OUTPUT_JSON, 'w') as outfile:
        json.dump(dictionary, outfile)

if __name__ == '__main__':
    # make (raw) list of KNMI data
    raw = read(TEXT_FILE)
    # process list
    rows = process_raw(raw)
    # create list of column names
    names = column_names(raw)
    # make dictionary of KNMI data
    dict = to_dict(rows, names)
    # convert dictionary and write to jsonfile
    convert2json(dict)
