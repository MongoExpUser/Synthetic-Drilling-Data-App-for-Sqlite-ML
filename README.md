# Synthetic-Drilling-Data-App-for-Sqlite-ML
Generate synthetic drilling data that can be used for testing machine learning (ML) models with sqlite-ml or other frameworks.

## Purpose    
* While testing or demonstrating some ML models for drilling events classification and detection, a common problem is not having enough data (measured or/and calculated data) to train the models.
* To resolve this, the <strong> Sythentic Drilling Data Application (SynDApp) </strong> is created to generate some synthentic or random data that can be used for testing the ML models.
* The application can be used for testing machine learning (ML) models, by any of the following options: <br>
  - Directly within sqlite-ml - See: https://github.com/rclement/sqlite-ml <br>
  - Exporting the data and using the data with any other ML framework (e.g. Tensorflow (Python), TensorFlow.js, Sklearn, etc.)
* The application is built to ensure that the generated data is within reasonable bounds that make sense, e.g. <br>
  - Events data (is_kick, is_vibration and is_stuckpipe): can only be 0 (false) or 1 (true) <br>
  - Gamma ray (gr_api) data is bounded as:  0 >= gr_api <= 150 <br>
  - Deep resistivity data is bounded as: 0 >= deep_resistivity_ohm_m <= 2000 <br>
  - Also other drilling measured or calculated parameters are bounded to reasonable values observed in drilling field operations.
* The generated data, that is stored in sqlite3 database, is portable and can be exported to other RDBMS databases. The syntax used for creating the schemas (structures) and inserting the data is selected to ensure that the database can easily be dumped (exported) into plain .sql file and restored (imported) to other RDBMS engines.

## Caveot  
* Despite the above intention of ensuring reasonable generated data, it should be noted that the data generated from the application <strong>(SynDApp)</strong> is <strong> only intented </strong> for testing and demonstration and not for actual real-time drilling events modeling or prediction.
* For real-time field-based ML training and prediction, data (measured and/or calculated) obtained from actual drilling field operations should be used.
    
## Installing Dependencies 
* NodeJS 18.11.0 or above (https://nodejs.org/en/download)
* Node-sqlite3 (https://www.npmjs.com/package/sqlite3)
* Console-table-printer (https://www.npmjs.com/package/console-table-printer)

##  Run App
* To run the app: <br>
  - Download the NodeJS source file in this repository: <strong> app.js </strong> <br>
  - Edit relevant input variables within the <strong> async main method </strong> of the source file, as deem necessary. <br>
  - Then, run the script as: <strong> sudo node --inspect --trace-warnings --trace-deprecation --watch app.js </strong>

## Test ML Models Using Generated Data within SQLite-ML
* Install Dependencies: <br>
  - Python 3.10 or above (https://www.python.org/downloads/) <br>
  - SQLite-ML (https://github.com/rclement/sqlite-ml) <br>
* Download the Python source file in this repository: <strong> app-drill-ml.py </strong> <br>
* Edit relevant input variables within the <strong> main method </strong> of the source file, as deem necessary. <br>
* Then, run the script as: <strong> sudo python3  app-drill-ml.py </strong>



# License

Copyright © 2023. MongoExpUser

Licensed under the MIT license.
