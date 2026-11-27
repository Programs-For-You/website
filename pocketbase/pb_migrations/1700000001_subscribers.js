/// <reference path="../pb_data/types.d.ts" />
// Newsletter signups. Locked to the superuser like every other collection. `token` is the private unsubscribe key in each email's link.
migrate((app) => {
  app.save(new Collection({
    type: 'base', name: 'subscribers', listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null,
    fields: [
      { type: 'email', name: 'email', required: true },
      { type: 'text', name: 'token', required: true },
      { type: 'bool', name: 'unsubscribed' },
      { type: 'autodate', name: 'created_at', onCreate: true, onUpdate: false }
    ],
    indexes: ['CREATE UNIQUE INDEX idx_subscribers_email ON subscribers (email)', 'CREATE UNIQUE INDEX idx_subscribers_token ON subscribers (token)']
  }));
}, (app) => {
  app.delete(app.findCollectionByNameOrId('subscribers'));
});
