import csv
import json
import numpy as np
import pandas as pd

INPUT_FILE = ["heroin_retailprices_europe.csv", "cocaine_retailprices_europe.csv",
"heroin_retailprices_us.csv", "cocaine_retailprices_us.csv", "heroin_wholesaleprices_europe.csv",
"cocaine_wholesaleprices_europe.csv", "cocaine_wholesaleprices_us.csv", "heroin_wholesaleprices_us.csv"]

OUTPUT_FILE = ["heroin_retail_europe.json", "cocaine_retail_europe.json", "heroin_retail_us.json",
"cocaine_retail_us.json", "heroin_wholesale_europe.json", "cocaine_wholesale_europe.json",
"cocaine_wholesale_us.json", "heroin_wholesale_us.json"]

def create_dataframe(filename):
    dataframe = pd.read_csv(filename)
    return dataframe

def preprocess(dataframe):
    for i, key in enumerate(dataframe):
        try:
            dataframe[key] = dataframe[key].str.replace(',','')
            dataframe[key] = dataframe[key].astype(int)
        except:
            pass

    return dataframe

if __name__ == '__main__':
    for input, output in zip(INPUT_FILE, OUTPUT_FILE):
        dataframe = create_dataframe(input)
        dataframe = preprocess(dataframe)
        dataframe.set_index('Country').to_json(output, orient='index')
