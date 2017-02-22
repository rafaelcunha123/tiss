const builder = require('xmlbuilder');
const md5 = require('js-md5')
const fs = require('fs')

const guiaConsultaSchema = [{
	ansName: 'ans:guiaConsulta',
	edocName: 'guiaConsulta',
	order: 1,
	value: [{
		ansName: 'ans:cabecalhoConsulta',
		edocName: 'cabecalhoConsulta',
		order: 1,
		value: [{
			ansName: 'ans:registroANS',
			edocName: 'registroANS',
			order: 1,
			value: validData => validData.guiaConsulta.cabecalhoConsulta.registroANS
		}, {
			ansName: 'ans:numeroGuiaPrestador',
			edocName: 'numeroGuiaPrestador',
			order: 2,
			value: validData => validData.guiaConsulta.cabecalhoConsulta.numeroGuiaPrestador
		}]
	}, {
		ansName: 'ans:numeroGuiaOperadora',
		edocName: 'numeroGuiaOperadora',
		order: 2,
		value: validData => validData.guiaConsulta.numeroGuiaOperadora
	}, {
		ansName: 'ans:dadosBeneficiario',
		edocName: 'dadosBeneficiario',
		order: 3,
		value: [{
			ansName: 'ans:numeroCarteira',
			edocName: 'numeroCarteira',
			order: 1,
			value: validData => validData.guiaConsulta.dadosBeneficiario.numeroCarteira

		}, {
			ansName: 'ans:atendimentoRN',
			edocName: 'atendimentoRN',
			order: 2,
			value: validData => validData.guiaConsulta.dadosBeneficiario.atendimentoRN
		}, {
			ansName: 'ans:nomeBeneficiario',
			edocName: 'nomeBeneficiario',
			order: 3,
			value: validData => validData.guiaConsulta.dadosBeneficiario.nomeBeneficiario
		}, {
			ansName: 'ans:numeroCNS',
			edocName: 'numeroCNS',
			order: 4,
			include: validData => validData.guiaConsulta.dadosBeneficiario.numeroCNS? 'include' : 'exclude',
			value: validData => validData.guiaConsulta.dadosBeneficiario.numeroCNS
		}]
	}, {
		ansName: 'ans:contratadoExecutante',
		edocName: 'guiaConsulta',
		order: 4,
		value: [{
			ansName: (validData) => {
				if (validData.guiaConsulta.contratadoExecutante.cpfContratado) return 'ans:cpfContratado'
				if (validData.guiaConsulta.contratadoExecutante.cnpjContratado) return 'ans:cnpjContratado'
				return 'ans:codigoPrestadorNaOperadora'
			},
			edocName: (validData) => {
				if (validData.guiaConsulta.contratadoExecutante.cpfContratado) return 'cpfContratado'
				if (validData.guiaConsulta.contratadoExecutante.cnpjContratado) return 'cnpjContratado'
				return 'codigoPrestadorNaOperadora'
			},
			order: 1,
			value: (validData) => {
				if (validData.guiaConsulta.contratadoExecutante.cpfContratado) return validData.guiaConsulta.contratadoExecutante.cpfContratado
				if (validData.guiaConsulta.contratadoExecutante.cnpjContratado) return validData.guiaConsulta.contratadoExecutante.cnpjContratado
				return validData.guiaConsulta.contratadoExecutante.codigoPrestadorNaOperadora
			}
		}, {
			ansName: 'ans:nomeContratado',
			edocName: 'nomeContratado',
			order: 2,
			value: validData => validData.guiaConsulta.contratadoExecutante.nomeContratado
		}, {
			ansName: 'ans:CNES',
			edocName: 'CNES',
			order: 3,
			value: validData => validData.guiaConsulta.contratadoExecutante.CNES
		}]
	}, {
		ansName: 'ans:profissionalExecutante',
		edocName: 'profissionalExecutante',
		order: 5,
		value: [{
			ansName: 'ans:nomeProfissional',
			edocName: 'nomeProfissional',
			order: 1,
			value: validData => validData.guiaConsulta.profissionalExecutante.nomeProfissional
		}, {
			ansName: 'ans:conselhoProfissional',
			edocName: 'conselhoProfissional',
			order: 2,
			value: validData => validData.guiaConsulta.profissionalExecutante.conselhoProfissional
		}, {
			ansName: 'ans:numeroConselhoProfissional',
			edocName: 'numeroConselhoProfissional',
			order: 3,
			value: validData => validData.guiaConsulta.profissionalExecutante.numeroConselhoProfissional
		}, {
			ansName: 'ans:UF',
			edocName: 'UF',
			order: 4,
			value: validData => validData.guiaConsulta.profissionalExecutante.UF
		}, {
			ansName: 'ans:CBOS',
			edocName: 'CBOS',
			order: 5,
			value: validData => validData.guiaConsulta.profissionalExecutante.CBOS
		}]
	}, {
		ansName: 'ans:indicacaoAcidente',
		edocName: 'indicacaoAcidente',
		order: 6,
		value: validData => validData.guiaConsulta.indicacaoAcidente
	}, {
		ansName: 'ans:dadosAtendimento',
		edocName: 'dadosAtendimento',
		order: 7,
		value: [{
			ansName: 'ans:dataAtendimento',
			edocName: 'dataAtendimento',
			order: 1,
			value: validData => validData.guiaConsulta.dadosAtendimento.dataAtendimento
		}, {
			ansName: 'ans:tipoConsulta',
			edocName: 'tipoConsulta',
			order: 2,
			value: validData => validData.guiaConsulta.dadosAtendimento.tipoConsulta
		}, {
			ansName: 'ans:procedimento',
			edocName: 'procedimento',
			order: 3,
			value: [{
				ansName: 'ans:codigoTabela',
				edocName: 'codigoTabela',
				order: 1,
				value: validData => validData.guiaConsulta.dadosAtendimento.procedimento.codigoTabela
			}, {
				ansName: 'ans:codigoProcedimento',
				edocName: 'codigoProcedimento',
				order: 2,
				value: validData => validData.guiaConsulta.dadosAtendimento.procedimento.codigoProcedimento
			}, {
				ansName: 'ans:valorProcedimento',
				edocName: 'valorProcedimento',
				order: 3,
				value: validData => validData.guiaConsulta.dadosAtendimento.procedimento.valorProcedimento
			}]
		}]
	}, {
		ansName: 'ans:observacao',
		edocName: 'observacao',
		order: 8,
		include: validData => validData.guiaConsulta.observacao? 'include' : 'exclude',
		value: validData => validData.guiaConsulta.observacao
	}],
}]

module.exports = {
	guiaConsulta: guiaConsultaSchema,
}