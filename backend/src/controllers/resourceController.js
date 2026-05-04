import { query } from "../db/index.js";
import { getResourceConfig, resources } from "../config/resources.js";

function buildPayload(body, fields, file = null) {
  const payload = {};
  for (const field of fields) {
    if (field.type === "file") {
      // Se houver arquivo, usa o path. Se não, tenta manter o que veio ou null
      payload[field.name] = file
        ? `/uploads/${file.filename}`
        : body[field.name] || null;
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(body, field.name)) {
      let value = body[field.name];

      // IMPORTANTE: FormData envia tudo como string. Precisamos converter de volta.
      if (value === "" || value === "null" || value === "undefined") {
        value = null;
      }

      if (field.type === "number" && value !== null) {
        value = Number(value);
      }

      payload[field.name] = value;
    }
  }
  return payload;
}

export async function listResourcesMetadata(req, res) {
  res.json(resources);
}

export async function getResourceMeta(req, res) {
  const config = getResourceConfig(req.params.resource);
  if (!config)
    return res.status(404).json({ message: "Recurso não encontrado." });
  res.json(config);
}

export async function listResource(req, res) {
  const { resource } = req.params;
  const current = getResourceConfig(resource);
  if (!current)
    return res.status(404).json({ message: "Recurso não encontrado." });

  const term = req.query.q?.trim();
  if (term) {
    const clauses = current.searchable.map(
      (field, index) => `${field}::text ILIKE $${index + 1}`,
    );
    const params = current.searchable.map(() => `%${term}%`);
    const result = await query(
      `SELECT * FROM ${current.table} WHERE ${clauses.join(" OR ")} ORDER BY ${current.order}`,
      params,
    );
    return res.json(result.rows);
  }

  const result = await query(
    `SELECT * FROM ${current.table} ORDER BY ${current.order}`,
  );
  res.json(result.rows);
}

export async function createResource(req, res) {
  const current = getResourceConfig(req.params.resource);
  if (!current)
    return res.status(404).json({ message: "Recurso não encontrado." });

  const payload = buildPayload(req.body, current.formFields, req.file);
  const fields = Object.keys(payload);

  const missing = current.formFields.filter(
    (f) => f.required && !payload[f.name],
  );
  if (missing.length) {
    return res.status(400).json({
      message: `Campos obrigatórios: ${missing.map((m) => m.label).join(", ")}`,
    });
  }

  const placeholders = fields.map((_, index) => `$${index + 1}`).join(", ");
  const result = await query(
    `INSERT INTO ${current.table} (${fields.join(", ")}) VALUES (${placeholders}) RETURNING *`,
    fields.map((field) => payload[field]),
  );
  res.status(201).json(result.rows[0]);
}

export async function updateResource(req, res) {
  const current = getResourceConfig(req.params.resource);
  if (!current)
    return res.status(404).json({ message: "Recurso não encontrado." });

  // ADICIONADO: req.file aqui para permitir atualização de anexos
  const payload = buildPayload(req.body, current.formFields, req.file);
  const fields = Object.keys(payload);

  if (!fields.length)
    return res
      .status(400)
      .json({ message: "Nenhum campo enviado para atualização." });

  const sets = fields.map((field, index) => `${field} = $${index + 1}`);
  const values = fields.map((field) => payload[field]);
  values.push(req.params.id);

  const result = await query(
    `UPDATE ${current.table} SET ${sets.join(", ")} WHERE ${current.id} = $${fields.length + 1} RETURNING *`,
    values,
  );

  if (!result.rows.length)
    return res.status(404).json({ message: "Registro não encontrado." });
  res.json(result.rows[0]);
}

export async function deleteResource(req, res) {
  const current = getResourceConfig(req.params.resource);
  if (!current)
    return res.status(404).json({ message: "Recurso não encontrado." });

  const result = await query(
    `DELETE FROM ${current.table} WHERE ${current.id} = $1 RETURNING ${current.id}`,
    [req.params.id],
  );
  if (!result.rows.length)
    return res.status(404).json({ message: "Registro não encontrado." });
  res.json({ success: true });
}

export async function getResourceReport(req, res) {
  const current = getResourceConfig(req.params.resource);
  if (!current)
    return res.status(404).json({ message: "Recurso não encontrado." });

  const summaryRows = await query(
    `SELECT ${current.chart.groupBy}::text AS label, COUNT(*)::int AS total FROM ${current.table} GROUP BY ${current.chart.groupBy} ORDER BY total DESC`,
  );
  const totalRows = await query(
    `SELECT COUNT(*)::int AS total FROM ${current.table}`,
  );
  const latestRows = await query(
    `SELECT * FROM ${current.table} ORDER BY ${current.order} LIMIT 10`,
  );

  res.json({
    resource: req.params.resource,
    label: current.label,
    total: totalRows.rows[0].total,
    chart: { ...current.chart, data: summaryRows.rows },
    latest: latestRows.rows,
  });
}

export async function getAuditReport(req, res) {
  const audit = await query("SELECT * FROM audits WHERE id = $1", [
    req.params.id,
  ]);
  if (!audit.rows.length)
    return res.status(404).json({ message: "Auditoria não encontrada." });

  const findings = await query(
    "SELECT * FROM audit_findings WHERE audit_id = $1 ORDER BY id",
    [req.params.id],
  );
  const actions = await query(
    "SELECT * FROM actions WHERE module_name = 'Auditoria' ORDER BY when_date ASC",
  );

  const totals = {
    conformidades: findings.rows.filter(
      (item) => item.finding_type === "Conformidade",
    ).length,
    naoConformidades: findings.rows.filter(
      (item) => item.finding_type === "Não conformidade",
    ).length,
  };

  res.json({
    audit: audit.rows[0],
    totals,
    findings: findings.rows,
    actions: actions.rows,
  });
}
