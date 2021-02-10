# kpay-price
A small tool that helps you update price in all .po files, show the price or verify if the price is the same in all files

**Alpha version, use it at your own risk! Always do a back-up of your project before using this tool !!!**

# How to use

Download the code, then run *npm install -g* to install it globally

Run the following command in your project root:

**npx kpay-price -p newprice**

**Options:**
* -p newprice - replace the old price with the newprice in all .po files
* -s - show the price from each .po file
* -v - verify if the .po files have the same price
* -d (true/false) - debug mode - default false
