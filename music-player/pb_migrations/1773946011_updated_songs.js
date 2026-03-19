/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1906970480")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\""
  }, collection)

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "file410859157",
    "maxSelect": 99,
    "maxSize": 52428800,
    "mimeTypes": [
      "audio/wav",
      "audio/mpeg"
    ],
    "name": "audio",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1906970480")

  // update collection data
  unmarshal({
    "createRule": ""
  }, collection)

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "file410859157",
    "maxSelect": 99,
    "maxSize": 500000000000000,
    "mimeTypes": [
      "audio/wav",
      "audio/mpeg"
    ],
    "name": "audio",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
})
