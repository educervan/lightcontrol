/**
 * @author Eduardo Cervan
 * @version 1.0
 * 
 */
 
var fnjbtec = {
    /* inicia vari�veis */
	Debug: false,

	 
	 /*=================================M�todos respons�veis pelas conex�es ao content manager*======================================/
	 
	 
	 
	 /**
     * metodo respons�vel por realizar a conex�o com o content manager 
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