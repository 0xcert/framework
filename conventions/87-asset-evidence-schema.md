---
issue: 87
title: Asset evidence schema
id: ba47537e90fbfd7e33779556471e9122f3abc33016f96c2234ec29fb57315487
author: Kristijan Sedlak <kristijan@0xcert.org>
version: 1.0.0
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
                "hash": {
                  "description": "A string representing the hash value in a binary tree.",
                  "type": "string"
                },
                "index": {
                  "description": "A number representing the hash index in a binary tree.",
                  "type": "integer"
                }
              },
              "type": "object"
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
                "nonce": {
                  "description": "A string representing value secret.",
                  "type": "string"
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
  "required": ["$schema", "data"],
  "title": "Asset evidence",
  "type": "object"
}
```

## Example

```json
{
    "$schema": "https://conventions.0xcert.org/87-asset-evidence-schema.json",
    "data": [
        {
            "path": [],
            "nodes": [
                {
                    "index": 1,
                    "hash": "9b61df344ebc1740d60333efc401150f756c3e3bc13f9ca31ddd96b8fc7180fe"
                },
                {
                    "index": 3,
                    "hash": "d95a266f24ca0ca79539cb3620832d9d37b415023002e8748458d34da53ccc1b"
                },
                {
                    "index": 8,
                    "hash": "3ef34334173d794cfc862c2f05580975ba10bea41e7ff2c60164a8288dee0cc6"
                }
            ],
            "values": [
                {
                    "index": 2,
                    "value": "A weapon for the Troopers game which can severely injure the enemy.",
                    "nonce": "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"
                },
                {
                    "index": 3,
                    "value": "https://troopersgame.com/dog.jpg",
                    "nonce": "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce"
                }
            ]
        }
    ]
}
```
