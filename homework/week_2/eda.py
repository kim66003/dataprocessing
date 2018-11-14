import csv
import json
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# create dataframe for all countries
def create_dataframe(filename):
    dataframe = pd.read_csv(filename, usecols=['Country', 'Region', 'Pop. Density (per sq. mi.)', 'Infant mortality (per 1000 births)', 'GDP ($ per capita) dollars'])
    return dataframe

# create variables for long column names
popdens = 'Pop. Density (per sq. mi.)'
infantmort = 'Infant mortality (per 1000 births)'
gdp = 'GDP ($ per capita) dollars'

def preprocess_column(dataframe, column):
    dataframe[column] = dataframe[column].str.replace(',','.')
    dataframe[column] = pd.to_numeric(dataframe[column], downcast='float')

# drop rows with missing variables, preprocess columns
def preprocess(dataframe):
    dataframe = dataframe.dropna()
    for column in dataframe:
        # drop rows with values 'unknown'
        dataframe = dataframe[dataframe[column] != 'unknown']
        # strip values of string 'dollars'
        if dataframe[column].str.contains('dollars').any():
            dataframe[column] = dataframe[column].apply(lambda x: x.strip(' dollars'))
            dataframe[column] = pd.to_numeric(dataframe[column])
    # replace commas with dots
    preprocess_column(dataframe, popdens)
    preprocess_column(dataframe, infantmort)
    # dataframe[popdens] = dataframe[popdens].str.replace(',','.')
    # dataframe[popdens] = pd.to_numeric(dataframe[popdens], downcast='float')
    # dataframe[infantmort] = dataframe[infantmort].str.replace(',','.')
    # dataframe[infantmort] = pd.to_numeric(dataframe[infantmort], downcast='float')
    dataframe['Region'] = dataframe['Region'].apply(lambda x: x.strip(' '))
    return dataframe

# save dataframe to csv outfile
def save_csv(filename, dataframe):
    dataframe.to_csv(filename)

# calculate central tendency for column
def calc_central_tend(dataframe, column):
    ct_list = []
    ct_list.append(column)
    ct_list.append(dataframe[column].mean())
    ct_list.append(dataframe[column].median())
    column_mode = dataframe[column].mode()
    ct_list.append(column_mode[0])
    ct_list.append(dataframe[column].std())
    return ct_list

# format floats to 2 decimals
def format_float(float):
    return "{:.2f}".format(float)

# print central tendency
def central_tendency(list):
    print(f"Central tendency of {list[0]}:\nMean:", format_float(list[1]))
    print("Median:", format_float(list[2]), "\nMode:", format_float(list[3]))
    print("Standard deviation:", format_float(list[4]))

# get rid of outliers for column
def outliers(dataframe, column):
    dataframe = dataframe[np.abs(dataframe[column]-dataframe[column].mean()) <= (3*dataframe[column].std())]
    return dataframe

# plot histogram
def hist_plot(dataframe, column, rows):
    hist_column = df.hist(column, bins=(rows//4), grid=False, rwidth=0.9, color='purple')
    plt.title(f'Distribution of {column} of {rows} countries')
    plt.xlabel(f'{column}')
    plt.ylabel('Frequency')
    plt.show()

# calculate five number summary
def calc_five_num(dataframe, column):
    fn_list = []
    fn_list.append(column)
    minimum = dataframe[column].min()
    fn_list.append(minimum)
    quantiles = dataframe[column].quantile([0.25,0.5,0.75])
    fn_list.append(quantiles[0.25])
    fn_list.append(quantiles[0.50])
    fn_list.append(quantiles[0.75])
    maximum = dataframe[column].max()
    fn_list.append(maximum)
    return fn_list

# print five number summary
def five_number(list):
    print(f"Five Number Summary of {list[0]}:\nMin:", format_float(list[1]))
    print("Q1:", format_float(list[2]),"\nMedian:", format_float(list[3]))
    print("Q3:", format_float(list[4]),"\nMax:", format_float(list[5]))

# boxplot column of dataframe
def boxplot(dataframe, column, rows):
    dataframe.boxplot(column=[column], return_type='axes', positions=[1], notch=True, patch_artist=True, grid=False)
    plt.title(f'{column} of {rows} countries')
    plt.ylabel('Number of individuals')
    plt.show()

# convert dataframe to json file
def convert_json(dataframe):
    outfile = dataframe.set_index('Country').to_json('outfile.json', orient='index')

if __name__ == '__main__':
    # create and preprocess dataframe
    df = create_dataframe("input.csv")
    df = preprocess(df)
    df = outliers(df, gdp)
    # save df in csv
    save_csv("outfile.csv", df)
    # five number summary of gdp
    fivenum = calc_five_num(df, gdp)
    five_number(fivenum)
    # central tendency of infant mortality
    ct = calc_central_tend(df, infantmort)
    central_tendency(ct)
    # plot histogram gdp
    rows = (len(df['Country']))
    hist_plot(df, gdp, rows)
    # plot boxplot infant mortality
    boxplot(df, infantmort, rows)
    convert_json(df)
