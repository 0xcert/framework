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

TODO

## Specification

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
