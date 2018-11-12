import csv
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

def create_dataframe(filename):
    dataframe = pd.read_csv(filename, usecols=['Country', 'Region', 'Pop. Density (per sq. mi.)', 'Infant mortality (per 1000 births)', 'GDP ($ per capita) dollars'])
    return dataframe

popdens = 'Pop. Density (per sq. mi.)'
infantmort = 'Infant mortality (per 1000 births)'
gdp = 'GDP ($ per capita) dollars'

def preprocess(dataframe):
    dataframe = dataframe.dropna()
    for column in dataframe:
        dataframe = dataframe[dataframe[column] != 'unknown']
        if dataframe[column].str.contains('dollars').any():
            dataframe[column] = dataframe[column].apply(lambda x: x.strip(' dollars'))
            dataframe[column] = pd.to_numeric(dataframe[column])
    dataframe[popdens] = dataframe[popdens].str.replace(',','.')
    dataframe[popdens] = pd.to_numeric(dataframe[popdens], downcast='float')
    dataframe[infantmort] = dataframe[infantmort].str.replace(',','.')
    dataframe[infantmort] = pd.to_numeric(dataframe[infantmort], downcast='float')
    return dataframe

def save_csv(filename, dataframe):
    dataframe.to_csv(filename)

def calc_central_tend(dataframe, column):
    ct_list = []
    ct_list.append(column)
    ct_list.append(dataframe[column].mean())
    ct_list.append(dataframe[column].median())
    column_mode = dataframe[column].mode()
    ct_list.append(column_mode[0])
    ct_list.append(dataframe[column].std())
    return ct_list

def format_float(float):
    return "{:.2f}".format(float)

def central_tendency(list):
    print(f"Central tendency of {list[0]}:\nMean:", format_float(list[1]))
    print("Median:", format_float(list[2]), "\nMode:", format_float(list[3]))
    print("Standard deviation:", format_float(list[4]))

def outliers(dataframe, column):
    dataframe = dataframe[np.abs(dataframe[column]-dataframe[column].mean()) <= (3*dataframe[column].std())]
    return dataframe

def hist_plot(dataframe, column, rows):
    hist_column = df.hist(column, bins=rows)
    plt.show()

def five_number(dataframe, column):
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

def print_five_num(list):
    print(f"Five Number Summary of {list[0]}:\nMin:", format_float(list[1]))
    print("Q1:", format_float(list[2]),"\nMedian:", format_float(list[3]))
    print("Q3:", format_float(list[4]),"\nMax:", format_float(list[5]))

if __name__ == '__main__':
    #create and preprocess dataframe
    df = create_dataframe("input.csv")
    df = preprocess(df)
    df = outliers(df, gdp)
    #save df in csv
    save_csv("outfile.csv", df)
    #five number summary
    fivenum = five_number(df, infantmort)
    print_five_num(fivenum)
    #central tendency
    ct = calc_central_tend(df, popdens)
    central_tendency(ct)
    #plot histogram
    rows = len(df['Country'])
    # hist_plot(df, gdp, rows)
    df.boxplot(column=[infantmort], return_type='axes')
    plt.show()
