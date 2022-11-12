import csv

x = open("sample.txt","w")

with open('koordinat_surabaya_semicolon.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=';')
    for row in csv_reader:
        latlong = row[4].strip()
        print("hey",latlong)
        latlong = latlong.split(",")
        lat = latlong[0]
        long = latlong[1]

        string = f"lat:{lat}, lng:{long}, address:\"{row[3]}\", kec_desa:\"{row[2]}\""
        x.write(string)
        x.write("\n")

x.close()