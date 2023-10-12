

/* **************************************************************************************************************************************
#  * app.js                                                                                                                             *
#  **************************************************************************************************************************************
#  *                                                                                                                                    *
#  * @License Starts                                                                                                                    *
#  *                                                                                                                                    *
#  * Copyright © 2023. MongoExpUser.  All Rights Reserved.                                                                              *
#  *                                                                                                                                    *
#  * License: MIT - https://github.com/MongoExpUser/Synthetic-Drilling-Data-App-for-Sqlite-ML/blob/main/LICENSE                         *
#  *                                                                                                                                    *
#  * @License Ends                                                                                                                      *
#  **************************************************************************************************************************************
# *                                                                                                                                     *
# *  Project:  Sythentic Drilling Data Applicatiosn for Sqlite-ML                                                                       *
# *                                                                                                                                     *
# *  1) This module is used for generating synthetic drilling  data that can be used for testing machine learning models.               *
# *                                                                                                                                     *  
# *  2)  Run the application as: sudo node --inspect --trace-warnings --watch app.js                                                    *
# *                                                                                                                                     *                                                                                                                     
# **************************************************************************************************************************************/




class DrillingApp
{
    async separator()
    {
        console.log("......................................");
    }

    async prettyPrint(value)
    {
        const util = require('node:util');
        console.log(util.inspect(value, { showHidden: false, colors: true, depth: Infinity }));
    }

    async unixUtcToISOStringUtc(unixTime)
    {
        return new Date(unixTime * 1000); //toISOString()
    }

    async getRandomValueFromList(randomList)
    {
        const randomNumber = Math.floor(Math.random() * randomList.length);
        const randomValue = randomList[randomNumber];
        return randomValue;
    }

    async initData()
    {
        return  {
           rop_fph : 35.01,
           rpm_rpm : 65.02, 
           spp_psi : 235.03,
           dwob_lb : 20000.4,
           swob_lb : 10000.5,
           tqr_lbft : 800.1, 
           bha_type : ['slick', 'packed', 'pendulum', 'fulcrum'],
           mud_weight_sg : 1.08, 
           mud_plastic_visc_cp : 18.01, 
           mud_yield_point_lb_per_100ft_sq : 16.1,
           mud_flow_rate_gpm : 98.14,
           tvd_ft : 8000, 
           md_ft : 12000, 
           inc_deg : 67.2, 
           azim_deg : 110.5, 
           dogleg_deg_per_100ft : 1.1, 
           caliper_hole_size_inches : 6.5,
           gr_api : 20, 
           deep_resistivity_ohm_m : 303.3,  
           dtemp_c : 26,
           shock_g : 102.86, 
           boolean : [0, 1]
       }
    }

    async boundValues()
    {
        const dapp = new DrillingApp();

        const boundOne = await dapp.getRandomValueFromList([3.01, 3.05, 5.02 ]);
        const boundTwo = await dapp.getRandomValueFromList([10.08, 10.07, 8.08 ]);
        const boundThree = await dapp.getRandomValueFromList([0.01, 0.02, 0.03 ]);
        const boundFour = await dapp.getRandomValueFromList([3, 2, 1]);
        const boundFive = await dapp.getRandomValueFromList([0.1, 0.21, 1.11]);
        const boundSix = await dapp.getRandomValueFromList([0.010, 0.0065, 0.0205]);

        return { 
            boundOne: boundOne, 
            boundTwo: boundTwo, 
            boundThree: boundThree,
            boundFour: boundFour, 
            boundFive: boundFive,
            boundSix: boundSix
        };
    }

    async valueBetween(min, max) 
    {  
        return (Math.random() * (max - min + 1) + min)
    }

