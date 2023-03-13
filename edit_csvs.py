import pandas as pd

def download_csvs():
    """
    Downloads the csv for weather data for a specific city. returns as df
    """
    city = pd.read_csv('Weather Data\PHL.csv')
    return city

def edit_df(city):
    """
    edits df with groupby function to reveal what the average percipitation for every month looks like,
    using the historical average for each day.
    """
    # date,actual_mean_temp,actual_min_temp,actual_max_temp,average_min_temp,average_max_temp,record_min_temp,record_max_temp,record_min_temp_year,record_max_temp_year,actual_precipitation,average_precipitation,record_precipitation
    num_month = []
    for i in range(len(city)):
        num_month.append(city['date'][i].split('-')[1])

    city['num_month'] = num_month
    return city


city = download_csvs()
city = edit_df(city)


mergedCity = pd.merge(city, city.groupby('num_month')['average_precipitation'].mean(), on ='num_month', how ="inner")



print(mergedCity)

mergedCity.to_csv('new_PHL.csv')