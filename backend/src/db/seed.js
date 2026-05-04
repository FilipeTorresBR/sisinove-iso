import bcrypt from 'bcryptjs';
import { query } from './index.js';

export async function seedDatabase() {
  const userCheck = await query('SELECT COUNT(*)::int AS count FROM users');
  if (userCheck.rows[0].count > 0) return;

  const passwordHash = await bcrypt.hash('123456', 10);
  await query(
    'INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4)',
    ['Lorena Corrêa', 'admin@sisinove.com.br', passwordHash, 'ceo']
  );

  await query(`INSERT INTO documents (code, title, sector, version, status, owner_name, next_review) VALUES
  ('POP-001','Procedimento de Matrícula','Comercial','2.0','Aprovado','Coordenação Comercial','2026-07-15'),
  ('IT-004','Instrução de Cobrança','Financeiro','1.3','Em revisão','Supervisão de Cobrança','2026-05-20'),
  ('POL-009','Política da Qualidade Sisinove','Diretoria','3.1','Aprovado','CEO','2026-10-01');`);

  await query(`INSERT INTO suppliers (name, category, score) VALUES
  ('Fornecedor Educacional Norte','Material didático',94),
  ('Tech Labs Pará','Equipamentos',89),
  ('Gráfica Premium Tucuruí','Impressos',91);`);

  await query(`INSERT INTO purchases (request_number, sector, item_description, supplier_id, status, total_amount, requested_by, requested_at) VALUES
  ('SC-2026-001','Pedagógico','Kit laboratório técnico em enfermagem',2,'Aprovado',18500,'Coord. Pedagógica','2026-04-02'),
  ('SC-2026-002','Marketing','Material gráfico campanha matrículas',3,'Em cotação',6200,'Marketing','2026-04-10'),
  ('SC-2026-003','RH','Uniformes equipe administrativa',3,'Recebido',3400,'RH','2026-03-18');`);

  await query(`INSERT INTO indicators (name, sector, unit, target_value, current_value, trend, status, month_label) VALUES
  ('Matrículas novas','Comercial','alunos',180,162,'up','warning','Abr/2026'),
  ('Inadimplência','Financeiro','%',12,9,'down','good','Abr/2026'),
  ('Satisfação do aluno','Ouvidoria','%',90,93,'up','good','Abr/2026'),
  ('Tempo médio de resposta','Atendimento','h',24,31,'down','critical','Abr/2026'),
  ('Taxa de retenção','Pedagógico','%',85,82,'down','warning','Abr/2026');`);

  await query(`INSERT INTO audits (code, audit_type, sector, auditor_name, planned_date, status, summary) VALUES
  ('AUD-INT-001','Interna','Financeiro','Equipe Qualidade','2026-04-08','Concluída','Auditoria focada em cobrança e acordos.'),
  ('AUD-INT-002','Interna','Pedagógico','Equipe Qualidade','2026-04-20','Planejada','Avaliação de evidências, aulas práticas e registros.'),
  ('AUD-EXT-003','Externa','Diretoria','Auditor Certificadora','2026-05-12','Planejada','Primeira supervisão anual.');`);

  await query(`INSERT INTO audit_findings (audit_id, clause_ref, description, finding_type, severity, evidence, responsible_name, due_date) VALUES
  (1,'9.2','Checklist de auditoria corretamente executado.','Conformidade','Baixa','Registros assinados e arquivados.','Qualidade','2026-04-15'),
  (1,'8.4','Avaliação de fornecedor sem atualização nos últimos 12 meses.','Não conformidade','Média','Falta de ficha atualizada.','Compras','2026-04-30'),
  (1,'7.5','Procedimento de cobrança com versão antiga em uso.','Não conformidade','Alta','Documento IT-004 estava em revisão sem bloqueio da versão anterior.','Financeiro','2026-04-25');`);

  await query(`INSERT INTO complaints (protocol, customer_name, channel, category, sector, priority, status, description, solution, opened_at, closed_at) VALUES
  ('REC-001','Aluno 1','WhatsApp','Atendimento','Comercial','Alta','Em andamento','Demora no retorno sobre curso técnico.','Contato refeito e consultor designado.','2026-04-14',NULL),
  ('REC-002','Responsável 2','Telefone','Financeiro','Cobrança','Média','Resolvida','Dúvida sobre boleto em atraso.','Boleto atualizado e acordo formalizado.','2026-04-05','2026-04-06'),
  ('REC-003','Aluno 3','Presencial','Pedagógico','Secretaria','Baixa','Resolvida','Erro no nome do certificado.','Correção emitida e entregue.','2026-03-30','2026-04-01');`);

  await query(`INSERT INTO processes (name, sector, owner_name, objective, risk_level, performance_status) VALUES
  ('Captação e Matrículas','Comercial','Coordenação Comercial','Converter leads em alunos matriculados.','Médio','warning'),
  ('Cobrança e Negociação','Financeiro','Supervisão de Cobrança','Reduzir inadimplência e manter recebimento em dia.','Alto','good'),
  ('Execução Pedagógica','Pedagógico','Coordenação Pedagógica','Garantir aulas, frequência e experiência do aluno.','Médio','warning'),
  ('Franquias e Expansão','Diretoria','CEO','Padronizar a expansão e manter conformidade das unidades.','Alto','good');`);

  await query(`INSERT INTO management_reviews (meeting_date, chairperson, agenda, decisions, status) VALUES
  ('2026-04-11','Lorena Corrêa','Indicadores, auditorias, reclamações e riscos prioritários.','Atualizar POP de cobrança, reforçar SLA de atendimento e revisar fornecedores.','Fechada');`);

  await query(`INSERT INTO actions (title, module_name, what_text, why_text, where_text, when_date, who_name, how_text, how_much, status, progress) VALUES
  ('Atualizar procedimento de cobrança','Auditoria','Revisar e aprovar a nova versão do documento IT-004.','Eliminar uso de versão obsoleta.','Financeiro','2026-04-25','Supervisão de Cobrança','Revisão documental + treinamento da equipe.',800,'Em andamento',65),
  ('Reavaliar fornecedores críticos','Compras','Aplicar nova ficha de avaliação aos fornecedores ativos.','Atender cláusula 8.4 e reduzir risco de compra.','Compras','2026-04-30','Compras','Aplicação de scorecard e homologação.',500,'Em andamento',40),
  ('Reduzir tempo de resposta','Reclamações','Criar rotina diária de retorno ao lead em até 24h.','Melhorar satisfação e conversão.','Atendimento','2026-05-05','Comercial','Redistribuir carteira e usar bot de triagem.',1200,'Planejada',15);`);

  await query(`INSERT INTO risks (title, sector, probability, impact, score, category, mitigation_plan, status) VALUES
  ('Alta inadimplência em períodos sazonais','Financeiro',4,5,20,'Financeiro','Aumentar acompanhamento preventivo e campanhas de renegociação.','Monitorado'),
  ('Queda no tempo de resposta dos leads','Comercial',4,4,16,'Operacional','Automatizar primeira resposta e criar escala de consultores.','Monitorado'),
  ('Uso de documento obsoleto','Qualidade',3,5,15,'Conformidade','Bloquear versões antigas e controlar revisão.','Tratando');`);

  await query(`INSERT INTO opportunities (title, sector, expected_gain, priority, status) VALUES
  ('Dashboard por franquia','Diretoria','Maior padronização e tomada de decisão em rede.','Alta','Em avaliação'),
  ('Pesquisa NPS automática','Ouvidoria','Aumento de dados para satisfação e retenção.','Média','Planejada');`);

  await query(`INSERT INTO changes_log (title, sector, change_type, impact_level, status, description) VALUES
  ('Revisão do fluxo de matrícula','Comercial','Processo','Médio','Aprovada','Nova etapa de validação documental antes da ativação do AVA.'),
  ('Novo modelo de auditoria','Qualidade','Sistema','Alto','Em implantação','Auditoria agora gera plano de ação vinculado automaticamente.');`);
}