    async createTable(createDataObject, dataObjectName, db)
    {
        if(createDataObject === true)
        {
            if(dataObjectName)
            {
                db.run(
                    `CREATE TABLE IF NOT EXISTS ${dataObjectName} (
                        -- time (utc) - 1 column
                        time_utc TEXT, 
                        -- drill string data from regular drilling operation (drill string-related) - 7 columns
                        rop_fph FLOAT, 
                        rpm_rpm FLOAT, 
                        spp_psi FLOATi, 
                        dwob_lb FLOAT, 
                        swob_lb FLOAT,
                        tqr_lbft FLOAT, 
                        bha_type TEXT, 
                        -- mud data from regular drilling operation (mud-related)
                        mud_weight_sg FLOAT, 
                        mud_plastic_visc_cp FLOAT, 
                        mud_yield_point_lb_per_100ft_sq FLOAT,
                        mud_flow_rate_gpm FLOAT, 
                        -- mwd/lwd data (measured or calculated) from downhole MWD/LWD tool measurements - 9 columns
                        tvd_ft FLOAT, 
                        md_ft FLOAT, 
                        inc_deg FLOAT, 
                        azim_deg FLOAT, 
                        dogleg_deg_per_100ft FLOAT, 
                        caliper_hole_size_inches FLOAT,
                        gr_api FLOAT,
                        deep_resistivity_ohm_m FLOAT,
                        dtemp_c FLOAT,
                        -- event data from MWD/LWD tool measurements and other sources - 4 columns
                        shock_g FLOAT, 
                        is_vibration INTEGER DEFAULT 0,
                        is_kick INTEGER DEFAULT 0,
                        is_stuckpipe INTEGER DEFAULT 0,
                        -- constraints
                        PRIMARY KEY (time_utc),
                        CHECK(0 >= gr_api <= 150), 
                        CHECK(0 >= deep_resistivity_ohm_m<= 2000),
                        CHECK(is_vibration IN (0,1)), 
                        CHECK(is_kick IN (0,1)),
                        CHECK(is_stuckpipe IN (0,1))
                        -- total columns (1 + 7 + 4 + 9 + 4 = 25)
                    );`
                );
                db.run(`PRAGMA JOURNAL_MODE=WAL;`);
                db.run(`PRAGMA OPTIMIZE;`);
            }
        }
    }

