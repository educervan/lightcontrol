var fnjbtec = {
    /* inicia variáveis */
	Debug: false,

    /* executa login do usuário */
	execLogin : function(obj){
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "Login",
			data: {
                            usuario: obj.usuario.value,
                            senha: obj.senha.value
                        },
                        beforeSend: function(){
                            $("#load-login").show();
                        },
			success: function(d){
                            $("#debub").html(d);
                            $("#load-login").hide();
                            alert("chegou aqui e mostrou "+d.type);
				if(!d.type){
                                    $.gritter.add({
                                        title: "Falha ao efetuar o login",
                                        text: " "+d.message
                                    });
                                    return;
				}else{
				location.href='/Dashboard';
                            }
                        }
		});
	return false;	
	},
        
        /* Lista os players do servidor durante a instalação/edição do app */
        appListaPlayers : function(){
            
            var scalaUser = $("#scalaUser").val();
            var scalaPass = $("#scalaPass").val();
            var selScalaUrl = $( "#selScalaUrl option:selected" ).val();
            var scalaUrl = $("#scalaUrl").val();
            
            if(selScalaUrl == "outro" && scalaUrl == ""){
                $.gritter.add({
                    title: "Falha ao conectar com o servidor",
                    text: "Selecione um servidor da lista ou digite um endereço."
                });
                var scalaUrl = $("#scalaUrl").val();
            }else if(selScalaUrl == "outro" && scalaUrl != ""){
                var scalaUrl = $("#scalaUrl").val();
            }else if(selScalaUrl != "outro" && scalaUrl == ""){
                var scalaUrl = selScalaUrl;
            }else if(selScalaUrl == "" && scalaUrl != ""){
                var scalaUrl = scalaUrl;
            }
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "PlayerList",
			data: "scalaUrl="+scalaUrl+"&scalaUser="+scalaUser+"&scalaPass="+scalaPass,
                        beforeSend: function(){
                            $("#conectaCM").attr("disabled","disabled");
                            $("#icoConectaCM").addClass("fa-spin");
                        },
			success: function(d){
                            $("#icoConectaCM").removeClass("fa-spin");
                            $("#installNext").removeAttr("disabled");
                            $("#conectaCM").removeClass("btn-warning");
                            $("#conectaCM").addClass("btn-success");
                            $("#conectaCM").text("Conectado");
                            selPlayers = d;
                            $("#btnAddPlyr").css("display","block"); //habilita botão "add player" na pagina de configuração
                            $("#selPlayers").html(selPlayers);
                        },
                        error: function(xhr, ajaxOptions, thrownError){
                            $("#icoConectaCM").removeClass("fa-spin");
                            $("#conectaCM").removeAttr("disabled");
                            $.gritter.add({
                                title: "Falha ao conectar com o servidor",
                                text: "Ocorreu um erro ao tentar se conectar ao servidor."
                            });
                        }
		});
	return false;	
	},
        
        /* Mostra ou esconde o campo para digitar o endereço do servidor quando esta instalando APP */
        appInstallUrl : $( "#selScalaUrl" ).change(function(){
            var selScalaUrl = $( "#selScalaUrl option:selected" ).val();
            var txtServer = $("#txtServer");
            
            if(selScalaUrl === "outro"){
                $("#txtServer").removeAttr("hidden");
            }else{
                $("#txtServer").attr("hidden","hidden");
            }
	}),
        
        
        
        /* Desinstala o app do player */
        excluiAppPlyr : function(appId,playerId,srvUrl){
            var excluir = confirm("Tem certeza que deseja excluir o app do player "+playerId+"?");
                        
            if(excluir === true){
                $.ajax({
			type: "POST",
			dataType: "json",
			url: "ExcluiAppPlyr",
			data: "appId="+appId+"&playerId="+playerId,
                        success: function(d){
                            alert("Player removido!");
                            
                            var postFormStr = "<form method='POST' action='ConfigurarAppSrv'>";
                            postFormStr += "<input type='hidden' name='appId' value='" + appId + "'></input>";
                            postFormStr += "<input type='hidden' name='srvUrl' value='" + srvUrl + "'></input>";
                            postFormStr += "</form>";

                            var formElement = $(postFormStr);

                            $('body').append(formElement);
                            $(formElement).submit();
                        },
                        error: function(xhr, ajaxOptions, thrownError){
                            $.gritter.add({
                                title: "Falha ao tentar desinstalar",
                                text: "Ocorreu um erro ao tentar desinstalar o app do player."
                            });
                        }
		});
            }
	},
        
        
        
        /* Add player ao App */
        addAppPlyr : function(appId){
            var scalaUrl = $("#scalaUrl").val();
            var scalaPlayers = $("#selPlayers option:selected").map(function(){
                return $(this).val();
                }).toArray();            
            var appId = appId;
            
            $.ajax({
                type: "POST",
                dataType: "json",
                url: "AddAppPlayer",
                data: "appId="+appId+"&srvUrl="+scalaUrl+"&players="+scalaPlayers,
                success: function(d){                    
                    if(d['success']){
                    $.gritter.add({
                        title: "Player(s) adicionado(s) com sucesso!",
                        text: d['message']
                    });

                    var postFormStr = "<form method='POST' action='ConfigurarAppSrv'>";
                        postFormStr += "<input type='hidden' name='appId' value='" + appId + "'></input>";
                        postFormStr += "<input type='hidden' name='srvUrl' value='" + scalaUrl + "'></input>";
                        postFormStr += "</form>";

                        var formElement = $(postFormStr);

                        $('body').append(formElement);
                        $(formElement).submit();
                    }else{
                        $.gritter.add({
                        title: "Falha ao tentar adicionar player(s)!",
                        text: d['message']
                        });
                    }
                },
                error: function(xhr, ajaxOptions, thrownError){
                    alert(xhr.responseText['message']);
                    alert(thrownError);
                    $.gritter.add({
                        title: "Falha ao tentar adicionar player(s)",
                        //text: "Ocorreu um erro ao tentar desinstalar o app do servidor."
                    });
                }
            });
	},
        
        
        
        
        /* Desinstala o app do servidor */
        excluiAppSrv : function(appId,srvUrl){
            var excluir = confirm("Tem certeza que deseja excluir o app do servidor "+srvUrl+"?");
                        
            if(excluir === true){
                $.ajax({
			type: "POST",
			dataType: "json",
			url: "ExcluiAppSrv",
			data: "appId="+appId+"&srvUrl="+srvUrl,
                        success: function(d){
                            $.gritter.add({
                                title: "Servidor removido com sucesso!",
                                //text: "Ocorreu um erro ao tentar desinstalar o app do servidor."
                            });
                            
                            var postFormStr = "<form method='POST' action='/App/"+appId+"'>";
                            postFormStr += "</form>";

                            var formElement = $(postFormStr);

                            $('body').append(formElement);
                            $(formElement).submit();
                            
                        },
                        error: function(xhr, ajaxOptions, thrownError){
                            $.gritter.add({
                                title: "Falha ao tentar remover servidor",
                                //text: "Ocorreu um erro ao tentar desinstalar o app do servidor."
                            });
                        }
		});
            }
	},
        
        
        
        /* Acessa Aplicativo */
        acessaApp : function(appId,accountId,srvUrl){
            var postFormStr = "<form method='POST' action='/"+appId+"/Acessar'>";
            postFormStr += "<input type='hidden' name='accountId' value='" + accountId + "'></input>";
            postFormStr += "<input type='hidden' name='url' value='" + srvUrl + "'></input>";
            postFormStr += "</form>";

            var formElement = $(postFormStr);

            $('body').append(formElement);
            $(formElement).submit();
	},
        
        
        
        /* Revoga ou  cencede permissao do app user ao app */
        appUserAccess : function(operacao,appUserId,appId,srvUrl){
            if(operacao == "grant"){
                var url = "AppUserGrantAccess";
            }else if(operacao == "revoke"){
                var url = "AppUserRevokeAccess";
            }
            $.ajax({
                type: "POST",
                //dataType: "json",
                url: url,
                data: "appUserId="+appUserId+"&appId="+appId+"&srvUrl="+srvUrl,
                success: function(d){
                    
                    $.gritter.add({
                        title: "Usuário habilitado!",
                        //text: "Ocorreu um erro ao tentar desinstalar o app do servidor."
                    });

                    /*var postFormStr = "<form method='POST' action='ConfigurarAppSrv'>";
                    postFormStr += "<input type='hidden' name='appId' value='" + appId + "'></input>";
                    postFormStr += "<input type='hidden' name='srvUrl' value='" + srvUrl + "'></input>";
                    postFormStr += "</form>";

                    var formElement = $(postFormStr);

                    $('body').append(formElement);
                    $(formElement).submit();*/

                },
                error: function(xhr, ajaxOptions, thrownError){
                    alert(thrownError);
                    $.gritter.add({
                        title: "Falha ao tentar habilitar usuário",
                        //text: xhr.responseText
                    });
                    
                    var postFormStr = "<form method='POST' action='ConfigurarAppSrv'>";
                    postFormStr += "<input type='hidden' name='appId' value='" + appId + "'></input>";
                    postFormStr += "<input type='hidden' name='srvUrl' value='" + srvUrl + "'></input>";
                    postFormStr += "</form>";

                    var formElement = $(postFormStr);

                    $('body').append(formElement);
                    $(formElement).submit();
                }
            });
	},
        
        
        
        /* Cadastra app user */
        appAddUser : function(){
            var accountId = $('#addUserAccId').val();
            var appId = $('#addUserAppId').val();
            var srvUrl = $('#addUserSrvDns').val();
            var senha = $('#addUserPass').val();
            var user = $('#addUserLogin').val();
                        
            $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: "AddAppUser",
                    data: "appId="+appId+"&srvUrl="+srvUrl+"&accountId="+accountId+"&senha="+senha+"&user="+user,
                    success: function(d){
                        alert(d);
                        $.gritter.add({
                            title: "Servidor removido com sucesso!",
                            //text: "Ocorreu um erro ao tentar desinstalar o app do servidor."
                        });

                        var postFormStr = "<form method='POST' action='ConfigurarAppSrv'>";
                        postFormStr += "<input type='hidden' name='appId' value='" + appId + "'></input>";
                        postFormStr += "<input type='hidden' name='srvUrl' value='" + srvUrl + "'></input>";
                        postFormStr += "</form>";

                        var formElement = $(postFormStr);

                        $('body').append(formElement);
                        $(formElement).submit();

                    },
                    error: function(xhr, ajaxOptions, thrownError){
                        alert(xhr.responseText);
                        $.gritter.add({
                            title: "Falha ao tentar remover servidor",
                            //text: "Ocorreu um erro ao tentar desinstalar o app do servidor."
                        });
                    }
            });
	},
        
        
        
        /* Verifica se a senha e confirmação de senha são iguais */
        confirmPass : function(senha,confirm,button){
            var senha = $('#'+senha).val();
            var confirm = $('#'+confirm).val();
            var button1 = $('#'+button);
            
            if(senha === confirm){
                $('#icoConfirmPass').css('color','#00ff00');
                $('#icoConfirmPass').html('<i class="fa fa-check"></i>');
                button1.removeAttr("disabled");
            }else{
                $('#icoConfirmPass').css('color','#ff0000');
                $('#icoConfirmPass').html('<i class="fa fa-times"></i>');
                button1.attr("disabled","disabled");
            }
	},
        
        
        
        /* Troca a senha do usuário (selfServiceUser) */
        trocaSenha : function(userId){
            var novaSenha = $('#password').val();
            var senhaAtual = $('#old-password').val();
            
            $.ajax({
                type: "POST",
                dataType: "json",
                url: "PerfilTrocarSenha",
                data: "userId="+userId+"&novaSenha="+novaSenha+"&senhaAtual="+senhaAtual,
                beforeSend: function(){
                  $.blockUI({ 
                    message: '<h3>'+'Alterando a senha, aguarde...'+'</h3>',
                    css: { 
                        border: 'none', 
                        padding: '15px', 
                        backgroundColor: '#000', 
                        '-webkit-border-radius': '10px', 
                        '-moz-border-radius': '10px', 
                        opacity: .5, 
                        color: '#fff' 
                        }
                    }); 
                },
                success: function(d){
                    $.unblockUI();
                    $.gritter.add({
                        title: "Senha alterada com sucesso!"
                        //text: " "
                    });
                    $('#password').val("");
                    $('#password2').val("");
                    $('#old-password').val("");
                    $('#btnAlterarSenha').attr('disabled','disabled');
                },
                error: function(d){
                    $.unblockUI();
                    $.gritter.add({
                        title: "Falha ao tentar alterar a senha!",
                        text: "Tente novamente mais tarde, caso o problema persista entre em contato com nosso suporte."
                    });
                    $('#password').val("");
                    $('#password2').val("");
                    $('#old-password').val("");
                    $('#btnAlterarSenha').attr('disabled','disabled');
                }
            });
	},
        
        
        
        /* Abre pagina de configuração do App/Servidor */
        configuraAppSrv : function(appId,srvUrl){
            var postFormStr = "<form method='POST' action='ConfigurarAppSrv'>";
            
            postFormStr += "<input type='hidden' name='appId' value='" + appId + "'></input>";
            postFormStr += "<input type='hidden' name='srvUrl' value='" + srvUrl + "'></input>";
            
            postFormStr += "</form>";
            
            var formElement = $(postFormStr);

            $('body').append(formElement);
            $(formElement).submit();
	},
        
        
        
        /* Marca como lida a notificação de Ticket */
        notificacaoLidaTicket : function(notId,objetoId,contactId){
            alert(notId+","+objetoId+","+contactId);
            $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: "NotificacaoLida",
                    data: "notId="+notId+"&contactId="+contactId+"&objetoId="+objetoId,
                    success: function(data){
                        alert("success: "+data);
                        fnjbtec.editTicket(objetoId,'<h3>AGUARDE UM INSTANTE</h3><h5>carregando ticket</h5>');
                    },
                    error: function(xhr, ajaxOptions, thrownError){
                        alert("error: "+xhr.responseText);
                        fnjbtec.editTicket(objetoId,'<h3>AGUARDE UM INSTANTE</h3><h5>carregando ticket</h5>');
                    }
            });
	},
        
        
        
        /* Envia email com nova senha para o usuário */
	resetPassword : function(obj){
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "ResetPassword",
			data: "email="+obj.resetarEmail.value,
                        beforeSend: function(){
                          $(".loading-reset-password").show();  
                        },
			success: function(d){
                            if(!d.type){
                                $(".loading-reset-password").hide();  
                                    $.gritter.add({
                                        title: " "+d.title,
                                        text: " "+d.text
                                    });
                                    return;
                            }else{
                           $(".loading-reset-password").hide();  
                                    $.gritter.add({
                                        title: " "+d.title,
                                        text: " "+d.text
                                    });
                                    setTimeout(
                                        function(){
                                           $( "button.close" ).trigger( "click" );
                                        }, 4000
                                    );
                            return;
                                }
                            }
		});
	return false;	
	},

        /*  */
        mudaSolicitacaoTicket: function(){
            $("#setorTicket").change(function(){
                var tipo = $( "select#setorTicket option:selected").val();
            $.post("MudaSolicitacao", {tipo: tipo}, function( data ) {$( "#categoria" ).html( data );});
            });    
        },
        comentarioCompleto: function(id,status){
		$.post("../AbrirComentario", {id: id, status:status}, function( data ) {
		  obj = JSON.parse(data);	
		  $("div#"+obj.id).html(obj.texto);
		});
	},
        
        editTicket: function(id,message){
            this.loadingAnimateTime(8000,message);
            var idTicket = id;
            $.post("../EditarTicket", {idTicket: idTicket}, function( data ) {
              $( ".content" ).html( data );
            });
	},
        loadingAnimateTime: function(time, message){
            $.blockUI({ 
                message: '<h3>'+message+'</h3>',
                css: { 
                    border: 'none', 
                    padding: '15px', 
                    backgroundColor: '#000', 
                    '-webkit-border-radius': '10px', 
                    '-moz-border-radius': '10px', 
                    opacity: .5, 
                    color: '#fff' 
                    }
                });
            setTimeout($.unblockUI, time);
        },
        
        salvaTicket: function(obj){
                    $.ajax({
			type: "POST",
			dataType: "json",
			url: "CadastraTicket",
			data: "setorTicket="+obj.setorTicket.value+"&catTicket="+obj.catTicket.value+"&ticketSubject="+obj.ticketSubject.value+"&ticketMessage="+obj.ticketMessage.value,
                        beforeSend: function(){
                            $("button#btn_ticket_novo").html('<i class="fa fa-refresh fa-spin"></i>');  
                            
                        },
			success: function(d){
  
                            if(!d.type){
                                $.gritter.add({
                                    title: " "+d.title,
                                    text: " "+d.text
                                });
                            }else{
                                $.gritter.add({
                                    title: " "+d.title,
                                    text: " "+d.text
                                });
                            }
                            fnjbtec.editTicket(''+d.id+'','<h3>AGUARDE UM INSTANTE</h3><h5>carregando ticket</h5>');
                        }
		});
	return false;
        },
        salvaComment: function(obj){
            var Comentario = obj.textoComentario.value;
            var idTicket = obj.idTicket.value;
            var ParentId = obj.parentId.value;
            var dono = obj.owner.value;
            var setor = obj.sector.value;
             $.ajax({
			type: "POST",
			dataType: "json",
			url: "../CadastrarComentario",
			data: "Comentario="+Comentario+"&ParentId="+ParentId+"&idTicket="+idTicket+"&dono="+dono+"&setor="+setor,
			success: function(d){
                            if(!d.type){
                                    $.gritter.add({
                                        title: " "+d.title,
                                        text: " "+d.text
                                    });
                            }else{
                                
                                $.gritter.add({
                                        title: " "+d.title,
                                        text: " "+d.text
                                    });
                                fnjbtec.editTicket(''+d.idTicket+'','<h3>AGUARDE UM INSTANTE</h3><h5>carregando ticket</h5>');
                            }
                        }
		});
	return false;
        },
        
        
        keepMenuOpen: function(module){
           
            var menu = $('.main-menu .js-sub-menu-toggle');
            $li = $(menu).parents('li#'+module);
            if( !$li.hasClass('active')){
                    $li.find('.toggle-icon').removeClass('fa-angle-left').addClass('fa-angle-down');
                    $li.addClass('active');
            }
            else {
                    $li.find('.toggle-icon').removeClass('fa-angle-down').addClass('fa-angle-left');
                    $li.removeClass('active');
            } 

            $li.find('.sub-menu').slideToggle(10);
          
        },
        proccessLastLogin: function(recordsPerPage,offset,direction,pageAtual){
            $.ajax({
                type: "POST",
                url: "/LogProccessLastLogin",
                data: "records="+recordsPerPage+"&offset="+offset+"&direction="+direction+"&pageAtual="+pageAtual,
                success: function(d){
                    $("#responseListLogAccess").hide().html(d).fadeIn("slow");
                },
                error: function(d){
                    alert(d);
                }
            });
        },
        
        proccessRecentActivity: function(recordsPerPage,offset,direction,pageAtual){
            $.ajax({
			type: "POST",
			url: "/LogProccessRecentActivity",
			data: "records="+recordsPerPage+"&offset="+offset+"&direction="+direction+"&pageAtual="+pageAtual,
			success: function(d){
                            $("#responseListRecentActivity").hide().html(d).fadeIn("slow");
                        },
                        error: function(d){
                            alert(d);
                        }
		});
        },
             
        
        /* Navega pelos links de apps no menu */
        menuApps : function(appId,accountId){
            alert(appId+" - "+accountId);
            /*
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "PlayerList",
			data: "scalaUrl="+scalaUrl+"&scalaUser="+scalaUser+"&scalaPass="+scalaPass,
                        beforeSend: function(){
                            $("#conectaCM").attr("disabled","disabled");
                            $("#icoConectaCM").addClass("fa-spin");
                        },
			success: function(d){
                            $("#icoConectaCM").removeClass("fa-spin");
                            $("#conectaCM").removeAttr("disabled");
                            selPlayers = d;
                            $("#selPlayers").html(selPlayers);
                        },
                        error: function(){
                            $("#icoConectaCM").removeClass("fa-spin");
                            $("#conectaCM").removeAttr("disabled");
                            $.gritter.add({
                                title: "Falha ao conectar com o servidor",
                                text: "Ocorreu um erro ao tentar se conectar ao servidor."
                            });
                        }
		});*/
	return false;	
	}
};

/* detecta ipad */
jQuery.extend(jQuery.browser,
	{SafariMobile : navigator.userAgent.toLowerCase().match(/iP(hone|ad)/i)}
);
