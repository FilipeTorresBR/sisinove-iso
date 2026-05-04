import { query } from '../db/index.js';

export async function getDashboard(req, res) {
  const [documents, audits, findings, complaints, indicators, actions, risks, processes, purchases] = await Promise.all([
    query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'Aprovado')::int AS approved, COUNT(*) FILTER (WHERE next_review <= CURRENT_DATE + INTERVAL '30 day')::int AS expiring FROM documents`),
    query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'Planejada')::int AS planned, COUNT(*) FILTER (WHERE status = 'Concluída')::int AS finished FROM audits`),
    query(`SELECT COUNT(*) FILTER (WHERE finding_type = 'Conformidade')::int AS conformities, COUNT(*) FILTER (WHERE finding_type = 'Não conformidade')::int AS nonconformities FROM audit_findings`),
    query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status != 'Resolvida')::int AS open FROM complaints`),
    query(`SELECT * FROM indicators ORDER BY id`),
    query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status != 'Concluída')::int AS open FROM actions`),
    query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE score >= 16)::int AS high FROM risks`),
    query(`SELECT COUNT(*)::int AS total FROM processes`),
    query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'Em cotação')::int AS pending FROM purchases`)
  ]);

  res.json({
    cards: {
      processosMapeados: processes.rows[0].total,
      naoConformidadesAbertas: findings.rows[0].nonconformities,
      auditoriasPendentes: audits.rows[0].planned,
      reclamacoesAbertas: complaints.rows[0].open,
      indicadoresTotal: indicators.rows.length,
      planosAcaoEmAndamento: actions.rows[0].open,
      documentosVencendo: documents.rows[0].expiring,
      comprasPendentes: purchases.rows[0].pending,
      riscosAltos: risks.rows[0].high
    },
    charts: {
      findings: [
        { name: 'Conformidades', value: findings.rows[0].conformities },
        { name: 'Não conformidades', value: findings.rows[0].nonconformities }
      ],
      indicators: indicators.rows.map((item) => ({
        name: item.name,
        meta: Number(item.target_value),
        atual: Number(item.current_value)
      })),
      complaintsBySector: (await query(`SELECT sector AS name, COUNT(*)::int AS total FROM complaints GROUP BY sector ORDER BY total DESC`)).rows,
      auditStatus: [
        { name: 'Planejadas', value: audits.rows[0].planned },
        { name: 'Concluídas', value: audits.rows[0].finished }
      ],
      actionsProgress: (await query(`SELECT title AS name, progress::int AS progresso FROM actions ORDER BY progress DESC LIMIT 5`)).rows
    },
    recentAudits: (await query(`SELECT * FROM audits ORDER BY planned_date DESC LIMIT 5`)).rows,
    openActions: (await query(`SELECT id, title, module_name, who_name, when_date, status, progress FROM actions ORDER BY when_date ASC LIMIT 6`)).rows,
    indicatorsTable: indicators.rows
  });
}