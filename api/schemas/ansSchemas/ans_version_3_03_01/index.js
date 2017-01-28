//Key names must be same defined as tipoTransacao for any given route

module.exports = {
	SITUACAO_ELEGIBILIDADE: require('./ans_elegibilidadeVerifica_3_03_01.js').elegibilidadeVerificaSchema,
	SOLICITACAO_PROCEDIMENTOS: require('./ans_solicitacaoProcedimento_3_03_01.js').solicitacaoProcedimento,
	ENVIO_LOTE_GUIAS: require('./ans_loteGuias_3_03_01.js').loteGuiasSchema,
}