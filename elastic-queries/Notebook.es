GET /plan/_search
{
  "query": { "match_all": {} }
}
// Get parents with child of type planserviceCostShares and copay>1
GET /plan/_search
{
  "query": {
    "has_child": {
      "type": "planserviceCostShares",
      "query": { "range": { "copay": { "gte": 1 } } }
    }
  }
}
GET /plan/_search
{
  "query": {
    "has_child": {
      "type": "linkedPlanServices",
      "query": { "match_all": {} }
    }
  }
}
// get child objects who has parent type linekdPLanServices and and object id 27283xvx9asdff-504
GET /plan/_search
{
  "query": {
    "has_parent": {
      "parent_type": "linkedPlanServices",
      "query": {
        "bool": {
          "must": [
            { "match": { "objectId": "27283xvx9asdff-504" } }
          ]
        }
      }
    }
  }
}
//GET PLAN
GET /plan/_search
{
  "query": {
    "has_parent": {
      "parent_type": "plan",
      "query": { "match_all": {} }
    }
  }
}
GET /plan/_search
{
  "query": {
    "has_child": {
      "type": "planserviceCostShares",
      "query": { "range": { "copay": { "gte": 10 } } }
    }
  }
}
//failed queries
GET /plan/_search
{
  "query": {
    "has_parent": {
      "parent_type": "planserviceCostShares",
      "query": {
        "bool": {
          "must": [
            { "match": { "objectId": "1234512xvc1314asdfs-503" } }
          ]
        }
      }
    }
  }
}
//failed queries
GET /plan/_search
{
  "query": {
    "has_parent": {
      "parent_type": "planservice",
      "query": {
        "bool": {
          "must": [
            { "match": { "objectId": "1234512xvc1314asdfs-503" } }
          ]
        }
      }
    }
  }
}
GET /plan/_search
{ "query": { "match": { "objectId": "27283xvx9asdff-504" } } }
GET /plan/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "has_parent": {
            "parent_type": "linkedPlanServices",
            "query": { "match": { "objectId": "27283xvx9asdff-504" } }
          }
        }
      ]
    }
  }
}
GET /plan/_search
{
  "query": {
    "has_parent": {
      "parent_type": "linkedPlanServices",
      "query": { "match": { "objectId": "27283xvx9asdff-504" } }
    }
  }
}