/**
 * @author Eduardo Cervan
 * @version 1.0
 * 
 */
 
var fnjbtec = {
    /* inicia variáveis */
	Debug: false,

	 
	 /*=================================Métodos responsáveis pelas conexões ao content manager*======================================/
	 
	 
	 
	 /**
     * metodo responsável por realizar a conexão com o content manager 
     * @param string obj - Objeto post enviado pelo form
     * @return string
     **/
	contentManagerAutenticator : function(obj){
		testing = "usuario="+obj.usuario.value+"&senha="+obj.senha.value+"&url="+obj.url.value;
		alert(testing);
		/*
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "ContentManagerConect",
			data: "usuario="+obj.usuario.value+"&senha="+obj.senha.value+"&url="+obj.url.value,
			beforeSend: function(){
				//$("#load-login").show();
			},
			success: function(d){
				//$("#load-login").hide();
			}
		});
	return false;	
	*/
	}
};