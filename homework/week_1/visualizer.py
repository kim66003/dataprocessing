#!/usr/bin/env python
# Name:
# Student number:
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt
from collections import defaultdict
import numpy as np


# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {key: [] for key in range(START_YEAR, END_YEAR)}
with open('movies.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        year = int(row['Year'])
        if data_dict.get(year) != None:
            rating = float(row['Rating'])
            data_dict[year].append(rating)
        else:
            pass

def average_rating(dictionary):
    average_dict = {}
    for key in sorted(dictionary):
        average = sum(dictionary[key]) / len(dictionary[key])
        average = round(average, 2)
        average_dict[key] = average
    return average_dict

def keys_list(dictionary):
    keys = []
    for key in dictionary:
        keys.append(key)
    return keys

def plot_average(dictionary, list):
    plt.style.use('dark_background')
    lines = plt.plot(*zip(*sorted(dictionary.items())))
    plt.setp(lines, color='#8211BC', linewidth=2.0, marker='*', mec='#A1F10A', mfc='#A1F10A', markersize=10)
    plt.xlabel('Years')
    plt.ylabel('Ratings')
    plt.xticks(range(list[0], (list[-1] + 1)))
    plt.show()

if __name__ == "__main__":
    average_dict = average_rating(data_dict)
    keys = keys_list(average_dict)
    plot_average(average_dict, keys)
