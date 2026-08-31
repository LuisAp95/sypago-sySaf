import type { QuarantineItem } from '@/features/quarantine/components/QuarantineDetailModal';
import type { BlacklistItem } from '@/features/filters/components/BlacklistDetailModal';
import type { RuleDefinitionItem } from '@/features/rules/types/rule.types';
import type { AuditEntry } from '@/features/administration/types/audit.types';
import { AUDIT_ACTION_LABELS, AUDIT_SEVERITY_LABELS } from '@/features/administration/types/audit.types';

const getReasonDescription = (reason: string): string => {
  switch (reason.toLowerCase()) {
    case 'incumplimiento de reglas':
      return 'La operación fue retenida debido a que superó los límites establecidos en las reglas de transacción del canal. Específicamente, se infringió la regla de monto máximo o cantidad de operaciones permitidas.';
    case 'lista negra':
      return 'Se detectó que uno o más atributos de esta transacción coinciden con registros activos en la Lista Negra institucional, por lo que el sistema ha procedido con el bloqueo preventivo.';
    case 'ip sospechosa':
      return 'Se detectó que el registro fue creado desde una dirección IP que ha sido asociada con actividades inusuales y múltiples intentos de acceso no autorizados. Esta IP se encuentra en nuestra lista de monitoreo por comportamiento anómalo.';
    case 'dispositivo nuevo':
      return 'Se ha identificado una transacción desde un dispositivo que no está en el historial de dispositivos de confianza del usuario. Por políticas de seguridad, requiere verificación adicional.';
    default:
      return 'La transacción ha sido enviada a cuarentena tras ser evaluada por el motor de prevención de fraudes. Se requiere revisión manual para confirmar su validez.';
  }
};

