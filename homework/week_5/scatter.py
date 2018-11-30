import csv
import json
import pandas as pd

INPUT_FILE = "dailysmokers.csv"
INPUT_FILE2 = "alcoholconsumption.csv"
INPUT_FILE3 = "obesitas.csv"
OUTPUT_FILE = "dailysmokers2.json"
OUTPUT_FILE2 = "alcoholconsumption2.json"
OUTPUT_FILE3 = "obesitas2.json"

# create dataframe
def create_dataframe(filename):
    dataframe = pd.read_csv(filename, usecols=["LOCATION", "INDICATOR", "SUBJECT", "TIME", "Value"])
    return dataframe

def preprocess(dataframe):
    dataframe = dataframe.dropna()
    dataframe = dataframe[(dataframe['TIME']==2014)]
    print(list(dataframe['LOCATION']))
    dataframe = dataframe.set_index('LOCATION')
    return dataframe

def preprocess2(dataframe):
    dataframe = dataframe.dropna()
    dataframe = dataframe[(dataframe['TIME']==2014)]
    dataframe = dataframe[(dataframe['SUBJECT']=='SELFREPORTED')]
    print(list(dataframe['LOCATION']))
    dataframe = dataframe.set_index('LOCATION')
    return dataframe

# convert dataframe to json file
def convert_json(filename, dataframe):
    outfile = dataframe.to_json(filename, orient='index')

if __name__ == '__main__':
    df = create_dataframe(INPUT_FILE)
    df = preprocess(df)
    convert_json(OUTPUT_FILE, df)
    df2 = create_dataframe(INPUT_FILE2)
    df2 = preprocess(df2)
    convert_json(OUTPUT_FILE2, df2)
    df3 = create_dataframe(INPUT_FILE3)
    df3 = preprocess2(df3)
    convert_json(OUTPUT_FILE3, df3)
