from flask import Flask
from neo4j import GraphDatabase
from os import getenv
from flask_request_validator import (
    PATH,
    FORM,
    Param,
    Pattern,
    validate_params
)
app = Flask(__name__)

driver = GraphDatabase.driver(getenv("DB_HOST"), auth=(getenv("DB_USER"), getenv("DB_PASS")), encrypted=False)

def get_drugs(tx, name):
    result = tx.run("MATCH (patient:Patient{firstName:$name})-[:HAS_ENCOUNTER]-(encounter:Encounter)-[:HAS_DRUG]-(drug:Drug) RETURN patient,encounter,drug LIMIT 10", name=name)

    return [record['drug']['description'] for record in result]

@app.route("/allergies/<name>", methods=['GET'])
@validate_params(
    Param('name', PATH, str)
)
def get_drugs_route(name):
    with driver.session() as session:
        result = session.write_transaction(get_drugs, name)

    return {"drugs": result}

if __name__ == "__main__":
    app.run(host="0.0.0.0")