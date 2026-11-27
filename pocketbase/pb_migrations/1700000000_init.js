/// <reference path="../pb_data/types.d.ts" />
// Programs For You schema. Every collection has null API rules, which means only the superuser (the website's server code) can touch them.
// Applied automatically when PocketBase starts (the folder is mounted as /pb_migrations).
migrate((app) => {
  const created = () => ({ type: 'autodate', name: 'created_at', onCreate: true, onUpdate: false });
  const text = (name, extra = {}) => ({ type: 'text', name, ...extra });
  const bool = (name) => ({ type: 'bool', name });
  const num = (name) => ({ type: 'number', name, onlyInt: true });

  // ---- users: PocketBase's built-in login collection, plus our fields ----
  const users = app.findCollectionByNameOrId('users');
  users.listRule = users.viewRule = users.createRule = users.updateRule = users.deleteRule = null;
  users.passwordAuth.enabled = true;
  users.oauth2.enabled = false;
  users.otp.enabled = false;
  users.authRule = ''; // anyone with the right password may log in; the site checks `disabled` itself
  users.fields.add(new TextField({ name: 'name', required: true, max: 100 }));
  users.fields.add(new SelectField({ name: 'role', required: true, maxSelect: 1, values: ['admin1', 'admin2'] }));
  users.fields.add(new BoolField({ name: 'disabled' }));
  users.fields.add(new NumberField({ name: 'failed', onlyInt: true }));
  users.fields.add(new NumberField({ name: 'locked_until', onlyInt: true }));
  app.save(users);

  const make = (name, fields, indexes = []) =>
    app.save(new Collection({ type: 'base', name, listRule: null, viewRule: null, createRule: null, updateRule: null, deleteRule: null, fields, indexes }));

  // Invite and password-reset links (only a hash of the link is stored).
  make('tokens', [
    { type: 'relation', name: 'user', required: true, collectionId: users.id, cascadeDelete: true, maxSelect: 1 },
    text('token_hash', { required: true }),
    { type: 'select', name: 'kind', required: true, maxSelect: 1, values: ['invite', 'reset'] },
    num('expires'), created()
  ], ['CREATE UNIQUE INDEX idx_tokens_hash ON tokens (token_hash)']);

  make('tickets', [
    text('ticket_id', { required: true, pattern: '^PFY-[A-Z0-9]{5}$' }),
    text('name', { required: true, max: 200 }), { type: 'email', name: 'email', required: true },
    text('app', { required: true, max: 100 }), text('summary', { required: true, max: 2000 }),
    bool('confirmation_sent'), created()
  ], ['CREATE UNIQUE INDEX idx_tickets_id ON tickets (ticket_id)', 'CREATE INDEX idx_tickets_email ON tickets (email)']);

  make('applications', [
    text('name', { required: true, max: 200 }), { type: 'email', name: 'email', required: true },
    text('grade', { required: true }), text('role', { required: true }), text('department', { required: true }),
    text('why', { required: true, max: 2000 }), text('skills', { max: 1500 }),
    { type: 'date', name: 'read_at' }, bool('confirmation_sent'), created()
  ], ['CREATE INDEX idx_applications_email ON applications (email)']);

  make('people', [
    num('sort'), text('name'), text('initials'), text('g1'), text('g2'),
    text('title', { required: true }), text('note'), bool('founder'), bool('soon')
  ]);

  make('volunteers', [
    text('name', { required: true }), { type: 'email', name: 'email', required: true },
    text('grade'), text('department', { required: true }), text('note'), bool('listed'), created()
  ], ['CREATE UNIQUE INDEX idx_volunteers_email ON volunteers (email)']);

  make('push_subscriptions', [
    text('endpoint', { required: true, max: 1000 }), text('p256dh', { required: true }), text('auth', { required: true }), created()
  ], ['CREATE UNIQUE INDEX idx_push_endpoint ON push_subscriptions (endpoint)']);

  make('downloads', [
    text('file', { required: true }), num('count'), { type: 'date', name: 'last_at' }
  ], ['CREATE UNIQUE INDEX idx_downloads_file ON downloads (file)']);
}, (app) => {
  for (const n of ['downloads', 'push_subscriptions', 'volunteers', 'people', 'applications', 'tickets', 'tokens']) app.delete(app.findCollectionByNameOrId(n));
});
