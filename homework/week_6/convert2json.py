import csv
import json
import numpy as np
import pandas as pd

INPUT_FILE = ["data/heroin_retailprices_europe.csv", "data/cocaine_retailprices_europe.csv",
"data/heroin_retailprices_us.csv", "data/cocaine_retailprices_us.csv", "data/heroin_wholesaleprices_europe.csv",
"data/cocaine_wholesaleprices_europe.csv", "data/cocaine_wholesaleprices_us.csv", "data/heroin_wholesaleprices_us.csv"]

OUTPUT_FILE = ["data/heroin_retail_europe.json", "data/cocaine_retail_europe.json", "data/heroin_retail_us.json",
"data/cocaine_retail_us.json", "data/heroin_wholesale_europe.json", "data/cocaine_wholesale_europe.json",
"data/cocaine_wholesale_us.json", "data/heroin_wholesale_us.json"]

def create_dataframe(filename):
    dataframe = pd.read_csv(filename)
    return dataframe

def preprocess(dataframe):
    dataframe = dataframe.apply(lambda x: x.str.replace(',','') if type(x) is str else x)
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