const openPdfPrintWindow = (title: string, contentHtml: string) => {
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    alert('Por favor permita las ventanas emergentes para descargar el reporte PDF.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 10mm 12mm;
        }
        html, body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #1e293b;
          background-color: #ffffff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .pdf-wrapper {
          padding: 20px 24px;
        }
        .header-banner {
          background-color: #1a191c;
          color: #ffffff;
          padding: 16px 20px;
          border-left: 6px solid #4f46e5;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0;
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        .header-title {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.5px;
          margin: 0 0 4px 0;
          color: #ffffff;
        }
        .header-subtitle {
          font-size: 11px;
          color: #a1a1aa;
          margin: 0;
        }
        .header-meta {
          text-align: right;
          font-size: 11px;
          color: #e0e7ff;
          line-height: 1.5;
        }
        .header-meta strong {
          color: #818cf8;
        }
        .section-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin-top: 18px;
          margin-bottom: 12px;
          border-bottom: 2px solid #6366f1;
          padding-bottom: 6px;
          page-break-after: avoid;
        }
        .card-box {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 14px 18px;
          margin-bottom: 14px;
          page-break-inside: avoid;
        }
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 14px;
        }
        .info-group {
          display: flex;
          flex-direction: column;
        }
        .info-label {
          font-size: 10px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .info-value {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }
        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
        }
        .badge-critical {
          background-color: #fef2f2;
          color: #dc2626;
          border: 1px solid #f87171;
        }
        .badge-warning {
          background-color: #fefce8;
          color: #a16207;
          border: 1px solid #facc15;
        }
        .badge-active {
          background-color: #f0fdf4;
          color: #166534;
          border: 1px solid #86efac;
        }
        .reason-box {
          background-color: #fff;
          border: 1.5px solid #ef4444;
          border-radius: 8px;
          padding: 14px;
          margin-bottom: 14px;
          page-break-inside: avoid;
        }
        .reason-box.warning {
          border-color: #eab308;
        }
        .reason-title {
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .reason-title.critical { color: #dc2626; }
        .reason-title.warning { color: #a16207; }
        .reason-desc {
          font-size: 12px;
          color: #475569;
          line-height: 1.5;
          margin: 0;
        }
        .footer {
          margin-top: 30px;
          padding-top: 14px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #94a3b8;
          page-break-inside: avoid;
        }
        @media print {
          .no-print {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #ffffff !important;
          }
          .pdf-wrapper {
            padding: 0 !important;
            margin: 0 !important;
          }
          .header-banner {
            margin-top: 0 !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="padding: 12px; background: #eef2ff; text-align: center; border-bottom: 1px solid #c7d2fe;">
        <button onclick="window.print()" style="background: #4f46e5; color: white; border: none; padding: 8px 20px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 14px;">
          Imprimir / Guardar como PDF
        </button>
      </div>
      <div class="pdf-wrapper">
        ${contentHtml}
      </div>
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
};

export const exportQuarantineToPdf = (item: QuarantineItem) => {
  const now = new Date();
  const fechaStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const horaStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const isCritical = item.risk === 'Crítico';

  const amountText = item.amount?.includes('Bs') ? item.amount : `${item.amount} Bs.`;

  const html = `
    <div class="header-banner">
      <div>
        <h1 class="header-title">BANCO EMISOR</h1>
        <p class="header-subtitle">SySAF - Sistema de Prevención y Análisis de Fraude</p>
      </div>
      <div class="header-meta">
        <div><strong>FECHA:</strong> ${fechaStr}</div>
        <div><strong>HORA:</strong> ${horaStr}</div>
        <div><strong>REPORTE:</strong> Cuarentena N° ${item.id}</div>
      </div>
    </div>

    <div class="section-title">REPORTE DETALLADO DE TRANSACCIÓN EN CUARENTENA</div>

    <div class="card-box">
      <div class="grid-2" style="margin-bottom: 16px;">
        <div class="info-group">
          <span class="info-label">ID de Registro</span>
          <span class="info-value">${item.id}</span>
        </div>
        <div class="info-group">
          <span class="info-label">Usuario</span>
          <span class="info-value">${item.user}</span>
        </div>
      </div>
      <div class="grid-2" style="margin-bottom: 16px;">
        <div class="info-group">
          <span class="info-label">Documento de Identidad</span>
          <span class="info-value">${item.document}</span>
        </div>
        <div class="info-group">
          <span class="info-label">Monto de la Operación</span>
          <span class="info-value">${amountText}</span>
        </div>
      </div>
      <div class="info-group">
        <span class="info-label">Nivel de Riesgo</span>
        <div>
          <span class="badge ${isCritical ? 'badge-critical' : 'badge-warning'}">
            ${item.risk}
          </span>
        </div>
      </div>
    </div>

    <div class="reason-box ${isCritical ? '' : 'warning'}">
      <div class="reason-title ${isCritical ? 'critical' : 'warning'}">
        <span>⚠ Motivo del Bloqueo: ${item.reason}</span>
      </div>
      <p class="reason-desc">
        ${getReasonDescription(item.reason)}
      </p>
    </div>

    <div class="section-title">DETALLES TÉCNICOS DE LA OPERACIÓN</div>

    <div class="card-box">
      <div class="grid-2" style="margin-bottom: 16px;">
        <div class="info-group">
          <span class="info-label">Dirección IP</span>
          <span class="info-value">192.168.1.XXX</span>
        </div>
        <div class="info-group">
          <span class="info-label">Ubicación Geográfica</span>
          <span class="info-value">[País/Ciudad]</span>
        </div>
      </div>
      <div class="grid-2">
        <div class="info-group">
          <span class="info-label">Dispositivo</span>
          <span class="info-value">[Tipo de dispositivo]</span>
        </div>
        <div class="info-group">
          <span class="info-label">Tiempo en Espera</span>
          <span class="info-value">${item.waitTime || 'N/A'}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <span>BANCO EMISOR | Reporte confidencial generado por el Sistema SySAF</span>
      <span>Página 1 de 1</span>
    </div>
  `;

  openPdfPrintWindow(`Reporte_Cuarentena_${item.id}`, html);
};

export const exportBlacklistToPdf = (item: BlacklistItem) => {
  const now = new Date();
  const fechaStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const horaStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const isActive = item.status === 'Activo';

  const html = `
    <div class="header-banner">
      <div>
        <h1 class="header-title">BANCO EMISOR</h1>
        <p class="header-subtitle">SySAF - Sistema de Prevención y Análisis de Fraude</p>
      </div>
      <div class="header-meta">
        <div><strong>FECHA:</strong> ${fechaStr}</div>
        <div><strong>HORA:</strong> ${horaStr}</div>
        <div><strong>REPORTE:</strong> Lista Negra N° ${item.id}</div>
      </div>
    </div>

    <div class="section-title">REPORTE DETALLADO DE REGISTRO EN LISTA NEGRA</div>

    <div class="card-box">
      <div class="grid-3" style="margin-bottom: 16px;">
        <div class="info-group">
          <span class="info-label">ID de Regla</span>
          <span class="info-value">${item.id}</span>
        </div>
        <div class="info-group">
          <span class="info-label">Campo / Criterio</span>
          <span class="info-value">${item.field}</span>
        </div>
        <div class="info-group">
          <span class="info-label">Valor Restringido</span>
          <span class="info-value" style="font-family: monospace;">${item.value}</span>
        </div>
      </div>
      <div class="grid-2">
        <div class="info-group">
          <span class="info-label">Acción a Tomar</span>
          <div>
            <span class="badge badge-critical">${item.action}</span>
          </div>
        </div>
        <div class="info-group">
          <span class="info-label">Estado de la Regla</span>
          <div>
            <span class="badge ${isActive ? 'badge-active' : ''}">${item.status}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="section-title">DETALLES DE AUDITORÍA Y MONITOREO</div>

    <div class="card-box">
      <div class="grid-2">
        <div class="info-group">
          <span class="info-label">Última Modificación</span>
          <span class="info-value">${item.lastModified || 'N/A'}</span>
        </div>
        <div class="info-group">
          <span class="info-label">Eventos Registrados</span>
          <span class="info-value">${item.eventsRegistered} intervenciones</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <span>BANCO EMISOR | Reporte confidencial generado por el Sistema SySAF</span>
      <span>Página 1 de 1</span>
    </div>
  `;

  openPdfPrintWindow(`Reporte_ListaNegra_${item.id}`, html);
};

export const exportRulesToPdf = (rules: RuleDefinitionItem[], reportTitle: string = 'Reporte de Definición de Reglas Antifraude') => {
  const now = new Date();
  const fechaStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const horaStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  const totalRules = rules.length;
  const rulesWithSubRules = rules.filter(r => r.subRules && r.subRules.length > 0).length;

  const rulesTableRows = rules.map((r, index) => {
    const code = r.code || String(index + 1).padStart(3, '0');
    const name = r.name || r.title || 'Regla sin nombre';
    const channel = r.channel || 'Todos los canales';
    const opsMax = r.ops?.max ?? 'N/A';
    const amountMax = r.amount?.max ? r.amount.max.replace(/(\d)(Millo|Mil)/ig, '$1 $2') : 'N/A';

    let subRulesHtml = '';
    if (r.subRules && r.subRules.length > 0) {
      const subRows = r.subRules.map(sr => `
        <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
          <td style="padding: 6px 10px; font-weight: 600;">${sr.startTime} - ${sr.endTime}</td>
          <td style="padding: 6px 10px;">${sr.opsPerMinute} Opm</td>
          <td style="padding: 6px 10px;">${sr.maxAmount}</td>
          <td style="padding: 6px 10px;">
            <span class="badge ${sr.enabled ? 'badge-active' : ''}">${sr.enabled ? 'Activo' : 'Inactivo'}</span>
          </td>
        </tr>
      `).join('');

      subRulesHtml = `
        <div style="margin-top: 10px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden;">
          <div style="padding: 6px 10px; background-color: #f1f5f9; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase;">
            Franjas Horarias Personalizadas
          </div>
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="background-color: #f8fafc; font-size: 10px; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #cbd5e1;">
                <th style="padding: 6px 10px;">Horario (Inicio - Fin)</th>
                <th style="padding: 6px 10px;">Operaciones Max</th>
                <th style="padding: 6px 10px;">Monto Máximo</th>
                <th style="padding: 6px 10px;">Estado</th>
              </tr>
            </thead>
            <tbody>
              ${subRows}
            </tbody>
          </table>
        </div>
      `;
    } else {
      subRulesHtml = `
        <div style="margin-top: 6px; font-size: 11px; color: #64748b; font-style: italic;">
          Sin franjas horarias personalizadas asignadas (Mantener configuración por defecto).
        </div>
      `;
    }

    return `
      <div class="card-box" style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 12px;">
          <div>
            <span style="background-color: #4f46e5; color: #ffffff; font-weight: 700; font-size: 11px; padding: 3px 8px; border-radius: 4px; margin-right: 8px;">
              CÓDIGO: ${code}
            </span>
            <span style="font-size: 15px; font-weight: 700; color: #0f172a;">
              ${name}
            </span>
          </div>
          <span class="badge" style="background-color: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe;">
            ${channel}
          </span>
        </div>

        <div class="grid-2" style="margin-bottom: 8px;">
          <div class="info-group">
            <span class="info-label">Operaciones Máximas Globales</span>
            <span class="info-value">${opsMax} Opm</span>
          </div>
          <div class="info-group">
            <span class="info-label">Monto Máximo Global</span>
            <span class="info-value">${amountMax}</span>
          </div>
        </div>

        ${subRulesHtml}
      </div>
    `;
  }).join('');

  const html = `
    <div class="header-banner">
      <div>
        <h1 class="header-title">BANCO EMISOR</h1>
        <p class="header-subtitle">SySAF - Sistema de Prevención y Análisis de Fraude</p>
      </div>
      <div class="header-meta">
        <div><strong>FECHA:</strong> ${fechaStr}</div>
        <div><strong>HORA:</strong> ${horaStr}</div>
        <div><strong>REPORTE:</strong> ${reportTitle}</div>
      </div>
    </div>

    <div class="section-title">RESUMEN GENERAL DE REGLAS CONFIGURADAS</div>

    <div class="card-box" style="margin-bottom: 20px;">
      <div class="grid-3">
        <div class="info-group">
          <span class="info-label">Total de Reglas</span>
          <span class="info-value" style="font-size: 18px; color: #4f46e5;">${totalRules}</span>
        </div>
        <div class="info-group">
          <span class="info-label">Con Franjas Horarias</span>
          <span class="info-value" style="font-size: 18px; color: #059669;">${rulesWithSubRules}</span>
        </div>
        <div class="info-group">
          <span class="info-label">Estado del Sistema</span>
          <span class="info-value" style="font-size: 14px; color: #166534;">OPERATIVO / ACTIVO</span>
        </div>
      </div>
    </div>

    <div class="section-title">DETALLE DE REGLAS DE TRANSACCIÓN Y LÍMITES</div>

    ${rulesTableRows}

    <div class="footer">
      <span>BANCO EMISOR | Reporte confidencial generado por el Sistema SySAF</span>
      <span>Página 1 de 1</span>
    </div>
  `;

  openPdfPrintWindow(`Reporte_Reglas_${now.getTime()}`, html);
};

export const exportSingleRuleToPdf = (rule: RuleDefinitionItem) => {
  const name = rule.name || rule.title || rule.id;
  exportRulesToPdf([rule], `Definición de Regla - ${name}`);
};

export const exportChannelRulesToPdf = (channels: any[]) => {
  const now = new Date();
  const fechaStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const horaStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  const rowsHtml = channels.map((c) => `
    <tr style="border-bottom: 1px solid #e2e8f0; font-size: 12px;">
      <td style="padding: 10px; font-weight: 700;">${c.channel || c.name || 'N/A'}</td>
      <td style="padding: 10px;">${c.userType || c.type || 'Todos'}</td>
      <td style="padding: 10px;">${c.opsLimit || c.opsMax || 'N/A'} Opm</td>
      <td style="padding: 10px;">${c.maxAmount || c.amountMax || 'N/A'}</td>
      <td style="padding: 10px;">
        <span class="badge ${c.status === 'Inactivo' ? 'badge-critical' : 'badge-active'}">
          ${c.status || 'Activo'}
        </span>
      </td>
    </tr>
  `).join('');

  const html = `
    <div class="header-banner">
      <div>
        <h1 class="header-title">BANCO EMISOR</h1>
        <p class="header-subtitle">SySAF - Sistema de Prevención y Análisis de Fraude</p>
      </div>
      <div class="header-meta">
        <div><strong>FECHA:</strong> ${fechaStr}</div>
        <div><strong>HORA:</strong> ${horaStr}</div>
        <div><strong>REPORTE:</strong> Reglas por Canal</div>
      </div>
    </div>

    <div class="section-title">CONFIGURACIÓN DE REGLAS POR CANAL</div>

    <div class="card-box">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="background-color: #f1f5f9; font-size: 11px; color: #475569; text-transform: uppercase; border-bottom: 2px solid #cbd5e1;">
            <th style="padding: 10px;">Canal</th>
            <th style="padding: 10px;">Tipo de Persona</th>
            <th style="padding: 10px;">Límite Operaciones</th>
            <th style="padding: 10px;">Monto Máximo</th>
            <th style="padding: 10px;">Estado</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>

    <div class="footer">
      <span>BANCO EMISOR | Reporte confidencial generado por el Sistema SySAF</span>
      <span>Página 1 de 1</span>
    </div>
  `;

  openPdfPrintWindow(`Reporte_ReglasCanal_${now.getTime()}`, html);
};

export const exportUserExceptionsToPdf = (exceptions: any[]) => {
  const now = new Date();
  const fechaStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const horaStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  const rowsHtml = exceptions.map((e) => `
    <tr style="border-bottom: 1px solid #e2e8f0; font-size: 12px;">
      <td style="padding: 10px; font-weight: 700;">${e.document || 'N/A'}</td>
      <td style="padding: 10px;">${e.alias || 'N/A'}</td>
      <td style="padding: 10px;">${e.reason || 'N/A'}</td>
      <td style="padding: 10px;">${e.startDate || 'N/A'} - ${e.endDate || 'N/A'}</td>
      <td style="padding: 10px;">
        <span class="badge ${e.status === 'Inactivo' ? 'badge-critical' : 'badge-active'}">
          ${e.status || 'Activo'}
        </span>
      </td>
    </tr>
  `).join('');

  const html = `
    <div class="header-banner">
      <div>
        <h1 class="header-title">BANCO EMISOR</h1>
        <p class="header-subtitle">SySAF - Sistema de Prevención y Análisis de Fraude</p>
      </div>
      <div class="header-meta">
        <div><strong>FECHA:</strong> ${fechaStr}</div>
        <div><strong>HORA:</strong> ${horaStr}</div>
        <div><strong>REPORTE:</strong> Excepciones de Usuario</div>
      </div>
    </div>

    <div class="section-title">LISTADO DE EXCEPCIONES DE USUARIOS CONFIGURADAS</div>

    <div class="card-box">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="background-color: #f1f5f9; font-size: 11px; color: #475569; text-transform: uppercase; border-bottom: 2px solid #cbd5e1;">
            <th style="padding: 10px;">Documento</th>
            <th style="padding: 10px;">Alias / Usuario</th>
            <th style="padding: 10px;">Motivo</th>
            <th style="padding: 10px;">Vigencia (Inicio - Fin)</th>
            <th style="padding: 10px;">Estado</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>

    <div class="footer">
      <span>BANCO EMISOR | Reporte confidencial generado por el Sistema SySAF</span>
      <span>Página 1 de 1</span>
    </div>
  `;

  openPdfPrintWindow(`Reporte_ExcepcionesUsuario_${now.getTime()}`, html);
};

export const exportAuditDetailToPdf = (entry: AuditEntry) => {
  const now = new Date();
  const fechaStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const horaStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  const formatIsoDate = (iso: string): string => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
      `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ` +
      `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    );
  };

  const formatJsonStr = (raw: string | undefined): string => {
    if (!raw) return '—';
    try {
      return JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      return raw;
    }
  };

  const isCritical = entry.severity === 'critical';
  const isWarning = entry.severity === 'warning';
  const badgeClass = isCritical ? 'badge-critical' : isWarning ? 'badge-warning' : 'badge-active';

  const actionLabel = AUDIT_ACTION_LABELS[entry.action] || entry.action;
  const severityLabel = AUDIT_SEVERITY_LABELS[entry.severity] || entry.severity;

  const hasDiff = entry.previousValue || entry.newValue;

  const html = `
    <div class="header-banner">
      <div>
        <h1 class="header-title">BANCO EMISOR</h1>
        <p class="header-subtitle">SySAF - Sistema de Prevención y Análisis de Fraude</p>
      </div>
      <div class="header-meta">
        <div><strong>FECHA:</strong> ${fechaStr}</div>
        <div><strong>HORA:</strong> ${horaStr}</div>
        <div><strong>REPORTE:</strong> Evento Auditoría N° ${entry.id}</div>
      </div>
    </div>

    <div class="section-title">REPORTE DETALLADO DE EVENTO DE AUDITORÍA</div>

    <div class="card-box">
      <div class="grid-3" style="margin-bottom: 16px;">
        <div class="info-group">
          <span class="info-label">ID Registro</span>
          <span class="info-value" style="font-family: monospace;">${entry.id}</span>
        </div>
        <div class="info-group">
          <span class="info-label">Fecha / Hora Evento</span>
          <span class="info-value">${formatIsoDate(entry.timestamp)}</span>
        </div>
        <div class="info-group">
          <span class="info-label">Severidad</span>
          <div>
            <span class="badge ${badgeClass}">${severityLabel}</span>
          </div>
        </div>
      </div>

      <div class="grid-3" style="margin-bottom: 16px;">
        <div class="info-group">
          <span class="info-label">Usuario</span>
          <span class="info-value">${entry.userName} (${entry.userId})</span>
        </div>
        <div class="info-group">
          <span class="info-label">Dirección IP</span>
          <span class="info-value" style="font-family: monospace; color: #0d9488;">${entry.userIp}</span>
        </div>
        <div class="info-group">
          <span class="info-label">Session ID</span>
          <span class="info-value" style="font-family: monospace; font-size: 11px;">${entry.sessionId}</span>
        </div>
      </div>

      <div class="grid-3">
        <div class="info-group">
          <span class="info-label">Módulo</span>
          <span class="info-value">${entry.module}</span>
        </div>
        <div class="info-group">
          <span class="info-label">Acción</span>
          <span class="info-value">${actionLabel}</span>
        </div>
        <div class="info-group">
          <span class="info-label">Tipo de Entidad</span>
          <span class="info-value">${entry.entityType}</span>
        </div>
      </div>
    </div>

    <div class="card-box">
      <div class="grid-2" style="margin-bottom: 12px;">
        <div class="info-group">
          <span class="info-label">ID Entidad</span>
          <span class="info-value" style="font-family: monospace;">${entry.entityId}</span>
        </div>
        <div class="info-group">
          <span class="info-label">Nombre Entidad</span>
          <span class="info-value">${entry.entityName}</span>
        </div>
      </div>
      <div class="info-group">
        <span class="info-label">Detalles de la Operación</span>
        <span class="info-value" style="font-weight: 500; font-size: 12px; color: #334155;">${entry.details}</span>
      </div>
    </div>

    <div class="section-title">INFORMACIÓN TÉCNICA DEL NAVEGADOR (USER AGENT)</div>
    <div class="card-box">
      <p style="font-family: monospace; font-size: 11px; color: #64748b; margin: 0; word-break: break-all; line-height: 1.5;">
        ${entry.userAgent}
      </p>
    </div>

    ${hasDiff ? `
      <div class="section-title">CAMBIOS EN VALORES REGISTRADOS</div>
      <div class="card-box">
        <div class="grid-2">
          ${entry.previousValue ? `
            <div style="background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 6px; padding: 10px;">
              <div style="font-size: 10px; font-weight: 700; color: #dc2626; text-transform: uppercase; margin-bottom: 6px;">Valor Anterior</div>
              <pre style="font-family: monospace; font-size: 11px; color: #991b1b; white-space: pre-wrap; word-break: break-all; margin: 0;">${formatJsonStr(entry.previousValue)}</pre>
            </div>
          ` : ''}
          ${entry.newValue ? `
            <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 10px;">
              <div style="font-size: 10px; font-weight: 700; color: #166534; text-transform: uppercase; margin-bottom: 6px;">Valor Nuevo</div>
              <pre style="font-family: monospace; font-size: 11px; color: #14532d; white-space: pre-wrap; word-break: break-all; margin: 0;">${formatJsonStr(entry.newValue)}</pre>
            </div>
          ` : ''}
        </div>
      </div>
    ` : ''}

    <div class="footer">
      <span>BANCO EMISOR | Reporte confidencial generado por el Sistema SySAF</span>
      <span>Página 1 de 1</span>
    </div>
  `;

  openPdfPrintWindow(`Reporte_Auditoria_${entry.id}`, html);
};


