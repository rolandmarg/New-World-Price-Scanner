while looking at trade post in game, press CTRL+F to capture sell/buy prices and send to excel sheet as [time, item, sellPrice, buyPrice] values

this project was built for personal use and I've not invested enough time to produce enough quality for project to be publicly available

i.e. right now it fits my screen exactly(to OCR item name and prices I have to specify exact position coordinates)

app takes screenshot + crops parts of image to get smaller images for item and sell & buy prices, OCRs it(u gotta have tesseract installed locally) and uploads it to google spreadsheets

p.s. sometimes it can't detect dot(instead of 1.11, uploads 111), maybe I should train tesseract with correct input? or look into how to improve


Long term goal for this project is to accumulate enough prices for items I'm interested in and build charts & visuals to see data patterns
