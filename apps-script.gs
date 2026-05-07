// SAFE Hub — Apps Script
// Cole este código no Apps Script da planilha e faça o deploy como Web App

const SHEET_NAME = 'Usuários';

function doPost(e) {
  const res = ContentService.createTextOutput();
  res.setMimeType(ContentService.MimeType.JSON);

  try {
    const data = JSON.parse(e.postData.contents);
    const { action } = data;

    if (action === 'changePassword') {
      const result = changePassword(data.email, data.novaSenha);
      res.setContent(JSON.stringify(result));
    } else {
      res.setContent(JSON.stringify({ ok: false, msg: 'Ação desconhecida.' }));
    }
  } catch (err) {
    res.setContent(JSON.stringify({ ok: false, msg: 'Erro interno: ' + err.message }));
  }

  return res;
}

function doGet(e) {
  // Permite testar via browser
  return ContentService.createTextOutput(JSON.stringify({ ok: true, msg: 'SAFE Hub API online.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function changePassword(email, novaSenha) {
  if (!email || !novaSenha) return { ok: false, msg: 'Dados incompletos.' };
  if (novaSenha.length < 6) return { ok: false, msg: 'A senha deve ter pelo menos 6 caracteres.' };

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  // Linha 0 = cabeçalho, começa em 1
  for (let i = 1; i < data.length; i++) {
    if ((data[i][0] || '').toString().trim().toLowerCase() === email.toLowerCase()) {
      // Coluna B (índice 1) = senha
      sheet.getRange(i + 1, 2).setValue(novaSenha);
      return { ok: true, msg: 'Senha atualizada com sucesso.' };
    }
  }

  return { ok: false, msg: 'Usuário não encontrado.' };
}
