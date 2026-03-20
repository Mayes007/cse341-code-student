/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1906970480")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "file410859157",
    "maxSelect": 1,
    "maxSize": 2147483648,
    "mimeTypes": [
      "audio/wav",
      "audio/mpeg"
    ],
    "name": "audio",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1906970480")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "file410859157",
    "maxSelect": 1,
    "maxSize": 2000000000,
    "mimeTypes": [
      "audio/wav",
      "audio/mpeg"
    ],
    "name": "audio",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
})
