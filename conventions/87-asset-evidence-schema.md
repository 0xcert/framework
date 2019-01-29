---
issue: 87
title: Asset evidence schema
id: 331b2de5f698fe579b1c7e735e8dfb96f98026a54ea1a17bae1e292932818df8
author: Kristijan Sedlak <kristijan@0xcert.org>
version: 1.0.0-rc2
category: conventions
status: Draft
created: 2018-11-07
---

## Simple Summary

The evidence schema definition of an asset.

## About

The 0xcert framework provides an algorithm for creates proofs from asset data object which allows selective verification of data by a third party. The file that holds enough information to verify the disclosed content is called the evidence. An asset usually provides additional information about the asset through the public metadata file which should include a URI to the public evidence file which further provides enough information to verify the public metadata.

## Specification

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "definitions": {
    "$schema": {
      "description": "A path to JSON Schema definition file.",
      "type": "string"
    },
    "data": {
      "description": "Asset data evidence.",
      "items": {
      	"type": "object",
        "properties": {
          "nodes": {
            "description": "A list of binary tree hash values.",
            "items": {
              "properties": {
                "index": {
                  "description": "A number representing the hash index in a binary tree.",
                  "type": "integer"
                },
                "hash": {
                  "description": "A string representing the hash value in a binary tree.",
                  "type": "string"
                }
              },
              "type": "object",
            },
            "type": "array"
          },
          "path": {
            "description": "A list of keys representing the JSON path.",
            "items": {
              "type": "string"
            },
            "type": "array"
          },
          "values": {
            "description": "A list of binary tree values.",
            "items": {
              "properties": {
                "index": {
                  "description": "A number representing the value index in a binary tree.",
                  "type": "integer"
                },
                "value": {
                  "description": "A string representing the value in a binary tree.",
                  "type": "string"
                }
              },
              "type": "object"
            },
            "type": "array"
          }
        }
      },
      "type": "array"
    }
  },
  "type": "object",
  "required": ["$schema"]
}
```

## Example

```json
{
  "$schema": "https://raw.githubusercontent.com/0xcert/framework/master/conventions/86-base-asset-schema.md",
  "data": [
    {
      "path": [],
      "nodes": [
        {
          "index": 0,
          "hash": "4810089a5685d9d005e1974b7b63e9d72107fedbd572c1dcd9cacdf77d26b6a1"
        },
        {
          "index": 1,
          "hash": "ad372c5ae525ff99fcdccffb92bad284414f0bd63c2c100c7e37d49d2a7044a5"
        },
        {
          "index": 2,
          "hash": "7e0ba8110ded7f470cf305ba84654c572326162c182c48ee49e19c986d91baba"
        },
        {
          "index": 3,
          "hash": "8a956a16769ec6008f55137c1ea19bfe64e0daef24cc531dbf5a70c3035a9277"
        },
        {
          "index": 4,
          "hash": "6c72bafb40b70773206890cd498b3e16feb244bde7dfc2a7eae0e80867f9cf1b"
        },
        {
          "index": 5,
          "hash": "1db479926d68a501aaabc3d9052f2369b40987395bed099796182667ab55e3f0"
        },
        {
          "index": 6,
          "hash": "a7650a807781364e91c86ddad3b491c943a64623a0bbfe39dc338412d2745750"
        },
        {
          "index": 7,
          "hash": "9f13cdc116bec37ff2ce3b52f5e8d75458b7b21b621b997f5cc1c5dc9755e3d5"
        },
        {
          "index": 8,
          "hash": "fe57a125a8377ddd78ac9e8000b3cc7bf695601d1c194192e12cac46e3005c97"
        },
        {
          "index": 9,
          "hash": "dab3414fe8e0c7e138d6304303185f45782c14f8fdc66133feb6681733495730"
        },
        {
          "index": 10,
          "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        }
      ],
      "values": [
        {
          "index": 0,
          "value": "https://troopersgame.com/dog/evidence"
        },
        {
          "index": 1,
          "value": "http://json-schema.org/draft-07/schema"
        },
        {
          "index": 2,
          "value": "A weapon for the Troopers game which can severely injure the enemy."
        },
        {
          "index": 3,
          "value": "https://troopersgame.com/dog.jpg"
        },
        {
          "index": 4,
          "value": "Magic Sword"
        }
      ]
    }
  ]
}
```
