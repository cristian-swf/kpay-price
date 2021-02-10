#!/usr/bin/env node

const yargs = require("yargs");
const fs 	= require("fs");
const path 	= require("path");
const { execSync } = require("child_process");

console.log('kpay-price - Welcome!');

const options = yargs
 .usage("Usage: -p <newprice>")
 .option("p", { alias: "newprice", 	default: "", describe: "New price", type: "string", demandOption: false })
 .option("d", { alias: "debug", 	default: false, describe: "Debug mode", type: "boolean", demandOption: false })
 .option("s", { alias: "show", 		default: false, describe: "Only display prices in the files, dont update price", type: "boolean", demandOption: false })
 .option("v", { alias: "verify", 	default: false, describe: "Verify prices in the files, make sure their the same", type: "boolean", demandOption: false })
 .argv;
 
var i18nDir = "app/i18n/";

options.p = options.p.replace("$", "");

if(!options.s && !options.v && options.p.length==0)
{
	console.log("Error: please choose an option! -p newprice to update price or -s to display price form all files!");
}

if(options.d)
{
	console.log("Debug mode is ON!");
}

var priceToVerify = "na";
var allPricesVerifiedOK = true;
	
if(fs.existsSync(i18nDir))
{
	var files = fs.readdirSync(i18nDir);
	
    files.forEach(file => 
	{
        if( file.toLowerCase().endsWith(".po") ) 
		{
			var fileContent = fs.readFileSync(i18nDir + file, 'utf8');
	
			var dollarpos 	 = fileContent.indexOf("$");
			var nextspacepos = fileContent.indexOf(" ", dollarpos);
			var currentprice = fileContent.substr(dollarpos, nextspacepos-dollarpos);
			
			if(options.d)
			{
				console.log("Reading file " + i18nDir + file);
				console.log("Current price: " + currentprice);
			}
			
			if(options.s)
			{
				console.log(i18nDir + file + " - " + currentprice);
			}
			
			if(options.v)
			{
				if(priceToVerify=="na")
					priceToVerify = currentprice;
				else
				if(currentprice!=priceToVerify)
				{
					allPricesVerifiedOK = false;
					console.log(file + " - price " + currentprice + " doesnt match previous price of " + priceToVerify + "!");
				}
			}
			
			if(options.p.length>=1)
			{
				fileContent = fileContent.replace(currentprice, "$"+options.p);
	
				fs.writeFileSync(i18nDir + file, fileContent, function writeFile(err) 
				{
				  if (err) 
					  return console.log(err);
				});
			}
        }
    });
	
	if(options.v)
	{	
		if(!allPricesVerifiedOK)
			console.log("Prices are NOT the same in all .po files! Check the lines above and fix the required files!");
		else 
			console.log("All prices are the same in all .po files!");
	}
	
	if(options.p.length>0)
	{
		console.log("Job done. Price updated.");
	}
}
else
{
	console.log("Error: i18n folder cannot be found!");
}