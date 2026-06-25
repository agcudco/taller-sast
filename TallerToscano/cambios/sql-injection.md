# SQL Injection - corrección

Archivo: `apps/analisis-vulnerabilidades/backend/index.js`

Semgrep marcó la regla `express-sqlite-sqli` en las búsquedas de categorías y productos.

## Categorías - antes

```javascript
app.get('/api/categories/search', (req, res) => {
  const searchTerm = req.query.name || '';
  const query = `SELECT * FROM categories WHERE name LIKE '%${searchTerm}%'`;
  console.log('[SQLi Categories]', query);
  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
```

## Categorías - después

```javascript
app.get('/api/categories/search', (req, res) => {
  const searchTerm = req.query.name || '';
  const query = 'SELECT * FROM categories WHERE name LIKE ?';
  db.all(query, [`%${searchTerm}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
```

## Productos - mismo cambio

Reemplacé la concatenación por `?` y pasé el término como parámetro en el arreglo.

## Por qué lo hice así

Con `?` el input del usuario no forma parte del SQL como código, solo como valor. Eso evita la inyección básica que probamos en clase.
