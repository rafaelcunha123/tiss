const builder = require('xmlbuilder');
const md5 = require('js-md5')
const fs = require('fs')


// -- ELEGIBILIDADE BUILDER --


exports.elegibilidadeVerificaSchema = [{
	ansName: 'ans:cabecalho',
	edocName: 'cabecalho',
	order: 1,
	value: [{
		ansName: 'ans:identificacaoTransacao',
		edocName: 'identificacaoTransacao',
		order: 1,
		value: [{
			ansName: 'ans:tipoTransacao',
			edocName: 'tipoTransacao',
			order: 1,
			value: (validData) => {
				return validData.cabecalho.identificacaoTransacao.tipoTransacao
			}
		}, {
			ansName: 'ans:sequencialTransacao',
			edocName: 'sequencialTransacao',
			order: 2,
			value: (validData) => {
				return validData.cabecalho.identificacaoTransacao.sequencialTransacao
			}
		}, {
			ansName: 'ans:dataRegistroTransacao',
			edocName: 'dataRegistroTransacao',
			order: 3,
			value: (validData) => {
				return validData.cabecalho.identificacaoTransacao.dataRegistroTransacao
			}
		}, {
			ansName: 'ans:horaRegistroTransacao',
			edocName: 'horaRegistroTransacao',
			order: 4,
			value: (validData) => {
				return validData.cabecalho.identificacaoTransacao.horaRegistroTransacao
			}
		}]
	}, {
		ansName: 'ans:origem',
		edocName: 'origem',
		order: 2,
		value: [{
			ansName: 'ans:identificacaoPrestador',
			edocName: 'identificacaoPrestador',
			order: 1,
			value: [{
				ansName: (validData) => {
					if (validData.cabecalho.origem.identificacaoPrestador.CPF) return 'ans:CPF'
					if (validData.cabecalho.origem.identificacaoPrestador.CNPJ) return 'ans:CNPJ'
					return 'ans:codigoPrestadorNaOperadora'
				},
				edocName: (validData) => {
					if (validData.cabecalho.origem.identificacaoPrestador.CPF) return 'CPF'
					if (validData.cabecalho.origem.identificacaoPrestador.CNPJ) return 'CNPJ'
					return 'codigoPrestadorNaOperadora'
				},
				order: 1,
				value: (validData) => {
					if (validData.cabecalho.origem.identificacaoPrestador.CPF) return validData.cabecalho.origem.identificacaoPrestador.CPF
					if (validData.cabecalho.origem.identificacaoPrestador.CNPJ) return validData.cabecalho.origem.identificacaoPrestador.CNPJ
					return validData.cabecalho.origem.identificacaoPrestador.codigoPrestadorNaOperadora
				}

			}]
		}]
	}, {
		ansName: 'ans:destino',
		edocName: 'destino',
		order: 3,
		value: [{
			ansName: 'ans:registroANS',
			edocName: 'registroANS',
			order: 1,
			value: (validData) => {
				return validData.cabecalho.destino.registroANS
			}
		}]
	}, {
		ansName: 'ans:Padrao',
		edocName: 'padrao',
		order: 4,
		value: (validData) =>{
			return validData.cabecalho.padrao
		}
	}, {
		ansName: 'ans:loginSenhaPrestador',
		edocName: 'loginSenhaPrestador',
		order: 5,
		value: [{
			ansName: 'ans:loginPrestador',
			edocName: 'loginPrestador',
			order:1,
			value: (validData)=>{
				return validData.cabecalho.loginSenhaPrestador.loginPrestador
			}
		},{
			ansName: 'ans:senhaPrestador',
			edocName: 'senhaPrestador',
			order:1,
			value: (validData)=>{
				return validData.cabecalho.loginSenhaPrestador.senhaPrestador
			}
		}]
	}]
}, {
	ansName: 'ans:prestadorParaOperadora',
	edocName: 'prestadorParaOperadora',
	order: 2,
	value: [{
		ansName:'ans:verificaElegibilidade',
		edocName:'verificaElegibilidade',
		order:1,
		value: [{
			ansName: 'ans:dadosPrestador',
			edocName: 'dadosPrestador',
			order: 1,
			value: [{
				ansName: (validData)=>{
					if (validData.prestadorParaOperadora.verificaElegibilidade.dadosPrestador.cpfContratado) return 'ans:cpfContratado'
					if (validData.prestadorParaOperadora.verificaElegibilidade.dadosPrestador.cnpjContratado) return 'ans:cnpjContratado'
					return 'ans:codigoPrestadorNaOperadora'
				},
				edocName: (validData) =>{
					if (validData.prestadorParaOperadora.verificaElegibilidade.dadosPrestador.cpfContratado) return 'cpfContratado'
					if (validData.prestadorParaOperadora.verificaElegibilidade.dadosPrestador.cnpjContratado) return 'cnpjContratado'
					return 'codigoPrestadorNaOperadora'
				},
				order:1,
				value: (validData) =>{
					if (validData.prestadorParaOperadora.verificaElegibilidade.dadosPrestador.cpfContratado) return validData.prestadorParaOperadora.verificaElegibilidade.dadosPrestador.cpfContratado
					if (validData.prestadorParaOperadora.verificaElegibilidade.dadosPrestador.cnpjContratado) return validData.prestadorParaOperadora.verificaElegibilidade.dadosPrestador.cnpjContratado
					return validData.prestadorParaOperadora.verificaElegibilidade.dadosPrestador.codigoPrestadorNaOperadora
				}
			},{
				ansName: 'ans:nomeContratado',
				edocName: 'nomeContratado',
				order: 2,
				value: (validData) =>{
					return validData.prestadorParaOperadora.verificaElegibilidade.dadosPrestador.nomeContratado
				}
			}]
		},{
			ansName: 'ans:numeroCarteira',
			edocName: 'numeroCarteira',
			order:2,
			value: (validData)=>{
				return validData.prestadorParaOperadora.verificaElegibilidade.numeroCarteira
			}
		},{
			ansName: 'ans:nomeBeneficiario',
			edocName: 'nomeBeneficiario',
			order:3,
			value: (validData)=>{
				return validData.prestadorParaOperadora.verificaElegibilidade.nomeBeneficiario
			}
		}]

	}]
}]