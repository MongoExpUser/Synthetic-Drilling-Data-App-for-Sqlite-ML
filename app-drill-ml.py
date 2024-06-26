# ***************************************************************************************************************************************
#  * app-drill-ml.py                                                                                                                    *
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
# *  Project:  Sythentic Drilling Data Application (SynDApp) for Sqlite-ML                                                              *
# *                                                                                                                                     *
# *  1) This script is used for testing machine learning models with the generated synthetic drilling data.                             *
# *                                                                                                                                     *
# *  2)  Run the script as: sudo python3 app-drill-ml.py                                                                                *
# *                                                                                                                                     *
# *  3) Dependencies:                                                                                                                   *
# *      1) Python 3.10 or above  - Link: https://www.python.org/downloads/                                                             *
# *      2) SQLite-ML  - Link: https://github.com/rclement/sqlite-ml                                                                    *
# *                                                                                                                                     *
# ***************************************************************************************************************************************


import sqlite3
from pprint import pprint
from sqlite_ml.sqml import SQML


class DrillML():
    def __init__(self):
        return None

    def separator(self):
        print("----------")

    def check_version(self):
        self.separator()
        pprint( {"SQLite3 Version" : sqlite3.sqlite_version })
        self.separator()
        
    def connection(self, dbname):
        db = sqlite3.connect(dbname)
        sqml = SQML()
        sqml.setup_schema(db)
        sqml.register_functions(db)
        return db
    
    def show_result(self, name, result):
        if result:
            for row_index, item in enumerate(result):
                self.separator()
                row_num = f"{name}-{str(row_index)}"
                pprint( { row_num : item })
                self.separator()

    def sqlite3_query_result_as_dict(self, record, row):
        data_dict = {}
        for index, column in enumerate(record.description):
            data_dict[column[0]] = row[index]
        return data_dict

    def check_models_statistics(self, db):
        query_1 = "SELECT * FROM sqml_deployments;"
        query_2 = "SELECT created_at, updated_at, run_id, library FROM sqml_models;"            
        query_3 = "SELECT * FROM sqml_experiments;"    
        query_4 = "SELECT * FROM sqml_runs;"        
        query_5 = "SELECT * FROM sqml_metrics;"           
        query_6 = "SELECT * FROM sqml_runs_overview;" 
        query_list = [query_1, query_2, query_3, query_4, query_5, query_6]

        if query_list:
            cur = db.cursor()
            for query in query_list:
                cur.row_factory = self.sqlite3_query_result_as_dict
                query_result = cur.execute(query).fetchall()    
                self.separator()
                pprint( { "query result" : query_result } )
                self.separator()

    def ml_modeling(self, db=None, model_table_name=None, source_table_name=None, train=None, predict=None, 
                    algorithm=None, prediction_type=None, split=None, datapoint_number=None, training_query_list=None, 
                    prediction_input_values=None, target_variable=None, prediction_name=None):
        # 1. create connection
        sqml = SQML()
        sqml.setup_schema(db)
        sqml.register_functions(db)
        sqml_predict = sqml.predict
        cur = db.cursor()

        # 2. create model 
        if train:
            # load data
            for query in training_query_list:
                print(query)
                query_result = cur.execute(query).fetchone()
                self.show_result("query_result", query_result)
            # train, save and show model
            train_query = f"SELECT sqml_train('{prediction_name}', '{prediction_type}', '{algorithm}', '{model_table_name}', '{target_variable}', {split}, 'shuffle');"
            train_result = cur.execute(train_query).fetchone() 
            self.show_result("train_result", train_result)

        # 3. inference/predict with model
        if predict:
            # single
            predict_query = f"SELECT '{model_table_name}'.*, sqml_predict('{prediction_name}', json_object({prediction_input_values})) AS prediction FROM '{model_table_name}' LIMIT 1;"  
            cur.row_factory = self.sqlite3_query_result_as_dict
            query_result = cur.execute(predict_query).fetchone()    
            self.separator()
            pprint( { "prediction_result" : query_result } )
            self.separator()
            
            # multiple match values
            predict_query = f"""
                            SELECT '{model_table_name}'.*, batch.value AS prediction, '{model_table_name}'.'{target_variable}' = batch.value AS match 
                            FROM '{model_table_name}' 
                            JOIN json_each ( 
                              ( 
                                SELECT sqml_predict_batch(
                                   '{prediction_name}', 
                                    json_group_array
                                    ( 
                                        json_object({prediction_input_values})
                                    )
                                ) 
                                FROM 
                                    '{model_table_name}' 
                                )
                             ) batch ON (batch.rowid + 1) = '{model_table_name}'.rowid 
                             WHERE match = TRUE;
                            """  
            cur.row_factory = self.sqlite3_query_result_as_dict
            query_result = cur.execute(predict_query).fetchall()    
            self.separator()
            pprint( { "prediction_result" : query_result } )
            self.separator()

        # 4. close connection
        cur.close()
        db.close()


def main():
    # 1. database
    dml = DrillML()
    model_table_name = 'drill_data'
    source_table_name = 'realtime'
    dbname = "drilling_db.sqlite3"
    db = dml.connection(dbname)

    # 2. train or predict
    # evaluate all the algorithms in the following list and pick the best (highest score) for final modeling
    # algorithms = [ 'mlp', 'sgd', 'ada-boost', 'svc', 'random_forest', 'gradient_boosting', 'logistic_regression', 'ridge', 'ridge_cv', 'bagging', 'decision_tree', 'knn' ]
    algorithms = [ 'mlp' ]
    prediction_type = 'classification'
    split = 0.25
    datapoint_number = 10 # or 20, 50, 70, 200 ... n .
    target_variable = 'is_kick'
    prediction_name = 'kick_prediction'
    training_query_list = None
    prediction_input_values = None
    train = True
    predict = False

    if train or predict:
        if train:
            query_1 = f"DROP TABLE IF EXISTS {model_table_name}" 
            query_2 = f"CREATE TABLE '{model_table_name}' (is_kick INTEGER, rop_fph FLOAT, rpm_rpm FLOAT, spp_psi FLOAT, dwob_lb FLOAT, swob_lb FLOAT, tqr_lbft FLOAT);"
            query_3 = f"INSERT INTO '{model_table_name}' SELECT is_kick, rop_fph, rpm_rpm, spp_psi, dwob_lb, swob_lb, tqr_lbft FROM '{source_table_name}' WHERE rowid <= {datapoint_number};"
            training_query_list = [query_1, query_2, query_3]
            
        if predict:
            prediction_input_values = "'rop_fph', [rop_fph], 'rpm_rpm', [rpm_rpm], 'spp_psi', [spp_psi], 'dwob_lb', [dwob_lb], 'swob_lb', [swob_lb], 'tqr_lbft', [tqr_lbft]"
            
        for algorithm in algorithms:
            dml.ml_modeling(db=db, model_table_name=model_table_name, source_table_name=source_table_name, train=train, 
                            predict=predict, algorithm=algorithm, prediction_type=prediction_type, split=split, 
                            datapoint_number=datapoint_number, training_query_list=training_query_list, 
                            prediction_input_values=prediction_input_values, target_variable=target_variable, 
                            prediction_name=prediction_name)
    else:
    # 3. check info
        check_version = True
        check_statistics = False
        if check_version:
            dml.check_version()
        if check_statistics:
            dml.check_models_statistics(db)

if __name__ in ["__main__"]:
    main()
