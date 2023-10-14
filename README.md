# Synthetic-Drilling-Data-App-for-Sqlite-ML
Generate synthetic drilling data that can be used for testing machine learning (ML) models with sqlite-ml or other frameworks.

## Purpose    
* While testing or demonstrating some ML models for drilling events classification and detection, a common problem is not having enough data (measured or/and calculated data) to train the models.
* To resolve this, the <strong> Sythentic Drilling Data Application (SynDApp) </strong> is created to generate some synthentic or random data that can be used for testing the ML models.
* The application can be used for testing machine learning (ML) models, by any of the following options: <br>
  (1) Directly within sqlite-ml - See: https://github.com/rclement/sqlite-ml <br>
  (2) Exporting the data and using the data with any other ML framework (e.g. Tensorflow (Python), TensorFlow.js, Sklearn, etc.)
* The application is built to ensure that the generated data is within reasonable bounds that make sense, e.g. <br>
  (1) Events data (is_kick, is_vibration and is_stuckpipe): can only be 0 (false) or 1 (true) <br>
  (2) Gamma ray (gr_api) data is bounded as:  0 >= gr_api <= 150 <br>
  (3) Deep resistivity data is bounded as: 0 >= deep_resistivity_ohm_m<= 2000 <br>
  (4) Also other drilling measured or calculated parameters are bounded to reasonable values observed in drilling field operations.
* The generated data, that is stored in sqlite3 database, is portable and can be exported to other RDBMS databases. The syntax used for creating the schemas (structures) and inserting the data is selected to ensure that the database can easily be dumped (exported) into plain .sql file and restored (imported) to other RDBMS engines.

## Caveot  
* Despite the above intention of ensuring reasonable generated data, it should be noted that the data generated from the application <strong>(SynDApp)</strong> is <strong> only intented </strong> for testing and demonstration and not for actual real-time drilling events modeling or prediction.
* For real-time field-based ML training and prediction, data (measured and/or calculated) obtained from actual drilling field operations should be used.
    
## Dependencies
* <strong> SQlite3 </strong> <br>
  Link to download and installation instruction: https://www.sqlite.org/download.html
* <strong> Node-sqlite3 </strong> <br>
  Link to download and installation instruction: https://www.npmjs.com/package/sqlite3
* <strong> Console-table-printer </strong> <br>
  Link to download and installation instruction: https://www.npmjs.com/package/console-table-printer

##  Run App
* To run the app: <br>
  (1) Download the NodeJS source file, <strong> app.js </strong> <br>
  (2) Edit relevant input variables on lines 327 to 334 of the source file, as deem necessary. <br>
  (3) Then, run the script as: <strong> sudo node --inspect --trace-warnings --watch app.js </strong>

# Test ML Models Using Generated Data within SQlite-ML
* Install Dependencies: <br>
  Python 3.10 or above (https://www.python.org/downloads/) <br>
  Sqlite-ml (https://github.com/rclement/sqlite-ml) <br>
* Download the Python source file in this respo: <strong> app-drill-ml.py </strong> <br>
* Edit relevant input variables on in the <strong> main method </string> of the script, as deem necessary. <br>
* Then, run the script as: <strong> sudo python3  app-drill-ml.py </strong>



# License

Copyright © 2023. MongoExpUser

Licensed under the MIT license.
