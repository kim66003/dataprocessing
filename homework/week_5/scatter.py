import csv
import json
import pandas as pd

INPUT_FILE = "dailysmokers.csv"
INPUT_FILE2 = "alcoholconsumption.csv"
INPUT_FILE3 = "obesitas.csv"
OUTPUT_FILE = "dailysmokers.json"
OUTPUT_FILE2 = "alcoholconsumption.json"
OUTPUT_FILE3 = "obesitas.json"

# create dataframe
def create_dataframe(filename):
    dataframe = pd.read_csv(filename, usecols=["LOCATION", "INDICATOR", "SUBJECT", "TIME", "Value"])
    return dataframe

countries = ["AUT", "CAN", "CZE", "FIN", "FRA", "GRC", "HUN", "ITA", "KOR", "LUX", "NLD", "POL", "PRT", "SVK", "ESP", "SWE", "TUR", "USA", "EST", "ISR", "SVN", "LVA"]

def preprocess(dataframe):
    dataframe = dataframe.dropna()
    dataframe = dataframe[(dataframe['TIME']==2014)]
    dataframe = dataframe.loc[dataframe['LOCATION'].isin(countries)]
    dataframe = dataframe.reset_index(drop=True)
    return dataframe

def preprocess2(dataframe):
    dataframe = dataframe.dropna()
    dataframe = dataframe[(dataframe['TIME']==2014)]
    dataframe = dataframe.loc[dataframe['LOCATION'].isin(countries)]
    dataframe = dataframe[(dataframe['SUBJECT']=='SELFREPORTED')]
    dataframe = dataframe.reset_index(drop=True)
    return dataframe

# convert dataframe to json file
def convert_json(filename, dataframe):
    outfile = dataframe.to_json(filename, orient='index')

if __name__ == '__main__':
    df = create_dataframe(INPUT_FILE)
    keys = set(df['LOCATION'])
    df = preprocess(df)
    convert_json(OUTPUT_FILE, df)
    df2 = create_dataframe(INPUT_FILE2)
    keys2 = set(df2['LOCATION'])
    df2 = preprocess(df2)
    convert_json(OUTPUT_FILE2, df2)
    df3 = create_dataframe(INPUT_FILE3)
    keys3 = set(df3['LOCATION'])
    df3 = preprocess2(df3)
    convert_json(OUTPUT_FILE3, df3)
