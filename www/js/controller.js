var controlador = angular.module('controladors', ['ionic-toast']);

controlador.controller('LoginController', function($scope, $http,  $httpParamSerializerJQLike, $state, ionicToast, $window, variables) {
 $('.scroll').css('height','auto');
  var registrado = true;
  var emailvisible = true;
  $scope.showRegistre = function(){

    if(registrado == true){
      var input = document.getElementById('registreInput');
      var text = document.getElementById('registroText');
      var email = angular.element('#enviarEmail');
      email.hide();
      angular.element('#buttonForm').hide();
      angular.element('#registroForm').show();
      input.style.display ="block";
      text.innerHTML ="<p>¿ Ya estás registrado ?<p>";
      registrado = false;
    }
    else {
      var input = document.getElementById('registreInput');
      var button = document.getElementById('buttonForm');
      var text = document.getElementById('registroText');
      var email = angular.element('#enviarEmail');
      email.show();
      angular.element('#buttonForm').show();
      angular.element('#registroForm').hide();
      input.style.display ="none";
      text.innerHTML ="<p>Regístrate en Sprint<p>";
      registrado = true;
    }
    
  };

  $scope.showEmail = function(){

      if(emailvisible == true){
          var input = angular.element('#registreInput');
          var button = angular.element('#buttonForm');
          var email = angular.element('#enviarEmail');
          var usuarioc = angular.element('#usuario');
          var contrac = angular.element('#contra');
          var text = angular.element('#registroText');
          button.html('Enviar');
          input.show();
          usuarioc.hide();
          contrac.hide();
          text.hide();
          email.html("<p>Volver atras</p>");
          emailvisible = false;
      }
      else{
          var input = angular.element('#registreInput');
          var button = angular.element('#buttonForm');
          var email = angular.element('#enviarEmail');
          var usuarioc = angular.element('#usuario');
          var contrac = angular.element('#contra');
          var text = angular.element('#registroText');
          button.html('Entrar');
          input.hide();
          usuarioc.show();
          contrac.show();
          text.show();
          email.html("<p>¿ Has olvidado la contraseña ?</p>");
          emailvisible = true;
      }
  };
  
  $scope.login = function(){
	  var user = angular.element('#usuario').find('input').val();
	  var pass = angular.element('#contra').find('input').val();
	    $http({
		  method: 'POST',
		  url: variables.url+"/site/login",
		  data: $httpParamSerializerJQLike({ 'LoginForm[username]':user, 'LoginForm[password]':pass, "token":variables.token }),
		  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	  	}).then(function successCallback(response) {
        var obj = angular.fromJson(response);
        if(obj.data.msg == "ok"){
          $window.localStorage['id'] = obj.data.id;
          $window.localStorage['username'] = obj.data.username;
          $window.localStorage['puntuacio'] = obj.data.puntuacio;
          $window.localStorage['username'] = user;
          $window.localStorage['password'] = pass;
          $state.go('app.tabs.individual');
        }
        else {
          ionicToast.show(response.data, 'bottom', false, 2500);
        } 
		  }, function errorCallback(response) {
	      ionicToast.show('Error en la conexión', 'bottom', false, 2500);
		  });

  };

  
  $scope.registre = function(){
    var user = angular.element('#usuario').find('input').val();
    var pass = angular.element('#contra').find('input').val();
    var email = angular.element('#registreInput').find('input').val();

    $http({
      method: 'POST',
      url: variables.url+"/jugador/registre",
      data: $httpParamSerializerJQLike({ 'Registro[username]':user, 'Registro[password]':pass, 'Registro[email]':email, "token":variables.token }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function successCallback(response) {
        if(response.data == 'S\'ha creat correctament el usuari'){
          ionicToast.show(response.data, 'bottom', false, 2500);
          $scope.login();
        }
        else {
          ionicToast.show(response.data, 'bottom', false, 2500);
        } 
    }, function errorCallback(response) {
        ionicToast.show('Error en la conexión', 'bottom', false, 2500);
    });

  };



});

controlador.controller('MenuController', function($ionicActionSheet, variables, $window, ionicToast, $ionicScrollDelegate, $ionicHistory, $state, $ionicPopup, $scope, $httpParamSerializerJQLike, $ionicSideMenuDelegate, $http) {
  $('.scroll').css('height','auto');
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.toggleRight = function() {
    $ionicSideMenuDelegate.toggleRight();
  };

  $scope.doRefresh = function(){
    $scope.getAmics();
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.getAmics = function(){
    $http({
        method: 'POST',
        url: variables.url+"/jugador/getAmics",
        data: $httpParamSerializerJQLike({ 'Amic[id]':$window.localStorage['id'], "token":variables.token }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function successCallback(response) {
        $scope.amics = response.data.amics;
        $scope.pendents = response.data.pendent;
        $scope.esperant = response.data.esperant;
      }, function errorCallback(response) {
          ionicToast.show('Error en la conexión', 'bottom', false, 2500); 
      });
  };

  $scope.acceptarAmic = function(id){
    console.log(id);
    $http({
        method: 'POST',
        url: variables.url+"/jugador/acceptNotiAmic",
        data: $httpParamSerializerJQLike({ 'NotiAmic[id]':id, "token":variables.token }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function successCallback(response) {
          $scope.getAmics();
      }, function errorCallback(response) {
          ionicToast.show('Error en la conexión', 'bottom', false, 2500); 
    });
  };

  $scope.showVistaAmic = function(){
    var desplegable = angular.element('#añadirUsuario');
    desplegable.show("slow");
  };

  $scope.sendNotiamic = function(){
    var user = angular.element('#Useragregar').val();
    var desplegable = angular.element('#añadirUsuario');
    $http({
        method: 'POST',
        url: variables.url+"/jugador/sendNoti",
        data: $httpParamSerializerJQLike({ 'NotiAmic[id]':$window.localStorage['id'], 'NotiAmic[username]':user, "token":variables.token }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function successCallback(response) {
          ionicToast.show(response.data, 'bottom', false, 2500);
          $scope.getAmics();
          desplegable.hide("slow");
      }, function errorCallback(response) {
          ionicToast.show('Error en la conexión', 'bottom', false, 2500); 
    });
  };

  $scope.eliminarAmic = function(id){
    $ionicActionSheet.show({
       destructiveText: 'Delete',
       titleText: '¿Estás seguro de eliminar tu amigo?',
       cancelText: 'Cancelar',
       cancel: function() {
            // add cancel code..
          },
       destructiveButtonClicked: function() {
         $http({
            method: 'POST',
            url: variables.url+"/jugador/eliminaAmic",
            data: $httpParamSerializerJQLike({ 'EliminaAmic[id]':id, 'EliminaAmic[userId]':$window.localStorage['id'], "token":variables.token }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).then(function successCallback(response) {
              ionicToast.show(response.data, 'bottom', false, 2500);
              $scope.getAmics();
          }, function errorCallback(response) {
              ionicToast.show('Error en la conexión', 'bottom', false, 2500); 
        });
         return true;     
       }
     });
  };

 




  $scope.logout = function(){
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
    $window.localStorage.removeItem('id');
    $window.localStorage.removeItem('username');
    $window.localStorage.removeItem('password');
    $state.go('login');
  };

    $scope.getHistorial = function(){
      $http({
        method: 'POST',
        url: variables.url+"/jugador/historialonline",
        data: $httpParamSerializerJQLike({ 'Historial[id]':$window.localStorage['id'], "token":variables.token }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function successCallback(response) {
        if(response.data!=null && response.data!=""){
          $scope.historial = response.data.historial;
          $scope.nomPersonal =$window.localStorage['username'];
          $scope.partidasGanadas = response.data.guanyades;
          $scope.partidasPerdidas = response.data.perdudes;
          $scope.partidasJugadas = response.data.jugades;
          $scope.nivell = response.data.nivell;
          $scope.restant = response.data.restant;
          $(".demo").mambo({
          percentage: $scope.restant,
          displayValue: false, 
          label: $scope.nivell,
          circleColor: '#34495E',
          ringColor: '#4E82B3'
        });
          angular.element(".spinner-spiral").hide();
          angular.element(".global").show();
        }
        else {
          console.log(response);
        }
      }, function errorCallback(response) {
          ionicToast.show('Error en la conexión', 'bottom', false, 2500);
      });
  };

  $scope.getHistorial();
  
  $scope.doRefreshProfile = function(){
    $scope.getHistorial();
    $scope.$broadcast('scroll.refreshComplete');
  };


  $scope.getAmics();
});

controlador.controller('PerfilController', function($window, ionicToast, $scope, $http,  $httpParamSerializerJQLike, variables){
  $('.scroll').css('height','auto');


  $scope.getHistorial = function(){
      $http({
        method: 'POST',
        url: variables.url+"/jugador/historialonline",
        data: $httpParamSerializerJQLike({ 'Historial[id]':$window.localStorage['id'], "token":variables.token }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function successCallback(response) {
      	if(response.data!=null && response.data!=""){
      		$scope.historial = response.data.historial;
      		$scope.partidasGanadas = response.data.guanyades;
      		$scope.partidasPerdidas = response.data.perdudes;
      		$scope.partidasJugadas = response.data.jugades;
      		$scope.nivell = response.data.nivell;
      		$scope.restant = response.data.restant;
      		$(".demo").mambo({
			    percentage: $scope.restant,
			    displayValue: false, 
			    label: $scope.nivell,
			    circleColor: '#34495E',
			    ringColor: '#4E82B3'
			  });
          angular.element(".spinner-spiral").hide();
          angular.element(".global").show();
      	}
      	else {
      		console.log(response);
      	}
      }, function errorCallback(response) {
          ionicToast.show('Error en la conexión', 'bottom', false, 2500);
      });
  };

$scope.getHistorial();
  
  $scope.doRefresh = function(){
    $scope.getHistorial();
    $scope.$broadcast('scroll.refreshComplete');
  };


  
});

controlador.controller('IndividualController', function(variables, $window, $scope) {
  $('.scroll').css('height','auto');
     
     var puntuacion = $window.localStorage['puntuacio'];
     var distancia = 10;
     var tiempo = 15;
     var res = [];

     var mirarNivel = function(puntuacion){
        if(puntuacion >= 100 && puntuacion < 1000){
          var res = String(puntuacion);
          return res[1];
        }
          else if(puntuacion < 100){
              var res = String(puntuacion);
              return res[0];
          }
            else if(puntuacion >=1000){
              var res = String(puntuacion);
              var medidaString = res.length;
              var posicion = medidaString-2;
              return res[posicion];
            }
    };

    var calcular = function(puntuacion, distancia, tiempo){
        var nivelPartida;
        var disTiempo = [];

        if(puntuacion>=0 && puntuacion<100){
          nivelPartida = mirarNivel(puntuacion);
          distancia = distancia;
          tiempo = tiempo;
          disTiempo = [distancia,tiempo];
          return disTiempo;
        }
          else if(puntuacion>=100 && puntuacion<=9999){
            var nivelTotalDecimal = puntuacion/100;
            var nivelTotal = Math.floor(nivelTotalDecimal);
            var p = nivelTotal * 3; 
            var t = nivelTotal * 3;
            distancia = distancia+p;
            tiempo = tiempo+t;
            disTiempo = [distancia,tiempo];
            return disTiempo;
          }
    };

     var resultado = mirarNivel(puntuacion);
     var dis;
     var tiem;

     var funcion = function(resultado){
       var j = 0; 
       var tiempoResta = 0.7;
       var niveles = angular.element('.nivel').children('div');
       var a = angular.element('.nivel');
       var p = angular.element('.nivel2').children('p');
       var s = angular.element('.nivel2').children('div');
       var i = angular.element('.nivel2').children('i');
       var desbloqueado = parseInt(resultado);
       var distanciaTiempo = calcular(puntuacion, distancia, tiempo);
       console.log(distanciaTiempo);
       dis = distanciaTiempo[0];
       tiem = distanciaTiempo[1];

       while(j<=10){

        

        if(j<resultado){
              niveles.eq(j).addClass('iconoNivelPasado');
              p.eq(j).addClass('nivel');
              //p.eq(j).html('Ganada');
              s.eq(j).addClass('numero');
              s.eq(j).html(j+1);
              /*i.eq(j).addClass('ion-ribbon-a');
              i.eq(j).addClass('iconoPasado');*/
          }
          else if(j==desbloqueado){
            niveles.eq(j).addClass('iconoSiguienteNivel');
            p.eq(j).addClass('nivel');
            //p.eq(j).html('En curso');
            s.eq(j).addClass('numero');
            s.eq(j).html(j+1);
            /*i.eq(j).addClass('ion-unlocked');
            i.eq(j).addClass('iconoSiguiente');*/
            a.eq(j).attr('href','#/juegoIndividual/'+dis+'/'+Math.round(tiem*10)/10);
            //angular.element('a').attr('ng-click','pepe('+dis+','+tiem+')');
            //angular.element('a').attr('href','')
          }
          else{
            niveles.eq(j).addClass('iconoNivelBloqueado');
            i.eq(j).addClass('ion-locked');
            i.eq(j).addClass('iconoBloqueado');
          }
          tiem = tiem-tiempoResta;
          j++;
       }
          
    };
    
    $scope.pepe=function(dis, tiem){
        alert(dis+tiem);
    };
    //llamamos a la funcion para crear las partidas
    funcion(resultado);

});


controlador.controller('MultijugadorController', function(variables, $window, ionicToast, $ionicScrollDelegate, $ionicHistory, $timeout, $state ,$scope, $http,  $httpParamSerializerJQLike) {
      $('.scroll').css('height','auto');
      $ionicScrollDelegate.freezeScroll(false);
      var botoInvitar = angular.element('#botoInvitar');
      var llistaAmics = angular.element('#llistaAmics');
      var mostrarAmic = angular.element('#lista2');
      var distanciatext = angular.element('#distancia');
      var range = angular.element('#range');
      var seguent = angular.element('#seguent');
      var enrere = angular.element('#enrere');
      var listaPendientes = angular.element('#listaMultijugador');

      $scope.createPartida = function(){
        listaPendientes.hide();
        angular.element('#botoCrearPartida').hide();
        distanciatext.show();
        botoInvitar.show();
        range.show();
        seguent.show();
        enrere.show();
      };        

      $scope.getAmics = function(){
        llistaAmics.show();
        
        $http({
          method: 'POST',
          url: variables.url+"/jugador/getAmics",
          data: $httpParamSerializerJQLike({ 'Amic[id]':$window.localStorage['id'], "token":variables.token }),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
          $scope.amics = response.data.amics;
        },  function errorCallback(response) {
              ionicToast.show('Error en la conexión', 'bottom', false, 2500);
            });
      };

    $scope.afegirAmic = function(nom, id){
        $scope.id_jug2 = id;
        botoInvitar.hide();
        llistaAmics.hide();
        $scope.nomJug = $window.localStorage['username'];
        $scope.nom = nom;
        mostrarAmic.show();
        distanciatext.show();
        range.show();
        seguent.show();
        enrere.show();        
    };

    $scope.volverAtras = function(){
        listaPendientes.show();
        angular.element('#botoCrearPartida').show();
        botoInvitar.hide();
        mostrarAmic.hide();
        distanciatext.hide();
        range.hide();
        seguent.hide();
        enrere.hide();
    };
  
    $scope.data = { 'distancia' : '0' };
    
    var timeoutId = null;
    
    $scope.$watch('data.distancia', function() {
        if(timeoutId !== null) {
            return;
        }
        timeoutId = $timeout( function() {  
            $timeout.cancel(timeoutId);
            timeoutId = null;
    });
        }, 1000);

    $scope.crearPartida = function(){
      $http({
          method: 'POST',
          url: variables.url+"/jugador/creatematch",
          data: $httpParamSerializerJQLike({ 'CreateMatch[id_jugador1]':$window.localStorage['id'], 'CreateMatch[id_jugador2]':$scope.id_jug2, 'CreateMatch[distancia]':$scope.data.distancia, "token":variables.token }),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            ionicToast.show(response.data, 'bottom', false, 2500);
            $scope.volverAtras();
        },function errorCallback(response) {
              ionicToast.show('Error en la conexión', 'bottom', false, 2500);
        });
    };


    var obtePartides = function(){
      $http({
          method: 'POST',
          url: variables.url+"/jugador/getmatches",
          data: $httpParamSerializerJQLike({ 'Matches[id]':$window.localStorage['id'], "token":variables.token}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            $scope.pendents = response.data.PendentJugar;
            $scope.espera = response.data.EsperaJugar;
            angular.element(".spinner-spiral").hide();
            angular.element(".global").show();
        },function errorCallback(response) {
              ionicToast.show('Error en la conexión', 'bottom', false, 2500);
        });
    };

    obtePartides();

    $scope.doRefresh = function(){
      obtePartides();
      $scope.$broadcast('scroll.refreshComplete');
    };

});





controlador.controller('JuegoController', function(variables, $window, ionicToast, $scope, $http,$httpParamSerializerJQLike,  $ionicScrollDelegate, $stateParams) { 
  var idPartida = $stateParams.juegoId;
  var meters;  
  var jugId = $window.localStorage['id'];
  var started = false;
  var backgroundP = 100;
  var entra = true;
  var getPartida = function(){
    $http({
          method: 'POST',
          url: variables.url+"/jugador/obtepartida",
          data: $httpParamSerializerJQLike({ 'Partida[usuari]':$window.localStorage['id'],'Partida[id]':idPartida, "token":variables.token}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            meters = response.data.distancia;
            setTimeout(function(){
                $scope.heightTotal = conversor(meters, 1)+"px";
                $scope.heightRestant = meters;
                countController();
            },3000);
            setTimeout(function(){
              started = true;
              angular.element(".stopContador").hide();
            }, 5000);
            contador();
        },function errorCallback(response) {
              ionicToast.show('Error en la conexión', 'bottom', false, 2500);
        });
  };

  getPartida();


  $scope.getScrollPosition = function(){
   var maxScrollableDistanceFromTop = $ionicScrollDelegate.getScrollView().__maxScrollTop;
    if(maxScrollableDistanceFromTop > 1000){
        var distanceFromTop =  $ionicScrollDelegate.getScrollPosition().top;
        var maxScrollableDistanceFromTop = $ionicScrollDelegate.getScrollView().__maxScrollTop;
        if(entra == false){
          $ionicScrollDelegate.scrollTop(false);
        }
        if (distanceFromTop >= maxScrollableDistanceFromTop) {
              entra = false;
              clearInterval(timer);
              $scope.metros = meters;
              $scope.$apply();
              $('.scroll').css('height','auto');
              $ionicScrollDelegate.scrollTop(false);
              $http({
                      method: 'POST',
                      url: variables.url+"/jugador/savePartida",
                      data: $httpParamSerializerJQLike({ 'Partida[usuari]':jugId,'Partida[id]':idPartida, 'Partida[temps]':$scope.segons, "token":variables.token}),
                      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        angular.element('.nice').show();
                        $('.scroll').css('height','auto');
                    },function errorCallback(response) {
                          ionicToast.show('Error en la conexión', 'bottom', false, 2500);
                    });
        }
        else if(entra == true){
          backgroundP = backgroundP + 2;
          var diferencia = maxScrollableDistanceFromTop - distanceFromTop;
          angular.element(".background-login").css('background-position',backgroundP+"px "+backgroundP+"px");
          var metros =  conversor(diferencia, 2);
          $scope.heightRestant = Math.round(metros*10) / 10;
          $scope.$apply();
        }
      }
  };

  var conversor = function(data, opcion){
    if(opcion==1){
      total = data*3779.527559055;
    }
    else {
      total = data/3779.527559055;
    }
    
    return total;
  };

  var timer;
  function countController(){

        $scope.segons = 0;    
        timer = setInterval(function(){
            $scope.segons++;
            $scope.$apply();
        }, 1000); 
  };
  var contador;
  function contador(){
      $('.scroll').css('height','100%');
      $scope.contador = 3;
        contador = setInterval(function(){
            $scope.contador--;
            $scope.$apply();
            if($scope.contador<=0){
              clearInterval(contador);
              angular.element(".contador").hide();
              angular.element(".progress").hide();
              angular.element(".stopContador").show();
            }
        }, 1200); 
  };
});

controlador.controller('JuegoIndividualController', function(variables,$window,ionicToast, $scope, $http,$httpParamSerializerJQLike,  $ionicScrollDelegate, $stateParams) {  
  var jugId = $window.localStorage['id'];
  $scope.segonsPartida = $stateParams.tiem;
  var backgroundP = 100;
  var entra = true;
  var started = false;
  var meters = $stateParams.dis;

  var getPartida = function(){
      setTimeout(function(){
          $scope.heightTotal = conversor(meters, 1)+"px";
          $scope.heightRestant = meters;
          countController();
      },3000);
      setTimeout(function(){
          started = true;
          angular.element(".stopContador").hide();
          }, 5000);
          contador();
  }; 

  getPartida();
  var total;
$scope.getScrollPosition = function(){
    var metrosRecorridos;
    var maxScrollableDistanceFromTop = $ionicScrollDelegate.getScrollView().__maxScrollTop;
    if(maxScrollableDistanceFromTop > 1000){
      var distanceFromTop =  $ionicScrollDelegate.getScrollPosition().top;
      var maxScrollableDistanceFromTop = $ionicScrollDelegate.getScrollView().__maxScrollTop;
      if(entra == false){
          $ionicScrollDelegate.scrollTop(false);
      }
      else if ($scope.segons == 0 && $scope.heightRestant>0) {
            entra = false;
            $scope.segons = $stateParams.tiem;
            $scope.$apply();
            angular.element('.bad').show();
            $('.scroll').css('height','auto');
      }   
          else  if(entra == true && $scope.heightRestant>0){
              backgroundP = backgroundP + 2;
              var diferencia = maxScrollableDistanceFromTop - distanceFromTop;
              angular.element(".background-login").css('background-position',backgroundP+"px "+backgroundP+"px");
              var metros =  conversor(diferencia, 2);
              $scope.heightRestant = Math.round(metros*10) / 10;
              $scope.$apply();
          }
              else if($scope.heightRestant <= 0){
                  entra = false;
                  clearInterval(timer);
                  $scope.metrosRecorridos = $stateParams.dis;
                  var temps_realitzat = $scope.segons;
                  console.log($stateParams.tiem);
                  console.log($scope.segons);
                  $scope.$apply();
                  angular.element('.nice').show();
                  $('.scroll').css('height','auto');
                  $http({
                      method: 'POST',
                      url: variables.url+"/jugador/savePartidaOff",
                      data: $httpParamSerializerJQLike({ 'PartidaOff[puntuacio_partida]':10,'PartidaOff[guanyada]':1, 'PartidaOff[temps_realitzat]':$scope.segons, 'PartidaOff[temps]':$stateParams.tiem, 'PartidaOff[id_jugador]':jugId, "token":variables.token}),
                      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                      }).then(function successCallback(response) {
                        angular.element('.nice').show();
                        console.log($window.localStorage['puntuacio']);
                        $window.localStorage['puntuacio'] = parseInt($window.localStorage['puntuacio']) + 10;
                        console.log($window.localStorage['puntuacio']);
                        $('.scroll').css('height','auto');
                      },function errorCallback(response) {
                        ionicToast.show('Error en la conexión', 'bottom', false, 2500);
                  });
              }
    }
};

  var conversor = function(data, opcion){
    if(opcion==1){
      total = data*3779.527559055;
    }
    else {
      total = data/3779.527559055;
    }
    
    return total;
  };

    var timer;
    function countController(){
      $scope.segons = $stateParams.tiem;    
      timer = setInterval(function(){
          milisegons = $scope.segons-0.1;
          $scope.segons = Math.round(milisegons*10)/10;
          $scope.$apply();
          if($scope.segons<=0){
            clearInterval(timer);
            $scope.segons = 0;
          }
      }, 100);  
    }

  var contador;
  function contador(){
      $('.scroll').css('height','100%');
      $scope.contador = 3;
        contador = setInterval(function(){
            $scope.contador--;
            $scope.$apply();
            if($scope.contador<=0){
              clearInterval(contador);
              angular.element(".contador").hide();
              angular.element(".progress").hide();
              angular.element(".stopContador").show();
            }
        }, 1200); 
  };

});

controlador.controller('TabsController', function(variables, $scope, ionicToast, $http, $httpParamSerializerJQLike, $window){
  var getNotifications = function(){
    $http({
        method: 'POST',
        url: variables.url+"/jugador/totalPartidesOnline",
        data: $httpParamSerializerJQLike({ 'Total[usuari]':$window.localStorage['id'], "token":variables.token}),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function successCallback(response) {
        $scope.total = response.data.total;
        $scope.$apply();
      },function errorCallback(response) {
        ionicToast.show('Error en la conexión', 'bottom', false, 2500);
      });
  };
  getNotifications();
});