    async getDrillingData(dataLength, initial, precision) 
    {
        const dapp =  new DrillingApp();
        const { faker } = require("@faker-js/faker");
        let assembleData = [];

        for(let index = 0; index < dataLength; index++)
        {
            let data = [];
            const date = new Date(); 
            date.setSeconds(date.getSeconds() + index); 
            const boundValues = await dapp.boundValues();
            let boundOne = boundValues.boundOne;
            let boundTwo =  boundValues.boundTwo;
            let boundThree =  boundValues.boundThree;
            let boundFour =  boundValues.boundFour;
            let boundFive =  boundValues.boundFive;
            let boundSix =  boundValues.boundSix;

            data.push( { "time_utc" : date } );
            data.push( { "rop_fph" :  Number((await dapp.valueBetween(initial.rop_fph, initial.rop_fph + boundOne )).toFixed(precision)) } );
            data.push( { "rpm_rpm" : Number((await dapp.valueBetween(initial.rpm_rpm, initial.rpm_rpm + boundOne )).toFixed(precision)) } );
            data.push( { "spp_psi" : Number((await dapp.valueBetween(initial.spp_psi, initial.spp_psi + boundOne )).toFixed(precision)) } );
            data.push( { "dwob_lb" : Number((await dapp.valueBetween(initial.dwob_lb, initial.dwob_lb + boundTwo )).toFixed(precision)) } ); 
            data.push( { "swob_lb" : Number((await dapp.valueBetween(initial.swob_lb, initial.swob_lb + boundTwo )).toFixed(precision)) } );
            data.push( { "tqr_lbft" : Number((await dapp.valueBetween(initial.tqr_lbft, initial.tqr_lbft + boundTwo )).toFixed(precision)) } );
            data.push( { "bha_type" : await dapp.getRandomValueFromList(initial.bha_type) } );
            data.push( { "mud_weight_sg" : Number((await dapp.valueBetween(initial.mud_weight_sg, initial.mud_weight_sg + boundThree )).toFixed(precision)) } );
            data.push( { "mud_plastic_visc_cp" : Number((await dapp.valueBetween(initial.mud_plastic_visc_cp, initial.mud_plastic_visc_cp + boundThree )).toFixed(precision)) } );
            data.push( { "mud_yield_point_lb_per_100ft_sq" : Number((await dapp.valueBetween(initial.mud_yield_point_lb_per_100ft_sq, initial.mud_yield_point_lb_per_100ft_sq + boundThree )).toFixed(precision)) } );
            data.push( { "mud_flow_rate_gpm" : Number((await dapp.valueBetween(initial.mud_flow_rate_gpm, initial.mud_flow_rate_gpm + boundFour )).toFixed(precision)) } );
            data.push( { "tvd_ft" :  Number((await dapp.valueBetween(initial.tvd_ft, initial.tvd_ft + boundFive)).toFixed(precision)) } );
            data.push( { "md_ft" :  Number((await dapp.valueBetween(initial.md_ft, initial.md_ft + boundFive)).toFixed(precision)) } );
            data.push( { "inc_deg" :  Number((await dapp.valueBetween(initial.inc_deg, initial.inc_deg + boundFive)).toFixed(precision)) } );
            data.push( { "azim_deg" :  Number((await dapp.valueBetween(initial.azim_deg, initial.azim_deg + boundFive)).toFixed(precision)) } );
            data.push( { "dogleg_deg_per_100ft" :  Number((await dapp.valueBetween(initial.dogleg_deg_per_100ft, initial.dogleg_deg_per_100ft + boundFive)).toFixed(precision)) } );
            data.push( { "caliper_hole_size_inches" :  Number((await dapp.valueBetween(initial.caliper_hole_size_inches, initial.caliper_hole_size_inches + boundSix)).toFixed(precision)) } );
            data.push( { "azim_deg" :  Number((await dapp.valueBetween(initial.gr_api, initial.gr_api + boundFour)).toFixed(precision)) } );
            data.push( { "deep_resistivity_ohm_m" :  Number((await dapp.valueBetween(initial.deep_resistivity_ohm_m, initial.deep_resistivity_ohm_m + boundTwo)).toFixed(precision)) } );
            data.push( { "azim_deg" :  Number((await dapp.valueBetween(initial.dtemp_c, initial.dtemp_c + boundFive)).toFixed(precision)) } );
            data.push( { "azim_deg" :  Number((await dapp.valueBetween(initial.shock_g, initial.shock_g + boundFive)).toFixed(precision)) } );
            data.push( { "is_vibration" :  await dapp.getRandomValueFromList(initial.boolean) } );
            data.push( { "is_kick": await dapp.getRandomValueFromList(initial.boolean) } );
            data.push( { "is_stuckpipe" : await dapp.getRandomValueFromList(initial.boolean) } );

            assembleData.push(data)
        }

        return assembleData;   
    }

