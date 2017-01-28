const builder = require('xmlbuilder');
const md5 = require('js-md5')
const fs = require('fs')


// -- ELEGIBILIDADE BUILDER --


exports.solicitacaoProcedimento = [{
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
				value: validData => validData.cabecalho.identificacaoTransacao.tipoTransacao
			}, {
				ansName: 'ans:sequencialTransacao',
				edocName: 'sequencialTransacao',
				order: 2,
				value: validData => validData.cabecalho.identificacaoTransacao.sequencialTransacao
			}, {
				ansName: 'ans:dataRegistroTransacao',
				edocName: 'dataRegistroTransacao',
				order: 3,
				value: validData => validData.cabecalho.identificacaoTransacao.dataRegistroTransacao
			}, {
				ansName: 'ans:horaRegistroTransacao',
				edocName: 'horaRegistroTransacao',
				order: 4,
				value: validData => validData.cabecalho.identificacaoTransacao.horaRegistroTransacao
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
				value: validData => validData.cabecalho.destino.registroANS
			}]
		}, {
			ansName: 'ans:Padrao',
			edocName: 'padrao',
			order: 4,
			value: validData => validData.cabecalho.padrao
		}, {
			ansName: 'ans:loginSenhaPrestador',
			edocName: 'loginSenhaPrestador',
			order: 5,
			value: [{
				ansName: 'ans:loginPrestador',
				edocName: 'loginPrestador',
				order: 1,
				value: validData => validData.cabecalho.loginSenhaPrestador.loginPrestador
			}, {
				ansName: 'ans:senhaPrestador',
				edocName: 'senhaPrestador',
				order: 1,
				value: validData => validData.cabecalho.loginSenhaPrestador.senhaPrestador
			}]
		}]
	}, {
		ansName: 'ans:prestadorParaOperadora',
		edocName: 'prestadorParaOperadora',
		order: 2,
		value: [{
			ansName: 'ans:solicitacaoProcedimento',
			edocName: 'solicitacaoProcedimento',
			order: 1,
			value: [{
				ansName: 'ans:solicitacaoSP-SADT',
				edocName: 'solicitacaoSPSADT',
				order: 1,
				value: [{
					ansName: 'ans:cabecalhoSolicitacao',
					edocName: 'cabecalhoSolicitacao',
					order: 1,
					value: [{
						ansName: 'ans:registroANS',
						edocName: 'registroANS',
						order: 1,
						value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.cabecalhoSolicitacao.registroANS
					}, {
						ansName: 'ans:numeroGuiaPrestador',
						edocName: 'numeroGuiaPrestador',
						order: 2,
						value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.cabecalhoSolicitacao.numeroGuiaPrestador
					}]
				}, {
					ansName: 'ans:dadosBeneficiario',
					edocName: 'dadosBeneficiario',
					order: 2,
					value: [{
						ansName: 'ans:numeroCarteira',
						edocName: 'numeroCarteira',
						order: 1,
						value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosBeneficiario.numeroCarteira
					}, {
						ansName: 'ans:atendimentoRN',
						edocName: 'atendimentoRN',
						order: 2,
						value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosBeneficiario.atendimentoRN
					}, {
						ansName: 'ans:nomeBeneficiario',
						edocName: 'nomeBeneficiario',
						order: 3,
						value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosBeneficiario.nomeBeneficiario
					}, {
						ansName: 'ans:numeroCNS',
						edocName: 'numeroCNS',
						order: 4,
						include: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosBeneficiario.numeroCNS ? 'include' : 'exclude',
						value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosBeneficiario.numeroCNS
					}, {
						ansName: 'ans:identificadorBeneficiario',
						edocName: 'identificadorBeneficiario',
						order: 4,
						include: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosBeneficiario.identificadorBeneficiario ? 'include': 'exclude',
						value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosBeneficiario.identificadorBeneficiario
					}]
				}, {
					ansName: 'ans:dadosSolicitante',
					edocName: 'dadosSolicitante',
					order: 3,
					value: [{
						ansName: 'ans:contratadoSolicitante',
						edocName: 'contratadoSolicitante',
						order: 1,
						value: [{
							ansName: (validData) => {
								if (validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosSolicitante.contratadoSolicitante.cpfContratado) return 'ans:cpfContratado'
								if (validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosSolicitante.contratadoSolicitante.cnpjContratado) return 'ans:cnpjContratado'
								return 'ans:codigoPrestadorNaOperadora'
							},
							edocName: (validData) => {
								if (validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosSolicitante.contratadoSolicitante.cpfContratado) return 'cpfContratado'
								if (validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosSolicitante.contratadoSolicitante.cnpjContratado) return 'cnpjContratado'
								return 'codigoPrestadorNaOperadora'
							},
							order: 1,
							value: (validData) => {
								if (validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosSolicitante.contratadoSolicitante.cpfContratado) return validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosSolicitante.contratadoSolicitante.cpfContratado
								if (validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosSolicitante.contratadoSolicitante.cnpjContratado) return validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosSolicitante.contratadoSolicitante.cnpjContratado
								return validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosSolicitante.contratadoSolicitante.codigoPrestadorNaOperadora
							}
						}, {
							ansName: 'ans:nomeContratado',
							edocName: 'nomeContratado',
							order: 2,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosSolicitante.contratadoSolicitante.nomeContratado

						}]
					}, {
						ansName: 'ans:profissionalSolicitante',
						edocName: 'profissionalSolicitante',
						order: 2,
						value: [{
							ansName: 'ans:nomeProfissional',
							edocName: 'nomeProfissional',
							order: 1,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosSolicitante.profissionalSolicitante.nomeProfissional
						}, {
							ansName: 'ans:conselhoProfissional',
							edocName: 'conselhoProfissional',
							order: 1,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosSolicitante.profissionalSolicitante.conselhoProfissional
						}, {
							ansName: 'ans:numeroConselhoProfissional',
							edocName: 'numeroConselhoProfissional',
							order: 1,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosSolicitante.profissionalSolicitante.numeroConselhoProfissional
						}, {
							ansName: 'ans:UF',
							edocName: 'UF',
							order: 1,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosSolicitante.profissionalSolicitante.UF
						}, {
							ansName: 'ans:CBOS',
							edocName: 'CBOS',
							order: 1,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosSolicitante.profissionalSolicitante.CBOS
						}]
					}]
				}, {
					ansName: 'ans:caraterAtendimento',
					edocName: 'caraterAtendimento',
					order: 4,
					value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.caraterAtendimento
				}, {
					ansName: 'ans:dataSolicitacao',
					edocName: 'dataSolicitacao',
					order: 5,
					value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dataSolicitacao
				}, {
					ansName: 'ans:indicacaoClinica',
					edocName: 'indicacaoClinica',
					order: 6,
					include: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.indicacaoClinica ? 'include' : 'exclude',
					value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.indicacaoClinica
				}, {
					ansName: 'ans:procedimentosSolicitados',
					edocName: 'procedimentosSolicitados',
					order: 7,
					include: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[0] ? 'include' : 'exclude',
					value: [{
						ansName: 'ans:procedimento',
						edocName: 'procedimento',
						order: 1,
						value: [{
							ansName: 'ans:codigoTabela',
							edocName: 'codigoTabela',
							order: 1,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[0].procedimento.codigoTabela
						}, {
							ansName: 'ans:codigoProcedimento',
							edocName: 'codigoProcedimento',
							order: 2,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[0].procedimento.codigoProcedimento
						}, {
							ansName: 'ans:descricaoProcedimento',
							edocName: 'descricaoProcedimento',
							order: 3,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[0].procedimento.descricaoProcedimento
						}]
					}, {
						ansName: 'ans:quantidadeSolicitada',
						edocName: 'quantidadeSolicitada',
						order: 2,
						value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[0].quantidadeSolicitada
					}]
				}, {
					ansName: 'ans:procedimentosSolicitados',
					edocName: 'procedimentosSolicitados',
					order: 8,
					include: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[1] ? 'include' : 'exclude',
					value: [{
						ansName: 'ans:procedimento',
						edocName: 'procedimento',
						order: 1,
						value: [{
							ansName: 'ans:codigoTabela',
							edocName: 'codigoTabela',
							order: 1,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[1].procedimento.codigoTabela
						}, {
							ansName: 'ans:codigoProcedimento',
							edocName: 'codigoProcedimento',
							order: 2,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[1].procedimento.codigoProcedimento
						}, {
							ansName: 'ans:descricaoProcedimento',
							edocName: 'descricaoProcedimento',
							order: 3,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[1].procedimento.descricaoProcedimento
						}]
					}, {
						ansName: 'ans:quantidadeSolicitada',
						edocName: 'quantidadeSolicitada',
						order: 2,
						value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[1].quantidadeSolicitada
					}]
				}, {
					ansName: 'ans:procedimentosSolicitados',
					edocName: 'procedimentosSolicitados',
					order: 9,
					include: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[2] ? 'include' : 'exclude',
					value: [{
						ansName: 'ans:procedimento',
						edocName: 'procedimento',
						order: 1,
						value: [{
							ansName: 'ans:codigoTabela',
							edocName: 'codigoTabela',
							order: 1,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[2].procedimento.codigoTabela
						}, {
							ansName: 'ans:codigoProcedimento',
							edocName: 'codigoProcedimento',
							order: 2,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[2].procedimento.codigoProcedimento
						}, {
							ansName: 'ans:descricaoProcedimento',
							edocName: 'descricaoProcedimento',
							order: 3,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[2].procedimento.descricaoProcedimento
						}]
					}, {
						ansName: 'ans:quantidadeSolicitada',
						edocName: 'quantidadeSolicitada',
						order: 2,
						value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[2].quantidadeSolicitada
					}]
				}, {
					ansName: 'ans:procedimentosSolicitados',
					edocName: 'procedimentosSolicitados',
					order: 10,
					include: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[3] ? 'include' : 'exclude',
					value: [{
						ansName: 'ans:procedimento',
						edocName: 'procedimento',
						order: 1,
						value: [{
							ansName: 'ans:codigoTabela',
							edocName: 'codigoTabela',
							order: 1,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[3].procedimento.codigoTabela
						}, {
							ansName: 'ans:codigoProcedimento',
							edocName: 'codigoProcedimento',
							order: 2,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[3].procedimento.codigoProcedimento
						}, {
							ansName: 'ans:descricaoProcedimento',
							edocName: 'descricaoProcedimento',
							order: 3,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[3].procedimento.descricaoProcedimento
						}]
					}, {
						ansName: 'ans:quantidadeSolicitada',
						edocName: 'quantidadeSolicitada',
						order: 2,
						value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[3].quantidadeSolicitada
					}]
				}, {
					ansName: 'ans:procedimentosSolicitados',
					edocName: 'procedimentosSolicitados',
					order: 11,
					include: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[4] ? 'include' : 'exclude',
					value: [{
						ansName: 'ans:procedimento',
						edocName: 'procedimento',
						order: 1,
						value: [{
							ansName: 'ans:codigoTabela',
							edocName: 'codigoTabela',
							order: 1,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[4].procedimento.codigoTabela
						}, {
							ansName: 'ans:codigoProcedimento',
							edocName: 'codigoProcedimento',
							order: 2,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[4].procedimento.codigoProcedimento
						}, {
							ansName: 'ans:descricaoProcedimento',
							edocName: 'descricaoProcedimento',
							order: 3,
							value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[4].procedimento.descricaoProcedimento
						}]
					}, {
						ansName: 'ans:quantidadeSolicitada',
						edocName: 'quantidadeSolicitada',
						order: 2,
						value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.procedimentosSolicitados[4].quantidadeSolicitada
					}]
				}, {
					ansName: 'ans:dadosExecutante',
					edocName: 'dadosExecutante',
					order: 12,
					value: [{
						ansName: 'ans:codigonaOperadora',
						edocName: 'codigonaOperadora',
						order: 1,
						value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosExecutante.codigonaOperadora
					}, {
						ansName: 'ans:nomeContratado',
						edocName: 'nomeContratado',
						order: 2,
						value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosExecutante.nomeContratado
					}, {
						ansName: 'ans:CNES',
						edocName: 'CNES',
						order: 3,
						value: validData => validData.prestadorParaOperadora.solicitacaoProcedimento.solicitacaoSPSADT.dadosExecutante.CNES
					}]
				}]
			}]
		}]
	}
	//INSERT SCHEMA
]