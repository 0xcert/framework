---
title: Xcert JSON Schema
author: Kristijan Sedlak <kristijan@0xcert.org>
version: 1.0.0
category: conventions
status: Draft
created: 2019-11-26
---

## Simple Summary

[JSON Schema](https://json-schema.org/) definition describing Xcert JSON Schema capabilities.

## About

Every digital asset in the 0xcert Protocol is defined by a subset of JSON Schema - the Xcert Schema, which is a data model that determines the data to be defined in the creation of an Xcert digital asset.

JSON Schema is the base data vocabulary that describes and validates the capabilities of the Xcert Schema to which all Xcerts (digital assets) MUST conform.

## Specification

The keywords “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in RFC 2119.

0xcert Protocol uses Xcert Schema, which is a subset of JSON Schema, to define asset schemas. By rule, every asset schema MUST follow the Xcert Schema specification.

This specification is provided in a machine-readable format using the JSON Schema format.


```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Core schema meta-schema",
  "definitions": {
    "stringSchema": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": ["string"],
        },
      },
    },
    "numberSchema": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": ["number"],
        },
      },
    },
    "booleanSchema": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": ["boolean"],
        },
      },
    },
    "objectSchema": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": ["object"],
        },
        "properties": {
          "patternProperties": {
            "^.*$": {
              "anyOf": [
                { "$ref": "#/definitions/objectSchema" },
                { "$ref": "#/definitions/arraySchema" },
                { "$ref": "#/definitions/stringSchema" },
                { "$ref": "#/definitions/numberSchema" },
                { "$ref": "#/definitions/booleanSchema" },
              ],
            },
          },
        },
      },
    },
    "arraySchema": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": ["array"],
        },
        "items": {
          "anyOf": [
            { "$ref": "#/definitions/objectSchema" },
            { "$ref": "#/definitions/stringSchema" },
            { "$ref": "#/definitions/numberSchema" },
            { "$ref": "#/definitions/booleanSchema" },
          ],
        },
      },
    },
    "simpleTypes": {
      "enum": [
        "array",
        "boolean",
        "integer",
        "null",
        "number",
        "object",
        "string",
      ],
    },
  },
  "type": ["object", "boolean"],
  "properties": {
    "$schema": {
      "type": "string",
      "format": "uri",
    },
    "$evidence": {
      "type": "string",
      "format": "uri",
    },
    "title": {
      "type": "string",
    },
    "description": {
      "type": "string",
    },
    "type": {
      "type": "string",
      "enum": ["object"],
    },
    "items": {
      "anyOf": [
        { "$ref": "#/definitions/objectSchema" },
        { "$ref": "#/definitions/stringSchema" },
        { "$ref": "#/definitions/numberSchema" },
        { "$ref": "#/definitions/booleanSchema" },
      ],
    },
    "properties": {
      "patternProperties": {
        "^.*$": {
          "anyOf": [
            { "$ref": "#/definitions/objectSchema" },
            { "$ref": "#/definitions/arraySchema" },
            { "$ref": "#/definitions/stringSchema" },
            { "$ref": "#/definitions/numberSchema" },
            { "$ref": "#/definitions/booleanSchema" },
          ],
        },
      },
    },
  },
}
```

## Example

```json
{
  "$schema": "https://conventions.0xcert.org/json-schema.json",
  "properties": {
    "fullName": {
      "description": "",
      "type": "string",
    },
  },
  "title": "My custom schema",
  "type": "object",
}
```
