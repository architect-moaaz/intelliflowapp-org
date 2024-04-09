import React, { useState, useEffect } from "react";
import QueryDeleteIcon from "./../../assets/reportBuilderIcons/QueryDeleteIcon.svg";

const QueryBuilder = ({ allEntitiesList, tableName, queryObj, setQueryObj, setShowQueryPopup }) => {
  const QueryOperators = [
    {
      display: "=",
      value: "=",
    },
    {
      display: "!=",
      value: "!=",
    },
    {
      display: ">",
      value: ">",
    },
    {
      display: ">=",
      value: ">=",
    },
    {
      display: "<",
      value: "<",
    },
    {
      display: "<=",
      value: "<=",
    },
  ];

  const QueryOperatorsMongo = [
    {
      display: "=",
      value: "$eq",
    },
    {
      display: "!",
      value: "$ne",
    },
    {
      display: ">",
      value: "$gt",
    },
    {
      display: ">=",
      value: "$gte",
    },
    {
      display: "<",
      value: "$lt",
    },
    {
      display: "<=",
      value: "$lte",
    },
  ];

  const [queryData, setQueryData] = useState({
    // id: "5c63f3de-6007-4258-bf65-5554e0c0f14c",
    combinator: "AND",
    // not: false,
    rules: [
      {
        id: "qid" + Date.now(),
        field: "",
        operator: "",
        // valueSource: "value",
        value: "",
      },
    ],
  });

  const ruleTemplate = {
    field: "",
    value: "",
    operator: "",
    // valueSource: "value",
  };

  const ruleGroupTemplate = {
    rules: [],
    combinator: "and",
    not: false,
  };

  let marginleft = 15;

  const handleGlobalCombinatorChange = (e, index) => {
    console.log(e.target.value, index);
    let queryDataTemp = { ...queryData };
    console.log(queryDataTemp);
    queryDataTemp.combinator = e.target.value;
    setQueryData(queryDataTemp);
  };

  let nestedRuleGroupIndex = 1;

  const handleAddRule = () => {
    let queryDataTemp = { ...queryData };
    let rule = ruleTemplate;
    rule.id = "qid" + Date.now();
    queryDataTemp.rules.push(rule);
    setQueryData(queryDataTemp);
  };

  const handleRemoveRule = (ruleid) => {
    let queryDataTemp = { ...queryData };
    queryDataTemp.rules = queryDataTemp.rules.filter(
      (rule, index) => rule.id !== ruleid
    );
    setQueryData(queryDataTemp);
  };

  const handleAddRuleGroup = (rulegroupIndex, ruleGroupArrayIndex) => {
    let rulegroupIndexLocal = 1;
    let queryDataTemp = { ...queryData };
    // queryDataTemp.rules.push(ruleGroupTemplate)
    console.log("currentclicked", rulegroupIndex, ruleGroupArrayIndex);

    const findRuleGroup = (qdata, rgIndex, ruleGroupArrayIndex) => {
      if (rulegroupIndex == rgIndex) {
        console.log("qdata", qdata);
        qdata.rules.push(ruleGroupTemplate);
      } else {
        console.log("blocker", qdata);

        qdata.rules.map((rule, index) => {
          if (rule.rules) {
            findRuleGroup(rule, rgIndex + 1, ruleGroupArrayIndex);
          }
        });
      }
    };

    findRuleGroup(queryDataTemp, 1, ruleGroupArrayIndex);
    setQueryData(queryDataTemp);
  };

  const handleRuleEntityChange = (e, index) => {
    console.log("trigerred");
    let queryDataTemp = { ...queryData };

    console.log(queryDataTemp.rules[index]);
    queryDataTemp.rules[index].field = e.target.value;

    setQueryData(queryDataTemp);
  };

  const handleRuleOperatorChange = (e, index) => {
    let queryDataTemp = { ...queryData };

    queryDataTemp.rules[index].operator = e.target.value;

    setQueryData(queryDataTemp);
  };

  const handleRuleValueChange = (e, index) => {
    let queryDataTemp = { ...queryData };

    queryDataTemp.rules[index].value = e.target.value;

    setQueryData(queryDataTemp);
  };

//   useEffect(() => {
//     generateQuery();
//   }, [queryData]);

  const generateQuery = () => {
    // let tableName = "tablename";

    let query = {};

    let qarr = [];

    queryData.rules.map((query) => {
        let tableEntityName = `${tableName}`+`.${query.field}`
     let mongoQuery = generateInnerQuery(query.operator, query.value, tableEntityName);
     qarr.push(mongoQuery)
    });

    console.log("qarr",qarr);
    // query[`${tableName}.${qbAndEntity}`][`${qbAndOperator}`] = qbAndValue;
    
    console.log(query);

    query[`$${queryData.combinator.toLowerCase()}`]=qarr

    console.log("query",query)
    setQueryObj(query)
    setShowQueryPopup(false)
  };

  const generateInnerQuery = (operator, value, entityName) => {
    let q = {};
    switch (operator) {
      case "=":
        // let q = {};
        q[`${entityName}`] = isNaN(value) ? value : Number(value);
        console.log(q);
        return q;
        break;
      case "!=":
        q[`${entityName}`] = {};
        q[`${entityName}`][`$ne`] = isNaN(value) ? value : Number(value);
        console.log(q);
         return q;
        break;
      case ">":
        // let q = {};
        q[`${entityName}`] = {};
        q[`${entityName}`][`$gt`] = isNaN(value) ? value : Number(value);
        console.log(q);
         return q;
        break;
      case "<":
        // let q = {};
        q[`${entityName}`] = {};
        q[`${entityName}`][`$lt`] = isNaN(value) ? value : Number(value);
        console.log(q);
         return q;
        break;

      case "<=":
        // let q = {};
        q[`${entityName}`] = {};
        q[`${entityName}`][`$lte`] = isNaN(value) ? value : Number(value);
        console.log(q);
         return q;
        break;
      case ">=":
        // let q = {};
        q[`${entityName}`] = {};
        q[`${entityName}`][`$gte`] = isNaN(value) ? value : Number(value);
        console.log(q);
        break;

      default:
        break;
    }
  };

  const queryReverse = (queryObj) => {
    let queryObjTemp = {...queryObj}
    let queryDataTemp = {...queryData}
    console.log("q2jtrigerred")
    if ('$or' in queryObjTemp){
        console.log("or")
        queryDataTemp.combinator = "OR"
    }
    else if ('$and' in queryObjTemp){
        console.log("and")
        queryDataTemp.combinator = "AND"
    }

    queryObjTemp.map((query) => {
        
    })
console.log(queryDataTemp)
    setQueryData(queryDataTemp)
  }


  const jsonToQuery =(field, operator) => {

  }

//   useEffect(() => {
//     if (Object.keys(queryObj).length > 0) {
//         console.log(queryObj)
//         queryReverse(queryObj)
//     }
//   },[])

  const RuleGroup = (data, rulegroupIndex, ruleGroupArrayIndex) => {
    marginleft = marginleft + 15;
    let rulegroupIndexNext = rulegroupIndex + 1;

    return (
      <div className="px-5 py-3">
        <div className=" mt-3 d-flex flex-row justify-content-between">
          <div>
            <select
              className="px-2 p-1"
              style={{
                backgroundColor: "#0D3C84",
                border: "0.615094px solid #0D3C84",
                color: "white",
              }}
              onChange={(e) =>
                handleGlobalCombinatorChange(e, ruleGroupArrayIndex)
              }
            >
              <option
                value="AND"
                selected={data.combinator == "AND" ? true : false}
              >
                AND
              </option>
              <option
                value="OR"
                selected={data.combinator == "OR" ? true : false}
              >
                OR
              </option>
            </select>
          </div>
          <div>
            <button
              className="ms-2 secondaryButton secondaryButtonColor"
              onClick={() => handleAddRule()}
            >
              {/* + Rule */}+ Add Query
            </button>
          </div>

          {/* <button
            className="px-3 p-2 ms-2"
            onClick={() => {
              handleAddRuleGroup(rulegroupIndex, ruleGroupArrayIndex);
            }}
          >
            + Group
          </button> */}

          {/* <button className="px-3 p-2 ms-2 bg-danger">- Group</button> */}
        </div>
        {data.rules.map((rule, index) => {
          return (
            <div key={index} style={{ marginLeft: `${marginleft}px` }}>
              <div>
                {!rule.rules && (
                  <div className="and-block mt-2">
                    <div className="d-flex flex-row">
                      <div
                        className="d-flex justify-content-center align-items-center ms-3"
                        style={{ height: "100%" }}
                      >
                        <select
                          name="entities"
                          id="entities"
                          className="query-dropdown"
                          // onChange={(e) => setQbAndEntity(e.target.value)}
                          onChange={(e) => handleRuleEntityChange(e, index)}
                        >
                          <option
                            selected={rule.field == "" ? true : false}
                            disabled
                          >
                            column
                          </option>
                          {allEntitiesList.map((entity) => {
                            return (
                              <option
                                value={entity}
                                selected={rule.field == entity ? true : false}
                              >
                                {entity}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div
                        className="d-flex justify-content-center align-items-center ms-3"
                        style={{ height: "100%" }}
                      >
                        <select
                          name="test"
                          id="test"
                          className="query-dropdown"
                          onChange={(e) => handleRuleOperatorChange(e, index)}
                        >
                          <option
                            selected={rule.operator == "" ? true : false}
                            disabled
                          >
                            operator
                          </option>
                          {QueryOperators.map((operation) => {
                            return (
                              <option
                                value={operation.value}
                                selected={
                                  rule.operator == operation.value
                                    ? true
                                    : false
                                }
                              >
                                {operation.display}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div
                        className="d-flex justify-content-center align-items-center ms-3"
                        style={{ height: "100%" }}
                      >
                        <input
                          name="qvalue"
                          id="qvalue"
                          className="query-dropdown"
                          placeholder="text"
                          value={rule.value}
                          //   autoFocus="autoFocus"

                          onChange={(e) => handleRuleValueChange(e, index)}
                        />
                      </div>

                      <div>
                        {/* <button
                          className="px-2  py-1 mx-2"
                          // onClick={() => generateANDQuery()}
                        >
                          +
                        </button> */}
                      </div>

                      <div>
                        {/* <button className="px-2  py-1 mx-2 bg-danger">-</button> */}
                      </div>

                      <div
                        className=" ms-auto me-4 d-flex justify-content-center align-items-center"
                        onClick={() => handleRemoveRule(rule.id)}
                      >
                        <img src={QueryDeleteIcon} alt="delete query" />
                      </div>
                    </div>
                  </div>
                )}
                {rule.rules && RuleGroup(rule, rulegroupIndexNext, index)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="d-flex flex-column justify-content-between">
        <div>
      {RuleGroup(queryData, 1, 0)}
      </div>
      {/* <button onClick={() => console.log(queryData)}>see data</button> */}
      <div className="px-5 py-3 d-flex justify-content-end" >
        <button className="primaryButton primaryButtonColor mt-5" onClick={() => generateQuery()}>Apply</button>
      </div>
    </div>
  );
};

export default QueryBuilder;
