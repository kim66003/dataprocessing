import csv
import json
import pandas as pd

INPUT_FILE = "childvaccination.csv"
OUTPUT_DF = "dataframe.csv"
OUTPUT_FILE = "childvaccination.json"

# create dataframe
def create_dataframe(filename):
    dataframe = pd.read_csv(filename, usecols=["LOCATION","SUBJECT","TIME", "Value"])
    return dataframe

def preprocess(dataframe):
    dataframe = dataframe.dropna()
    dataframe = dataframe[(dataframe['TIME']==2016)]
    dataframe = dataframe.groupby('LOCATION').mean().reset_index()
    dataframe[('TIME')] = dataframe[('TIME')].astype(int)
    dataframe[('Value')] = dataframe[('Value')].astype(int)
    return dataframe

# save dataframe to csv outfile
def save_csv(filename, dataframe):
    dataframe.to_csv(filename)

# convert dataframe to json file
def convert_json(filename, dataframe):
    outfile = dataframe.to_json(filename, orient='index')

if __name__ == '__main__':
    df = create_dataframe(INPUT_FILE)
    df = preprocess(df)
    save_csv(OUTPUT_DF, df)
    convert_json(OUTPUT_FILE, df)
