import csv
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

def create_dataframe(filename):
    dataframe = pd.read_csv(filename, usecols=['Country', 'Region', 'Pop. Density (per sq. mi.)', 'Infant mortality (per 1000 births)', 'GDP ($ per capita) dollars'])
    dataframe.columns = ['Country', 'Region', 'Pop. Density', 'Infant mortality', 'GDP']
    return dataframe

def preprocess(dataframe):
    dataframe = dataframe.dropna()
    for column in dataframe:
        dataframe = dataframe[dataframe[column] != 'unknown']
        if dataframe[column].str.contains('dollars').any():
            dataframe[column] = dataframe[column].apply(lambda x: x.strip(' dollars'))
            dataframe[column] = pd.to_numeric(dataframe[column])
    dataframe['Pop. Density'] = dataframe['Pop. Density'].str.replace(',','.')
    dataframe['Pop. Density'] = pd.to_numeric(dataframe['Pop. Density'], downcast='float')
    dataframe['Infant mortality'] = dataframe['Infant mortality'].str.replace(',','.')
    dataframe['Infant mortality'] = pd.to_numeric(dataframe['Infant mortality'], downcast='float')
    return dataframe

def save_csv(filename, dataframe):
    dataframe.to_csv(filename)

def calc_mean(dataframe, column):
    return dataframe[column].mean()

def calc_median(dataframe, column):
    return dataframe[column].median()

def calc_mode(dataframe, column):
    column_mode = dataframe[column].mode()
    return column_mode[0]

def calc_std(dataframe, column):
    return dataframe[column].std()

def format_float(float):
    return "{:.2f}".format(float)

def central_tendency(dataframe, column):
    print(f"Mean of {column}: ", format_float((calc_mean(dataframe, column))))
    print(f"Median of {column}: ", format_float((calc_median(dataframe, column))))
    print(f"Mode of {column}: ", format_float((calc_mode(dataframe, column))))
    print(f"Standard deviation of {column}: ", format_float((calc_std(dataframe, column))))

def outliers(dataframe, column):
    dataframe = dataframe[np.abs(dataframe[column]-calc_mean(dataframe, column)) <= (3*calc_std(dataframe, column))]
    return dataframe

def hist_plot(dataframe, column, rows):
    hist_column = df.hist(column, bins=rows)
    plt.show()

def five_number(dataframe, column):
    five_num_list = []
    five_num_list.append(column)
    minimum = dataframe[column].min()
    five_num_list.append(minimum)
    quantiles = dataframe[column].quantile([0.25,0.5,0.75])
    five_num_list.append(quantiles[0.25])
    five_num_list.append(quantiles[0.50])
    five_num_list.append(quantiles[0.75])
    maximum = dataframe[column].max()
    five_num_list.append(maximum)
    return five_num_list

def print_five_num(list):
    print(f"Five Number Summary of {list[0]}:\nMin:", format_float(list[1]))
    print("Q1:", format_float(list[2]),"\nMedian:", format_float(list[3]))
    print("Q3:", format_float(list[4]),"\nMax:", format_float(list[5]))

if __name__ == '__main__':
    df = create_dataframe("input.csv")
    df = preprocess(df)
    save_csv("outfile.csv", df)
    central_tendency(df, "Infant mortality")
    rows = len(df["Country"])
    df = outliers(df, "GDP")
    fivenum = five_number(df, "Infant mortality")
    print_five_num(fivenum)
    # hist_plot(df, "GDP", rows)