    async storeDrillingData(data, dataObjectName, createDataObject, db) 
    {
        const dapp =  new DrillingApp();
        let dataLength = data.length;
        await dapp.createTable(createDataObject, dataObjectName, db);  // optional;

        db.serialize(function()
        {
            for(let index = 0; index < dataLength; index++)
            {
                let values = [];
                values.push(data[index][0]["time_utc"].toISOString());
                values.push(data[index][1]["rop_fph"]);
                values.push(data[index][2]["rpm_rpm"]);
                values.push(data[index][3]["spp_psi"]);
                values.push(data[index][4]["dwob_lb"]);
                values.push(data[index][5]["swob_lb"]);
                values.push(data[index][6]["tqr_lbft"]);
                values.push(data[index][7]["bha_type"]);
                values.push(data[index][8]["mud_weight_sg"]);
                values.push(data[index][9]["mud_plastic_visc_cp"]);
                values.push(data[index][10]["mud_yield_point_lb_per_100ft_sq"]);
                values.push(data[index][11]["mud_flow_rate_gpm"]);
                values.push(data[index][12]["tvd_ft"]);
                values.push(data[index][13]["md_ft"]);
                values.push(data[index][14]["inc_deg"]);
                values.push(data[index][15]["azim_deg"]);
                values.push(data[index][16]["dogleg_deg_per_100ft"]);
                values.push(data[index][17]["caliper_hole_size_inches"]);
                values.push(data[index][18]["azim_deg"]);
                values.push(data[index][19]["deep_resistivity_ohm_m"]);
                values.push(data[index][20]["azim_deg"]);
                values.push(data[index][21]["azim_deg"]);
                values.push(data[index][22]["is_vibration"]);
                values.push(data[index][23]["is_kick"]);
                values.push(data[index][24]["is_stuckpipe"])
            
                const sql = `INSERT INTO ${dataObjectName} VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
                    
                db.run(sql, values, function(error)
                {
                    let nonUniqueConstraint = 'SQLITE_CONSTRAINT'; 

                    if(error && (error.code ===  nonUniqueConstraint))
                    {
                        //failure
                        if(String(error).includes("measurement.time_utc"))
                        {
                            return console.log("Failed to insert data due to non-unique time_utc!");
                        }
                    }

                    // success
                    console.log("Data is inserted successfully!");
                });
            }
        });
      
      db.close();
    }

    async queryDrillingData(dataObjectName, dbName, printOption, rowLimit) 
    {
        const path = require('path');
        const { printTable } = require('console-table-printer');
        const dapp =  new DrillingApp();
        const sqlite3 = require('sqlite3').verbose();
        const db = new sqlite3.Database(path.resolve(__dirname, dbName));       // dbName.sqlite3 in the module/script CWD

        const queryOne = `SELECT rowid, time_utc, rop_fph, rpm_rpm, spp_psi, dwob_lb, swob_lb, tqr_lbft, bha_type FROM ${dataObjectName} LIMIT ${rowLimit};`;
        const queryTwo = `SELECT rowid, time_utc, mud_weight_sg, mud_plastic_visc_cp, mud_yield_point_lb_per_100ft_sq, mud_flow_rate_gpm FROM ${dataObjectName} LIMIT ${rowLimit};`;
        const queryThree = `SELECT rowid, time_utc, tvd_ft, md_ft, inc_deg, azim_deg, dogleg_deg_per_100ft, caliper_hole_size_inches, gr_api, deep_resistivity_ohm_m, dtemp_c FROM ${dataObjectName} LIMIT ${rowLimit};`;
        const queryFour = `SELECT rowid, time_utc, shock_g, is_vibration, is_kick, is_stuckpipe FROM ${dataObjectName} LIMIT ${rowLimit};`;
        const queryList = [ queryOne, queryTwo, queryThree, queryFour ];
        const queryListLength = queryList.length;

        db.serialize(function()
        {
            for(let index = 0; index < queryListLength-1; index++)
            {
                db.all(queryList[index], function(error, row)
                {
                    if(error)
                    {
                        console.log(error);
                    }
                    
                    if(printOption === "table")
                    {
                        printTable(row);
                    }
                    
                    if(printOption === "json")
                    {
                        (async function()
                        {
                            dapp.prettyPrint(row);
                        })();
                    }

                    console.log("Data is retrieved successfully!");
                });
            }
       });

        db.close();
    }
}


// run as IIFE
(async function run()
{
    const path = require('path');
    const dapp = new DrillingApp();
    const initial = await dapp.initData();

    const dbName = "drilling_db.sqlite3"; // database name
    const dataObjectName = "realtime"; // table name
    const dataLength = 1000;
    const precision = 2;
    const generateAndStoreData = true; 
    const runQueryToCheckData = false;  
    const rowLimit = 20;
    const printOption = "table" || "json";

    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database(path.resolve(__dirname, dbName)); // database file with name (dbName) in created or already exist in the CWD
    const createDataObject = true;
    
    if(generateAndStoreData === true)
    {
        const data = await dapp.getDrillingData(dataLength, initial, precision);
        return await dapp.storeDrillingData(data, dataObjectName, createDataObject, db);
    }
    else if(runQueryToCheckData  === true)
    {
        return await dapp.queryDrillingData(dataObjectName, dbName, printOption, rowLimit);
    }

})();


module.exports = { DrillingApp };
