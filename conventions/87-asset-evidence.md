---
issue: 1
title: Asset Evidence
author: Kristijan Sedlak <kristijan@0xcert.org>
version: 0.0.0-alpha1
category: conventions
status: Draft
created: 2018-11-07
---

## Simple Summary


## About


## Specification

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "description": "The evidence file with data to verify the asset data.",
  "properties": {
    "values": {
      "description": "...",
      "type": "..."
    },
    "nodes": {
      "description": "...",
      "type": "..."
    }
  },
  "title": "Asset Evidence",
  "type": "object"
}
```

## Example

```json
{
  "$evidence": "http://...",
  "$schema": "http://...",
  "description": "Magic Sword",
  "id": "fc819",
  "image": "https://troopersgame.com/dog.jpg",
  "name": "A weapon for the Troopers game which can severely injure the enemy."
}
```

## Copyright

Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
